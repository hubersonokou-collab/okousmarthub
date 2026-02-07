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

    const { reference } = await req.json();
    
    if (!reference) {
      throw new Error('Reference is required');
    }

    console.log('Verifying Paystack transaction:', reference);

    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      console.error('Paystack verification error:', errorData);
      throw new Error(errorData.message || 'Verification failed');
    }

    const paystackData = await paystackResponse.json();
    const { status, amount, metadata, channel, paid_at } = paystackData.data;
    
    console.log('Verification result:', status, 'amount:', amount);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update transaction based on verification
    const transactionStatus = status === 'success' ? 'completed' : 
                              status === 'failed' ? 'failed' : 'pending';

    const { error: txError } = await supabase
      .from('transactions')
      .update({
        status: transactionStatus,
        payment_method: channel,
        metadata: paystackData.data,
      })
      .eq('paystack_reference', reference);

    if (txError) {
      console.error('Transaction update error:', txError);
    }

    // Update order if payment successful
    if (status === 'success' && metadata?.order_id) {
      await supabase
        .from('orders')
        .update({ status: 'in_progress' })
        .eq('id', metadata.order_id);
    }

    return new Response(JSON.stringify({
      success: status === 'success',
      status,
      amount: amount / 100, // Convert from kobo
      channel,
      paid_at,
      order_id: metadata?.order_id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Verification error:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
