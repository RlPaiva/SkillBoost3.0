// frontend/src/pages/MyCoursesSection.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type UserCourse = {
  id: string;
  course_id: string;
  title: string;
  youtube?: string | null;
  created_at?: string;
};

type Progress = {
  id?: string;
  user_course_id: string;
  progress: number;
  last_watched?: string | null;
  current_video?: string | null;
  completed: boolean;
  notes?: string | null;
  updated_at?: string | null;
};

type Feedback = {
  id?: string;
  course_id: string;
  rating?: number | null;
  comment?: string | null;
};

export default function MyCoursesSection(): JSX.Element {
  console.log("MyCoursesSection mounted");

  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, Feedback>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "inprogress" | "completed">("all");
  const [sortBy, setSortBy] = useState<"recent" | "progress" | "rating">("recent");
  const [editingNotes, setEditingNotes] = useState<{ open: boolean; ucId?: string; text?: string }>({ open: false });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    try {
      const userRes = await supabase.auth.getUser();
      const user = userRes?.data?.user;
      if (!user) {
        setUserCourses([]);
        setProgressMap({});
        setFeedbackMap({});
        setLoading(false);
        return;
      }

      const { data: uc, error: ucErr } = await supabase
        .from("user_courses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ucErr) console.error("user_courses error", ucErr);

      const courses = (uc || []) as UserCourse[];
      setUserCourses(courses);

      const ids = courses.map((c) => c.id);
      if (ids.length) {
        const { data: prog } = await supabase.from("user_course_progress").select("*").in("user_course_id", ids);
        const map: Record<string, Progress> = {};
        (prog || []).forEach((p: any) => (map[p.user_course_id] = p));
        setProgressMap(map);

        const courseIds = courses.map((c) => c.course_id);
        const { data: fdb } = await supabase
          .from("course_feedback")
          .select("*")
          .in("course_id", courseIds)
          .eq("user_id", user.id);

        const fmap: Record<string, Feedback> = {};
        (fdb || []).forEach((f: any) => (fmap[f.course_id] = f));
        setFeedbackMap(fmap);
      } else {
        setProgressMap({});
        setFeedbackMap({});
      }
    } catch (err) {
      console.error("load error", err);
    } finally {
      setLoading(false);
    }
  }

  async function upsertProgress(userCourseId: string, patch: Partial<Progress>) {
    const existing = progressMap[userCourseId];
    if (existing?.id) {
      const { error } = await supabase.from("user_course_progress").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", existing.id);
      if (error) console.error("update progress error", error);
    } else {
      const { data, error } = await supabase
        .from("user_course_progress")
        .insert({
          user_course_id: userCourseId,
          ...patch,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) console.error("insert progress error", error);
      if (data) setProgressMap((m) => ({ ...m, [userCourseId]: data }));
      return;
    }
    await load();
  }

  async function handleResume(uc: UserCourse) {
    const ucProgress = progressMap[uc.id];
    const newProgress = Math.min(100, (ucProgress?.progress || 0) + 10);

    if (uc.youtube) window.open(uc.youtube, "_blank");

    await upsertProgress(uc.id, {
      progress: newProgress,
      last_watched: new Date().toISOString(),
      current_video: uc.youtube || null,
      completed: newProgress >= 100,
    });
  }

  async function handleToggleComplete(uc: UserCourse) {
    const existing = progressMap[uc.id];
    const nowCompleted = !existing?.completed;
    await upsertProgress(uc.id, {
      progress: nowCompleted ? 100 : 0,
      completed: nowCompleted,
      updated_at: new Date().toISOString(),
    });
  }

  async function handleUnenroll(uc: UserCourse) {
    if (!confirm(`Remover ${uc.title} dos seus cursos?`)) return;
    const { error } = await supabase.from("user_courses").delete().eq("id", uc.id);
    if (error) {
      alert("Erro ao desinscrever: " + error.message);
      return;
    }
    setUserCourses((prev) => prev.filter((c) => c.id !== uc.id));
    const newMap = { ...progressMap };
    delete newMap[uc.id];
    setProgressMap(newMap);
    alert("Curso removido.");
  }

  async function handleSaveNotes() {
    const ucId = editingNotes.ucId;
    if (!ucId) return;
    await upsertProgress(ucId, { notes: editingNotes.text, updated_at: new Date().toISOString() });
    setEditingNotes({ open: false });
  }

  async function handleRateCourse(uc: UserCourse, rating: number) {
    const userRes = await supabase.auth.getUser();
    const user = userRes?.data?.user;
    if (!user) return alert("Você precisa estar logado.");

    const existing = feedbackMap[uc.course_id];
    if (existing?.id) {
      const { error } = await supabase.from("course_feedback").update({ rating, created_at: new Date() }).eq("id", existing.id);
      if (error) console.error("update feedback error", error);
    } else {
      const { error } = await supabase.from("course_feedback").insert({ user_id: user.id, course_id: uc.course_id, rating });
      if (error) console.error("insert feedback error", error);
    }
    await load();
  }

  function filteredAndSorted() {
    let arr = [...userCourses];
    if (filter === "inprogress") arr = arr.filter((c) => !(progressMap[c.id]?.completed));
    else if (filter === "completed") arr = arr.filter((c) => !!progressMap[c.id]?.completed);

    if (sortBy === "progress") {
      arr.sort((a, b) => (progressMap[b.id]?.progress || 0) - (progressMap[a.id]?.progress || 0));
    } else if (sortBy === "rating") {
      arr.sort((a, b) => (feedbackMap[b.course_id]?.rating || 0) - (feedbackMap[a.course_id]?.rating || 0));
    } else {
      arr.sort((a, b) => (new Date(b.created_at || "").getTime() || 0) - (new Date(a.created_at || "").getTime() || 0));
    }
    return arr;
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-600">Filtro:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="px-3 py-2 rounded border">
            <option value="all">Todos</option>
            <option value="inprogress">Em andamento</option>
            <option value="completed">Concluídos</option>
          </select>
          <label className="text-sm text-gray-600 ml-4">Ordenar:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 rounded border">
            <option value="recent">Recentes</option>
            <option value="progress">Progresso</option>
            <option value="rating">Avaliação</option>
          </select>
        </div>

        <div className="text-sm text-gray-500">{userCourses.length} cursos • {Object.keys(progressMap).length} com progresso</div>
      </div>

      {loading && <div className="text-gray-600">Carregando...</div>}
      {!loading && filteredAndSorted().length === 0 && <div className="text-gray-600">Nenhum curso encontrado com os filtros selecionados.</div>}

      <div className="space-y-4">
        {filteredAndSorted().map((uc) => {
          const prog = progressMap[uc.id];
          const feedback = feedbackMap[uc.course_id];
          const pct = Math.round(prog?.progress || 0);
          return (
            <div key={uc.id} className="bg-white p-4 rounded-lg shadow border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-lg">{uc.title}</div>
                  {prog?.completed && <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Concluído</div>}
                </div>
                <div className="text-sm text-gray-500">Inscrito em {new Date(uc.created_at || "").toLocaleString()}</div>

                <div className="mt-3 w-full md:w-96">
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{pct}% concluído</div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => handleResume(uc)} className="px-3 py-2 bg-blue-600 text-white rounded">Resume</button>
                  <button onClick={() => { setEditingNotes({ open: true, ucId: uc.id, text: prog?.notes || "" }); }} className="px-3 py-2 border rounded bg-white">Notas</button>
                  <button onClick={() => handleToggleComplete(uc)} className="px-3 py-2 border rounded bg-white">{prog?.completed ? "Marcar como não concluído" : "Marcar como concluído"}</button>
                  <button onClick={() => handleUnenroll(uc)} className="px-3 py-2 border rounded bg-red-50 text-red-600">Sair do curso</button>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="text-sm text-gray-600">Última reprodução: {prog?.last_watched ? new Date(prog.last_watched).toLocaleString() : "—"}</div>

                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600 mr-2">Sua avaliação:</div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} onClick={() => handleRateCourse(uc, star)} title={`${star} estrelas`} className={`text-xl ${feedback?.rating && feedback.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>★</button>
                    ))}
                  </div>
                </div>

                <a href={uc.youtube || "#"} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">Abrir referência (YouTube)</a>
              </div>
            </div>
          );
        })}
      </div>

      {editingNotes.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Notas pessoais</h3>
            <textarea value={editingNotes.text} onChange={(e) => setEditingNotes((s) => ({ ...s, text: e.target.value }))} rows={6} className="w-full border rounded p-2" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditingNotes({ open: false })} className="px-4 py-2 rounded border bg-white">Cancelar</button>
              <button onClick={handleSaveNotes} className="px-4 py-2 rounded bg-blue-600 text-white">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
