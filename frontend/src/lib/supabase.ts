// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

// Debug leve durante build/runtime para ajudar a identificar se as envs chegaram
// (remova os console.log quando tudo estiver ok)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. ' +
      'Set them in Netlify (Environment variables) or locally in .env'
  )
}

// Export único e sempre no topo-level (válido para build)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
