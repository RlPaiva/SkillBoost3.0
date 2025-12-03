// src/components/community/CommentsList.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type Props = {
  postId: string;
};

export default function CommentsList({ postId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true })
        .limit(200);

      if (error) {
        console.error("Erro ao buscar comentários:", error);
      } else if (isMounted) {
        setComments(data || []);
      }
      setLoading(false);
    }
    load();

    const ch = supabase
      .channel(`comments:post_${postId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `post_id=eq.${postId}` },
        (payload) => {
          setComments((prev) => [...prev, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      ch.unsubscribe();
    };
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return alert("Faça login para comentar.");
    if (!newComment.trim()) return;

    const { error } = await supabase.from("comments").insert([
      { post_id: postId, user_id: user.id, content: newComment.trim() },
    ]);

    if (error) {
      console.error("Erro ao enviar comentário:", error);
      alert("Falha ao enviar comentário.");
    } else {
      setNewComment("");
    }
  }

  return (
    <div className="space-y-3">
      {loading && <div className="text-sm text-gray-500">Carregando comentários...</div>}
      {!loading && comments.length === 0 && <div className="text-sm text-gray-500">Seja o primeiro a comentar.</div>}
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="text-sm">
            <div className="text-gray-700 whitespace-pre-wrap">{c.content}</div>
            <div className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none"
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Enviar</button>
      </form>
    </div>
  );
}
