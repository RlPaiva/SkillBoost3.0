// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // Carrega a sessão REAL do Supabase (não apenas o user)
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user ?? null;

        // Se existe sessão mas o usuário NÃO marcou "remember_me", desloga.
        // Isso evita que na primeira abertura o app já esteja "logado".
        if (mounted) {
          const remembered = localStorage.getItem("remember_me") === "true";
          if (sessionUser && !remembered) {
            // remove sessão persisted do supabase
            await supabase.auth.signOut();
            setUser(null);
          } else {
            setUser(sessionUser);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar sessão:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    // Listener para mudanças de auth (login/logout/refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (!res.error && res.data?.user) {
        if (rememberMe) localStorage.setItem("remember_me", "true");
        else localStorage.removeItem("remember_me");
        setUser(res.data.user);
      }
      return { error: res.error };
    } catch (error) {
      console.error("Erro no signIn:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("remember_me");
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
