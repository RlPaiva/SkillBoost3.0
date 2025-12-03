// src/components/community/NewPostForm.tsx
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

type Props = {
  onPosted?: () => void;
};

export default function NewPostForm({ onPosted }: Props) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Você precisa estar logado para publicar.");
      return;
    }
    if (!content.trim()) {
      setError("Digite algo para publicar.");
      return;
    }

    setSubmitting(true);
    const { error: insertErr } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        content: content.trim(),
      },
    ]);

    setSubmitting(false);
    if (insertErr) {
      console.error("Erro ao criar post:", insertErr);
      setError("Falha ao publicar. Tente novamente.");
      return;
    }

    setContent("");
    onPosted && onPosted();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        className="w-full border rounded p-3 min-h-[100px] focus:outline-none focus:ring"
        placeholder="Compartilhe algo com a comunidade..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Compartilhar como: {user?.email}</div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {submitting ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
}
