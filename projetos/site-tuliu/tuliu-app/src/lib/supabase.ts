import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dojjedejwpwzvqoomtsj.supabase.co';
const supabaseKey = 'sb_publishable_3F6KIrSQU3K6p_ho6ChqFw_Ws49Bd2v';

export const supabase = createClient(supabaseUrl, supabaseKey);
