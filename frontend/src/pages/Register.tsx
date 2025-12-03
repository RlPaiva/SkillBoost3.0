import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== passwordConfirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      // Supabase signUp (email confirmation flow if enabled on supabase project)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) throw error;

      // If your Supabase requires email confirmation, user must verify email.
      setMessage('Conta criada (verifique seu email para confirmar). Redirecionando para login...');
      setTimeout(() => navigate('/login', { state: { from } }), 1600);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-1">Criar conta</h1>
        <p className="text-sm text-gray-500 mb-6">Crie uma conta para salvar seu progresso e receber recomendações personalizadas.</p>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        {message && <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label>
            <div className="text-xs text-gray-600 mb-1">Nome completo</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Seu nome"
            />
          </label>

          <label>
            <div className="text-xs text-gray-600 mb-1">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="seu@exemplo.com"
            />
          </label>

          <label>
            <div className="text-xs text-gray-600 mb-1">Senha</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Escolha uma senha segura"
            />
          </label>

          <label>
            <div className="text-xs text-gray-600 mb-1">Confirme a senha</div>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Repita a senha"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Entrar</Link>
        </div>
      </div>
    </div>
  );
}
