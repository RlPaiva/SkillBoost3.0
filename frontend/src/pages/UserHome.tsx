import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

type Rec = { area: string; score: number };

export default function UserHome() {
  const { user } = useAuth();
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);

      const base = import.meta.env.VITE_RECOMMENDER_URL_BASE;

      const res = await fetch(`${base}/responses/latest?userId=${user.id}`);
      const json = await res.json();

      const recommended =
        json?.recommended?.map((r: any) => ({
          area:
            r.area ?? r.profession ?? r.label ?? r.name ?? "Área não identificada",
          score: Number(r.score ?? 0),
        })) ?? [];

      setRecs(recommended);
      setLoading(false);
    };

    load();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Meu Espaço</h1>

      {loading && <p>Carregando...</p>}

      {!loading &&
        recs.map((r, i) => (
          <div
            key={i}
            className="p-4 mb-3 border bg-white rounded shadow-sm"
          >
            <p className="font-semibold">{r.area}</p>
            <p className="text-sm text-gray-600">
              {Math.round(r.score * 100)}%
            </p>
          </div>
        ))}
    </div>
  );
}
