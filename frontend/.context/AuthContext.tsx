// frontend/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
// Observação: o context está ao lado de src, por isso voltamos um nível e entramos em src/lib
import { supabase } from "../src/lib/supabase";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // pega usuário ao iniciar
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user ?? null);
      } finally {
        setLoading(false);
      }
    })();

    // escuta mudanças de auth (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // event pode ser "SIGNED_IN", "SIGNED_OUT", etc.
      setUser(session?.user ?? null);
    });

    return () => {
      // unsubscribe seguro
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // tenta deslogar no supabase
      await supabase.auth.signOut();
    } catch (err) {
      // mesmo que falhe no supabase, limpa o estado local
      console.error("Erro ao executar supabase.auth.signOut()", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
