
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('d:/GeneralServices-app/app/.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const userId = '11111111-1111-4111-b111-111111111111'; // Juan Electricista

async function testQuery() {
  console.log('Testing query for Juan Electricista...');

  // 1. Categories
  const { data: proMeta, error: metaError } = await supabase
    .from('professionals_metadata')
    .select('categories')
    .eq('id', userId)
    .single();
  
  if (metaError) {
    console.error('Meta Error:', metaError);
  }
  
  const proCategories = proMeta?.categories || [];
  console.log('Pro Categories:', proCategories);

  // 2. Jobs
  let query = supabase
    .from('jobs')
    .select(`
      *,
      profiles:client_id (
        full_name
      )
    `)
    .in('status', ['open', 'contacted'])
    .neq('client_id', userId);

  if (proCategories.length > 0) {
    query = query.in('category', proCategories);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Jobs Error:', error);
  } else {
    console.log('Jobs found:', data?.length);
    data?.forEach(j => console.log(`- ${j.title} (${j.category})` || 'No title'));
  }
}

testQuery();
