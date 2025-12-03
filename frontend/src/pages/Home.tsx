import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Users, TrendingUp, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Ação principal do CTA: navega e atualiza o estado da página
  const handleStart = () => {
    const target = user ? '/courses' : '/register';
    navigate(target);
    setCurrentPage(user ? 'courses' : 'register');
  };

  return (
    <div className="pt-16">
      {/* HERO */}
      <header className="bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                Eleve sua carreira com <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">tecnologia prática</span>
              </h1>
              <p className="text-md sm:text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto md:mx-0">
                A SkillBoost oferece trilhas de aprendizado curadas, projetos reais e certificados reconhecidos pelo mercado — para você aprender, aplicar e conquistar melhores oportunidades.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <button
                  onClick={handleStart}
                  aria-label="Começar agora"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-7 py-3 rounded-lg text-lg font-semibold transition transform hover:-translate-y-0.5 shadow-lg"
                >
                  Começar Agora <ChevronRight />
                </button>

                <div className="flex gap-3">
                  <Link
                    to="/recommendation"
                    className="px-5 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition"
                  >
                    Descobrir minha profissão
                  </Link>

                  <Link
                    to="/courses"
                    className="px-5 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-gray-100 transition"
                  >
                    Ver cursos
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-300 max-w-md">
                Já é nosso aluno? <button onClick={() => { navigate('/dashboard'); setCurrentPage('dashboard'); }} className="underline">Acesse seu painel</button>
              </p>
            </div>

            {/* Cards estatísticos / mockup */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-3xl opacity-25 transform rotate-3"></div>

                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl ring-1 ring-black/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white/3 p-4 rounded-lg backdrop-blur-sm transition hover:scale-[1.01]">
                      <Award className="text-yellow-400" size={36} />
                      <div>
                        <p className="font-semibold text-white">50+ Certificações</p>
                        <p className="text-sm text-gray-300">Validadas por empresas reais</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/3 p-4 rounded-lg backdrop-blur-sm transition hover:scale-[1.01]">
                      <Users className="text-green-400" size={36} />
                      <div>
                        <p className="font-semibold text-white">100k+ Alunos</p>
                        <p className="text-sm text-gray-300">Comunidade ativa e colaborativa</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/3 p-4 rounded-lg backdrop-blur-sm transition hover:scale-[1.01]">
                      <TrendingUp className="text-blue-300" size={36} />
                      <div>
                        <p className="font-semibold text-white">95% de Satisfação</p>
                        <p className="text-sm text-gray-300">Feedback real dos alunos</p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-400">
                      <span className="inline-block mr-2">Aprenda no seu ritmo • Projetos práticos • Mentoria</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* grid */}
        </div>
      </header>

      {/* SEÇÃO: Nossa História / Missão Visão Valores */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-slate-800">Nossa História</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <article className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <div className="bg-purple-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Missão</h3>
            <p className="text-gray-600">Democratizar o acesso à educação tecnológica prática, preparando profissionais para resolver problemas reais do mercado.</p>
          </article>

          <article className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Visão</h3>
            <p className="text-gray-600">Ser referência na América Latina em formação técnica com foco em empregabilidade e inovação.</p>
          </article>

          <article className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Award className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Valores</h3>
            <p className="text-gray-600">Excelência, transparência, inclusão e compromisso com o sucesso dos nossos alunos.</p>
          </article>
        </div>

        {/* POR QUE ESCOLHER */}
        <section className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-slate-800">Por que escolher a SkillBoost?</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-purple-600 mt-1 text-2xl">✓</div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Conteúdo atualizado</h4>
                <p className="text-gray-600">Trilhas alinhadas às demandas do mercado, com projetos práticos e exemplos reais.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-purple-600 mt-1 text-2xl">✓</div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Instrutores do mercado</h4>
                <p className="text-gray-600">Mentores que atuam na indústria compartilham insights e oportunidades reais.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-purple-600 mt-1 text-2xl">✓</div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Certificação reconhecida</h4>
                <p className="text-gray-600">Certificados práticos que destacam projetos entregues, não apenas horas assistidas.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-purple-600 mt-1 text-2xl">✓</div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Comunidade e networking</h4>
                <p className="text-gray-600">Acesso a grupos, lives e projetos colaborativos que conectam você a profissionais e vagas.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* RODAPÉ SIMPLES */}
      <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SkillBoost — Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default HomePage;
