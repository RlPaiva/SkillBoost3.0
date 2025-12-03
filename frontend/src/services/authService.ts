// frontend/src/services/authService.ts
import { supabase } from "../lib/supabase";

/**
 * Registra usuário com e-mail e senha
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }

  return data;
}

/**
 * Faz login com e-mail + senha
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Erro ao autenticar:", error);
    throw error;
  }

  return data;
}

/**
 * Envia e-mail de reset de senha
 */
export async function resetPassword(email: string, redirectTo?: string) {
  const opts: { redirectTo?: string } = {};
  if (redirectTo) opts.redirectTo = redirectTo;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, opts);

  if (error) {
    console.error("Erro ao solicitar reset de senha:", error);
    throw error;
  }

  return data;
}

/**
 * Faz logout
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Erro ao sair:", error);
    throw error;
  }
}

/**
 * Pega usuário atual (se houver sessão)
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}
