// src/components/community/PostCard.tsx
import { useState } from "react";
import { type Post, type Profile } from "./CommunityFeed";
import { supabase } from "../../lib/supabase";
import CommentsList from "./CommentsList";
import { useAuth } from "../../context/AuthContext";

type Props = {
  post: Post;
  author?: Profile;
  onRefresh?: () => void;
};

export default function PostCard({ post, author, onRefresh }: Props) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(post.like_count || 0);
  const [processingLike, setProcessingLike] = useState(false);

  async function handleLike() {
    if (!user) return;
    setProcessingLike(true);
    // simple increment (no uniqueness guard)
    const { error } = await supabase
      .from("posts")
      .update({ like_count: (post.like_count || 0) + 1 })
      .eq("id", post.id);

    setProcessingLike(false);
    if (!error) {
      setLikeCount((c) => c + 1);
      onRefresh && onRefresh();
    } else {
      console.error("Erro ao curtir:", error);
    }
  }

  async function handleDelete() {
    if (!user) return;
    if (!confirm("Excluir este post? Esta ação é irreversível.")) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      console.error("Erro ao deletar post:", error);
    } else {
      onRefresh && onRefresh();
    }
  }

  return (
    <article className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          {author?.avatar_url ? (
            <img src={author.avatar_url} alt={author?.name || "avatar"} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <span className="text-sm text-gray-600">{(author?.name || author?.email || "U").charAt(0)}</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{author?.name || author?.email || "Usuário"}</div>
              <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                disabled={processingLike}
              >
                👍 {likeCount}
              </button>
              <button
                onClick={() => setShowComments((s) => !s)}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              >
                💬 {post.comment_count || 0}
              </button>
              {user?.id === post.user_id && (
                <button onClick={handleDelete} className="px-2 py-1 rounded text-sm text-red-600 hover:bg-red-50">
                  Excluir
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 text-gray-800 whitespace-pre-wrap">{post.content}</div>

          {showComments && (
            <div className="mt-3 border-t pt-3">
              <CommentsList postId={post.id} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
