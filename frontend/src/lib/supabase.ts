// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// DEBUG: outputa no build para ajudar a diagnosticar (será visível no bundle console)
console.log('VITE_SUPABASE_URL present?', !!supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY present?', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  // não quebremos todo o app com um throw que deixa tela branca sem mensagem;
  // em vez disso criamos um cliente "dummy" que falha de forma controlada nas chamadas
  // e deixamos um console.error claro.
  console.error(
    'Supabase env variables missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify/Vite env.'
  );

  // cria um client com strings vazias para evitar exceção imediata na importação
  // (ops: chamadas a supabase irão falhar, mas o console dará o erro).
  export const supabase = createClient('', '');
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    // suas opções, se houver
  });
}
