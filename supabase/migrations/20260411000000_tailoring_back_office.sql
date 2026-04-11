-- Create Client Measurements table for Tailoring Mode
CREATE TABLE IF NOT EXISTS public.client_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    whatsapp_number TEXT,
    
    -- Upper Body
    chest NUMERIC,
    shoulders NUMERIC,
    neck NUMERIC,
    arm_length NUMERIC,
    biceps NUMERIC,
    
    -- lower Body
    waist NUMERIC,
    hips NUMERIC,
    inseam NUMERIC,
    outseam NUMERIC,
    thigh NUMERIC,
    
    -- Additional Bespoke Data
    notes TEXT,
    status TEXT DEFAULT 'Pending Fitting',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.client_measurements ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Enable read access for all users" ON public.client_measurements
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.client_measurements
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.client_measurements
    FOR UPDATE WITH CHECK (auth.role() = 'authenticated');

-- Create Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_client_measurements_updated_at
    BEFORE UPDATE ON public.client_measurements
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
