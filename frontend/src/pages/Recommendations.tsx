import { useNavigate } from 'react-router-dom';

export default function Recommendation() {
  const navigate = useNavigate();

  // Se você redireciona após o questionário, apenas roteie para /recommendation/result
  // Aqui deixamos um botão que só navega — a recomendação real será buscada em RecommendationResult
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Questionário de Recomendação</h1>
      <p className="text-gray-600 mb-6 max-w-lg">
        Responda algumas perguntas sobre seus interesses para descobrir qual profissão de TI combina mais com você.
      </p>

      <button
        onClick={() => navigate('/recommendation/result')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Ver Resultado
      </button>
    </div>
  );
}
