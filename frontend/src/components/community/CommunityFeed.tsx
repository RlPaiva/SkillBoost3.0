// src/components/community/CommunityFeed.tsx
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import NewPostForm from "./NewPostForm";
import PostCard from "./PostCard";
import { useAuth } from "../../context/AuthContext";

export type Post = {
  id: string;
  user_id: string;
  content: string;
  image?: string | null;
  like_count?: number;
  comment_count?: number;
  created_at: string;
};

export type Profile = {
  id: string;
  email?: string;
  name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
};

export default function CommunityFeed() {
  useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const { data: postsData, error: postsErr } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (postsErr) {
      console.error("Erro ao buscar posts:", postsErr);
      setLoading(false);
      return;
    }
    const p = postsData || [];
    setPosts(p);

    // fetch profiles for user_ids
    const userIds = Array.from(new Set(p.map((x) => x.user_id))).filter(Boolean);
    if (userIds.length) {
      const { data: profs } = await supabase
        .from("user_profiles")
        .select("*")
        .in("id", userIds);

      const map: Record<string, Profile> = {};
      (profs || []).forEach((r) => {
        if (r.id) map[r.id] = r;
      });
      setProfiles((prev) => ({ ...prev, ...map }));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();

    // realtime subscription for new posts
    const postsChannel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const newPost = payload.new as Post;
          setPosts((prev) => [newPost, ...prev]);
          // load profile for this user if missing
          if (newPost.user_id && !profiles[newPost.user_id]) {
            supabase
              .from("user_profiles")
              .select("*")
              .eq("id", newPost.user_id)
              .limit(1)
              .then(({ data }) => {
                if (data && data.length) {
                  setProfiles((p) => ({ ...p, [data[0].id]: data[0] }));
                }
              });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          const updated = payload.new as Post;
          setPosts((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        }
      )
      .subscribe();

    // listen for new comments to update comment_count in posts list (optional)
    const commentsChannel = supabase
      .channel("public:comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          const comment = payload.new;
          setPosts((prev) =>
            prev.map((p) =>
              p.id === comment.post_id ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p
            )
          );
        }
      )
      .subscribe();

    return () => {
      postsChannel.unsubscribe();
      commentsChannel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPosts]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Comunidade</h2>
        <p className="text-sm text-gray-600">Compartilhe atualizações, pergunte, comente e converse com outros alunos.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <NewPostForm onPosted={loadPosts} />
      </div>

      <div className="space-y-4">
        {loading && <div className="text-sm text-gray-500">Carregando...</div>}
        {!loading && posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">Nenhum post ainda — seja o primeiro!</div>
        )}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            author={profiles[post.user_id]}
            onRefresh={() => loadPosts()}
          />
        ))}
      </div>
    </div>
  );
}
