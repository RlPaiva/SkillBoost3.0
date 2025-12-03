// frontend/src/pages/RecommendationResult.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // se usar supabase no botão "Começar"
import areaNames from '../utils/area-Names'; // mapeamento local de siglas -> nomes

type AreaItem = {
  area?: string;
  areaCode?: string;
  areaName?: string;
  score?: number;
  pct?: number; // se seu backend usa pct em vez de score
};

export default function RecommendationResult() {
  const location = useLocation();
  const navigate = useNavigate();

  // o resultado deve ser passado via state pela navegação do questionnaire
  const result = (location.state as any)?.result;

  if (!result) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">Nenhuma recomendação encontrada</h1>
        <p className="text-gray-600">Responda o questionário novamente.</p>
      </div>
    );
  }

  // Normaliza dados: aceita formatos variados do backend
  const areasRaw: AreaItem[] = Array.isArray(result)
    ? result
    : result.areas || result.recommendations || result; // tenta variações

  const areas: AreaItem[] = (areasRaw || []).map((a) => {
    const code = (a.areaCode || a.area || '').toString().toLowerCase();
    const score = Number(a.score ?? a.pct ?? 0);

    const name =
      (a as any).areaName || // 1) se backend enviou areaName
      areaNames[code] || // 2) fallback local mapeado
      a.area || // 3) fallback cru
      code || 'Desconhecido';

    return {
      areaCode: code,
      areaName: name,
      score,
    };
  });

  // Ordena por score desc (opcional)
  areas.sort((x, y) => (y.score || 0) - (x.score || 0));

  async function handleSelectCourse(course: any) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return alert('Você precisa estar logado.');

      const { error } = await supabase
        .from('user_courses')
        .insert({
          user_id: user.id,
          course_id: course.id,
          title: course.title,
          youtube: course.youtube || null,
          created_at: new Date(),
        });

      if (error) {
        console.error(error);
        alert('Erro ao salvar curso.');
        return;
      }

      navigate('/meus-cursos');
    } catch (err) {
      console.error('Erro ao salvar curso:', err);
      alert('Erro ao salvar curso.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resultados da Recomendação</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Áreas mais compatíveis</h2>

        <div className="space-y-4">
          {areas.map((a, idx) => {
            const label = a.areaName || a.area || a.areaCode || 'Desconhecido';
            const pct = Math.max(0, Math.min(100, Number(a.score ?? 0)));

            return (
              <div key={a.areaCode ?? idx} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-slate-800">{label}</div>
                  <div className="text-sm text-gray-600">{pct}%</div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#3b82f6,#7c3aed)' }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Perfis recomendados (se vierem no result) */}
      {result.profiles && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Perfis recomendados</h2>
          <div className="space-y-6">
            {result.profiles.map((p: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{p.perfil || p.title || 'Perfil'}</h3>
                    {p.habilidades && <p className="text-sm text-gray-600">{p.habilidades}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Cursos sugeridos</h4>

                  {p.courses && p.courses.length ? (
                    <ul className="space-y-2">
                      {p.courses.map((c: any) => (
                        <li key={c.id} className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">{c.title}</div>
                            {c.description && <div className="text-sm text-gray-600">{c.description}</div>}
                          </div>

                          <button
                            onClick={() => handleSelectCourse(c)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Começar
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-sm">Nenhum curso associado.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
