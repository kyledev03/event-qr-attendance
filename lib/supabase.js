import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL="https://iawhrbbiznzzxjgrsenc.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_2EcwdCfTgEBQyByJ-wKgPA_NIMV-I6a"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)