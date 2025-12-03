// frontend/src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { resetPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!email) {
      setError("Informe o e-mail");
      return;
    }

    try {
      // usa o redirect que você configurou em env: VITE_SUPABASE_REDIRECT
      const redirect = import.meta.env.VITE_SUPABASE_REDIRECT || window.location.origin;
      await resetPassword(email, redirect);
      setMsg("E-mail de redefinição enviado — verifique sua caixa de entrada.");
    } catch (err: any) {
      setError(err?.message || "Erro ao enviar e-mail");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Recuperar senha</h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Seu e-mail"
            className="p-3 border rounded-lg"
          />

          {error && <div className="text-sm text-red-600">{error}</div>}
          {msg && <div className="text-sm text-green-600">{msg}</div>}

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            Enviar e-mail de recuperação
          </button>
        </form>
      </div>
    </div>
  );
}
