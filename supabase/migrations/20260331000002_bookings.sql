-- KasiVault: Real-time Booking & Calendar Engine
-- 1. Create BOOKINGS table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id),
    service_id UUID REFERENCES products(id),
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_email TEXT,
    slot_start TIMESTAMP WITH TIME ZONE NOT NULL,
    slot_end TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Cancelled', 'Completed'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enable Realtime for instance "Gig Radar" alerts
-- This allows the Admin Dashboard to refresh the calendar instantly
-- when a new booking is made by a customer.
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- 3. RLS (Row Level Security) for multi-tenancy
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings are site-isolated" ON bookings
    FOR ALL USING (site_id IN (SELECT id FROM sites WHERE owner_id = auth.uid()));

-- Policy for customers to create bookings (Allow Insert based on target site)
-- We use a simple policy that allows anyone to insert if the site_id exists.
CREATE POLICY "Public can book for a valid site" ON bookings
    FOR INSERT WITH CHECK (site_id IS NOT NULL);

-- Index for performance on availability checks
CREATE INDEX idx_bookings_site_slots ON bookings (site_id, slot_start, slot_end);
