import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.93.3';
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('PAYSTACK_SECRET_KEY not configured');
    }

    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify webhook signature
    const hash = createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid Paystack signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event.event);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.event === 'charge.success') {
      const { reference, metadata, amount, channel } = event.data;
      const orderId = metadata?.order_id;

      console.log('Payment successful for order:', orderId, 'reference:', reference);

      // Update transaction status
      const { error: txError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          payment_method: channel || 'paystack',
          stripe_payment_id: reference, // Reusing field for Paystack reference
          metadata: event.data,
        })
        .eq('paystack_reference', reference);

      if (txError) {
        console.error('Transaction update error:', txError);
      }

      // Update order status
      if (orderId) {
        const { error: orderError } = await supabase
          .from('orders')
          .update({ status: 'in_progress' })
          .eq('id', orderId);

        if (orderError) {
          console.error('Order update error:', orderError);
        }
      }
    } else if (event.event === 'charge.failed') {
      const { reference, metadata } = event.data;
      console.log('Payment failed for reference:', reference);

      await supabase
        .from('transactions')
        .update({
          status: 'failed',
          metadata: event.data,
        })
        .eq('paystack_reference', reference);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
