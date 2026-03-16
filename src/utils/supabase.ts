import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eewubybunnafnkzamvwp.supabase.co'
const supabaseKey = 'sb_publishable_PaF-_vrfXsey4lzkfs3VoA_qcZF0bzp'

export const supabase = createClient(supabaseUrl, supabaseKey)
