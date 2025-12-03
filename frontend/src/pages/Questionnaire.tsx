// frontend/src/pages/Questionnaire.tsx
import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ajuste o caminho se necessário

type Question = {
  id: string;
  text: string;
};

const questions: Question[] = [
  // Frontend (fe_)
  { id: 'fe_1', text: 'Tenho interesse em desenvolver interfaces visuais (UI).' },
  { id: 'fe_2', text: 'Gosto de trabalhar com HTML e CSS para estruturar páginas.' },
  { id: 'fe_3', text: 'Tenho curiosidade sobre frameworks como React, Vue ou Angular.' },
  { id: 'fe_4', text: 'Interesso-me por performance e otimização de front-end.' },
  { id: 'fe_5', text: 'Gosto de testar e depurar comportamentos em navegadores.' },
  { id: 'fe_6', text: 'Me atraem animações e interações de usuário avançadas.' },
  { id: 'fe_7', text: 'Tenho interesse em construir componentes reutilizáveis.' },
  { id: 'fe_8', text: 'Quero aprender sobre state management (Redux, Context, Pinia, etc.).' },
  { id: 'fe_9', text: 'Tenho vontade de trabalhar com interfaces responsivas (mobile-first).' },
  { id: 'fe_10', text: 'Me interesso por acessibilidade (a11y) e boas práticas de UX.' },

  // Backend (be_)
  { id: 'be_1', text: 'Tenho interesse em projetar APIs e endpoints.' },
  { id: 'be_2', text: 'Gosto de trabalhar com bancos de dados e modelagem de dados.' },
  { id: 'be_3', text: 'Quero aprender sobre autenticação e autorização.' },
  { id: 'be_4', text: 'Tenho curiosidade sobre escalabilidade e arquitetura de sistemas.' },
  { id: 'be_5', text: 'Me interesso por segurança aplicada no backend.' },
  { id: 'be_6', text: 'Gosto de resolver problemas lógicos e algoritmos no servidor.' },
  { id: 'be_7', text: 'Tenho interesse em deploy, CI/CD e infraestrutura.' },
  { id: 'be_8', text: 'Quero trabalhar com integrações de serviços (webhooks, filas).' },
  { id: 'be_9', text: 'Interesso-me por testes automatizados (unit/integration).' },
  { id: 'be_10', text: 'Tenho vontade de aprender sobre caches e otimização de queries.' },

  // Design / UX (ux_)
  { id: 'ux_1', text: 'Tenho afinidade com design visual e composição.' },
  { id: 'ux_2', text: 'Gosto de criar protótipos e wireframes.' },
  { id: 'ux_3', text: 'Interesso-me por pesquisa com usuários e testes de usabilidade.' },
  { id: 'ux_4', text: 'Quero aprender sobre heurísticas de usabilidade.' },
  { id: 'ux_5', text: 'Tenho curiosidade sobre design systems e bibliotecas de componentes.' },
  { id: 'ux_6', text: 'Me interesso por acessibilidade e design inclusivo.' },
  { id: 'ux_7', text: 'Gosto de estudar jornadas de usuário e mapas de navegação.' },
  { id: 'ux_8', text: 'Tenho vontade de aprender sobre tipografia e gestalt no design.' },
  { id: 'ux_9', text: 'Interesso-me por ferramentas de prototipação (Figma, Sketch, etc.).' },
  { id: 'ux_10', text: 'Quero entender métricas de experiência (NPS, SUS, task success).' },

  // Soft Skills (ss_)
  { id: 'ss_1', text: 'Tenho facilidade em me comunicar com outras pessoas.' },
  { id: 'ss_2', text: 'Gosto de trabalhar em equipe e colaborar em times.' },
  { id: 'ss_3', text: 'Consigo organizar meu tempo e priorizar tarefas.' },
  { id: 'ss_4', text: 'Tenho interesse em liderança e mentoria.' },
  { id: 'ss_5', text: 'Sou aberto a receber e aplicar feedbacks.' },
  { id: 'ss_6', text: 'Tenho habilidade em resolver conflitos de maneira construtiva.' },
  { id: 'ss_7', text: 'Busco melhorar continuamente minhas habilidades profissionais.' },
  { id: 'ss_8', text: 'Tenho proatividade para iniciar e finalizar tarefas.' },
  { id: 'ss_9', text: 'Consigo explicar ideias técnicas para não-técnicos.' },
  { id: 'ss_10', text: 'Tenho interesse em gestão de projetos e processos.' },
];

const SCALE = [0, 1, 2, 3, 4, 5];

