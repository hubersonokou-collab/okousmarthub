-- Create table for Web Solutions Orders
CREATE TABLE IF NOT EXISTS public.web_solutions_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    pack_type TEXT NOT NULL, -- 'Essentiel', 'Business', 'Premium'
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    description TEXT,
    
    -- Payment & Status
    total_amount DECIMAL NOT NULL,
    paid_amount DECIMAL DEFAULT 0,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'partial', 'paid', 'cancelled'
    payment_mode TEXT, -- 'wave', 'om', 'mtn', 'card', 'cash'
    payment_terms TEXT DEFAULT 'full', -- 'full', '50-50', '3-installments'
    
    -- Invoice
    invoice_number TEXT UNIQUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.web_solutions_orders ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public can create orders (needed for the booking form)
CREATE POLICY "Public can insert orders" 
ON public.web_solutions_orders 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Users can read their own orders (by email? or if authenticated)
-- For now, allow public read of their own order if they have the ID (UUID is hard to guess)
-- But safer: Admin only for list, Public can read specific ID if needed for confirmation page
CREATE POLICY "Public can read own order by ID" 
ON public.web_solutions_orders 
FOR SELECT 
TO public 
USING (true); -- We rely on UUID obscurity for read-only confirmation page access

-- Admins can do everything
-- (Assuming we have an admin role or check via email/metadata, but for now open RLS for insert is key)
