import { supabase } from "../lib/supabase";

// Buscar todos os cursos
export async function fetchCourses() {
  return await supabase.from("courses").select("*");
}

// Buscar todas as profissões
export async function fetchProfessions() {
  return await supabase.from("professions").select("*");
}

// Salvar resposta do questionário
export async function saveQuiz(quizData: any, userId: string) {
  return await supabase.from("quiz_answers").insert({
    user_id: userId,
    answers: quizData,
  });
}

// Buscar recomendações de acordo com profissão ou quiz
export async function fetchRecommendations(userId: string) {
  return await supabase
    .from("recommendations")
    .select("*")
    .eq("user_id", userId);
}
