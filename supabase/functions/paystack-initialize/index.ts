import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.93.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { orderId, email, amount, callbackUrl, metadata } = await req.json();
    
    if (!orderId || !email || !amount) {
      throw new Error('orderId, email, and amount are required');
    }

    console.log('Initializing Paystack payment for order:', orderId, 'amount:', amount);

    // Initialize payment with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack expects amount in kobo/cents
        currency: 'XOF',
        reference: `OSH-${orderId}-${Date.now()}`,
        callback_url: callbackUrl || `${req.headers.get('origin')}/payment/success`,
        metadata: {
          order_id: orderId,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: orderId
            }
          ],
          ...metadata,
        },
      }),
    });

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      console.error('Paystack error:', errorData);
      throw new Error(errorData.message || 'Paystack initialization failed');
    }

    const paystackData = await paystackResponse.json();
    console.log('Paystack initialized:', paystackData.data.reference);

    // Update transaction in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find or create transaction
    const { data: existingTx } = await supabase
      .from('transactions')
      .select('id')
      .eq('order_id', orderId)
      .single();

    if (existingTx) {
      await supabase
        .from('transactions')
        .update({
          paystack_reference: paystackData.data.reference,
          paystack_access_code: paystackData.data.access_code,
          customer_email: email,
          status: 'pending',
        })
        .eq('id', existingTx.id);
    } else {
      await supabase
        .from('transactions')
        .insert({
          order_id: orderId,
          amount,
          paystack_reference: paystackData.data.reference,
          paystack_access_code: paystackData.data.access_code,
          customer_email: email,
          status: 'pending',
          payment_method: 'paystack',
        });
    }

    return new Response(JSON.stringify({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Paystack initialization error:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