export default function Questionnaire() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // ajuste se seu useAuth exporta algo diferente

  const [answers, setAnswers] = useState<Record<string, number>>(() =>
    questions.reduce<Record<string, number>>((acc, q) => {
      acc[q.id] = -1;
      return acc;
    }, {}),
  );

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // se quiser usar env, defina VITE_API_BASE no frontend .env; fallback para localhost:3000
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000';

  const totalQuestions = questions.length;
  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v >= 0).length,
    [answers],
  );
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  function handleChange(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function allAnswered() {
    return answeredCount === totalQuestions;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!allAnswered()) {
      setMessage('Por favor, responda todas as perguntas antes de enviar.');
      const firstUn = questions.find((q) => answers[q.id] < 0);
      if (firstUn) {
        const el = document.getElementById(firstUn.id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);

    try {
      console.log('[QUESTIONNAIRE] Enviando answers ->', answers);
      console.log('[QUESTIONNAIRE] API_BASE =', API_BASE);

      // ROTA CORRETA: /recommendation (singular)
      const res = await fetch(`${API_BASE}/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // useMock ajuda em desenvolvimento; remova/defina false em produção
        body: JSON.stringify({ answers, useMock: true }),
      });

      console.log('[QUESTIONNAIRE] Response status:', res.status, res.statusText);

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error('[QUESTIONNAIRE] Backend returned error body:', text);
        throw new Error(text || `Erro (status ${res.status})`);
      }

      const json = await res.json();
      console.log('[QUESTIONNAIRE] Recomendação recebida:', json);

      // tenta salvar respostas (opcional e não bloqueante)
      fetch(`${API_BASE}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, recommendation: json }),
      }).catch((err) => console.warn('Falha ao salvar responses (não crítico):', err));

      // navega para a rota padronizada: /recommendation/result
      navigate('/recommendation/result', { state: { result: json, answers } });
      console.log('[QUESTIONNAIRE] Navegou para /recommendation/result com state.');
    } catch (err: any) {
      console.error('Erro ao enviar respostas', err);
      setMessage('Erro ao processar recomendação. Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- If not logged in: show nice card prompting login/register ----------
  if (!user) {
    // preserve current path to redirect back after login
    const from = location.pathname + (location.search || '');

    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Atenção — é necessário entrar</h2>
          <p className="text-gray-600 mb-4">
            Para acessar o questionário e receber recomendações personalizadas você precisa estar logado.
            Faça login ou crie uma conta — é rápido e gratuito.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/login', { state: { from } })}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Entrar
            </button>

            <button
              onClick={() => navigate('/register', { state: { from } })}
              className="px-6 py-3 rounded-lg bg-white border text-gray-700 hover:bg-gray-50"
            >
              Criar conta
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <span className="font-medium">Dica:</span> usar uma conta permite salvar seu progresso e
            receber trilhas personalizadas ao longo do tempo.
          </div>
        </div>
      </div>
    );
  }

  // ---------- If logged in: show questionnaire ----------
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header / Instructions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Questionário de Skills</h1>
        <p className="text-gray-600 mb-4">
          Responda honestamente para que possamos indicar áreas e perfis profissionais mais adequados ao seu
          perfil. Não existem respostas certas ou erradas — o importante é entender suas preferências.
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-sm text-gray-500">Progresso</div>
            <div className="w-64 bg-gray-200 rounded-full h-3 overflow-hidden mt-2">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{answeredCount} de {totalQuestions} respondidas ({progress}%)</div>
          </div>

          <div className="text-sm text-gray-600">
            Escala: <strong>0</strong> (Discordo totalmente) — <strong>5</strong> (Concordo totalmente)
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const questionNumber = idx + 1;
            return (
              <div
                key={q.id}
                id={q.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3">
                      <div className="text-sm text-gray-500">Questão {questionNumber}</div>
                      <div className="text-sm text-gray-400">•</div>
                    </div>
                    <div className="mt-2 text-gray-800">{q.text}</div>
                  </div>

                  {/* Scale buttons */}
                  <div className="flex items-center gap-2">
                    {SCALE.map((s) => {
                      const isSelected = answers[q.id] === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleChange(q.id, s)}
                          className={
                            'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition ' +
                            (isSelected
                              ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                          }
                          title={`Escolher ${s}`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-6 left-0 right-0 z-40 mt-6 flex items-center justify-between gap-4 bg-transparent">
          <div>
            {message && <div className="text-sm text-red-600">{message}</div>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const resetMap: Record<string, number> = {};
                questions.forEach((q) => (resetMap[q.id] = -1));
                setAnswers(resetMap);
                setMessage(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded border bg-white"
            >
              Resetar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-60"
            >
              {submitting ? 'Enviando...' : 'Enviar respostas'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
