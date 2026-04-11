
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ofizmorcfmkttuksdyhq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maXptb3JjZm1rdHR1a3NkeWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3ODEyNzMsImV4cCI6MjA5MDM1NzI3M30.xsJzBKkUfJ_q1ohafZaUg0tJc4x-0J2N-6UJkrmIpLY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function heal() {
  console.log('Starting nuclear heal...');
  
  const { data, error } = await supabase
    .from('products')
    .update({ site_id: '12dba0ca-7945-4142-b027-427067f1822f' })
    .is('site_id', null)
    .select();

  if (error) {
    console.error('Heal failed:', error);
  } else {
    console.log('Heal successful! Updated items:', data?.length || 0);
  }
}

heal();
