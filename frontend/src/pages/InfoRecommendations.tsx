// frontend/src/pages/InfoRecommendations.tsx
import { Link } from "react-router-dom";

export default function InfoRecommendations() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Recomendações e Cursos</h1>
        <p className="text-gray-700 mb-6">
          Nesta área você encontra informação geral sobre como funcionam as recomendações no SkillBoost,
          como explorar cursos e quais caminhos profissionais o sistema sugere com base no seu perfil.
        </p>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Como funcionam as recomendações</h2>
            <p className="text-sm text-gray-700">
              O sistema usa um questionário inicial e seu histórico para sugerir trilhas de aprendizagem,
              profissões compatíveis e cursos mais adequados ao seu nível. As recomendações são atualizadas
              conforme você conclui módulos e responde novos questionários.
            </p>
            <Link to="/questionnaire" className="inline-block mt-4 text-blue-600 hover:underline">Responder questionário</Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Explorar cursos</h2>
            <p className="text-sm text-gray-700">
              Explore cursos por área, duração e dificuldade. Use filtros para encontrar cursos que encaixam
              no seu tempo disponível e objetivos profissionais.
            </p>
            <Link to="/courses" className="inline-block mt-4 text-blue-600 hover:underline">Ver cursos</Link>
          </div>
        </section>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Dicas rápidas</h3>
          <ul className="list-disc ml-6 text-sm text-gray-700">
            <li>Complete o questionário para receber recomendações mais precisas.</li>
            <li>Comece por cursos curtos para ganhar momentum e acompanhar progresso.</li>
            <li>Volte ao painel para ver recomendações personalizadas baseadas no seu progresso.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
