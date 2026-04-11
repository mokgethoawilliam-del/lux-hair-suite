
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ofizmorcfmkttuksdyhq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maXptb3JjZm1rdHR1a3NkeWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3ODEyNzMsImV4cCI6MjA5MDM1NzI3M30.xsJzBKkUfJ_q1ohafZaUg0tJc4x-0J2N-6UJkrmIpLY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createKingsWear() {
  console.log('Creating Kings Wear Identity...');
  
  // Check if site already exists
  const { data: existingSite } = await supabase.from('sites').select('id').eq('subdomain_slug', 'kingswear').single();
  if (existingSite) {
    console.log('Kings Wear already exists. Skipping creation.');
    return;
  }

  // Get owner from lux-hair-suite
  const { data: hairSite } = await supabase.from('sites').select('owner_id').eq('subdomain_slug', 'lux-hair-suite').single();
  const owner_id = hairSite?.owner_id;

  // 1. Create the site
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .insert({
      name: 'Kings Wear Clothing',
      subdomain_slug: 'kingswear',
      owner_id: owner_id
    })
    .select()
    .single();

  if (siteError) return console.error('Site creation failed:', siteError);
  console.log('Site created! ID:', site.id);

  // 2. Initialize metadata for tailoring
  const { error: metaError } = await supabase
    .from('site_metadata')
    .insert({
      site_id: site.id,
      brand_name: 'Kings Wear Clothing',
      business_focus: 'Tailoring & Styling',
      about_us: 'Kings Wear Clothing by King Wiz is dedicated to the art of absolute precision in bespoke tailoring.',
      hero_headline: 'Tailored for Kings',
      hero_description: 'Premium Bespoke Suits & Styling.'
    });

  if (metaError) return console.error('Metadata creation failed:', metaError);
  console.log('Kings Wear Identity Ready! 👑');
}

createKingsWear();
