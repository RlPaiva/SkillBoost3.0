// src/services/courseService.ts
import { supabase } from "../lib/supabase";



// ===============================
// BUSCAR TODOS OS CURSOS
// ===============================
export async function fetchCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Erro ao buscar cursos:', error);
    throw error;
  }

  return data;
}

// ===============================
// BUSCAR CURSO POR ID
// ===============================
export async function fetchCourseById(courseId: number) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (error) {
    console.error('Erro ao buscar curso:', error);
    throw error;
  }

  return data;
}

// ===============================
// BUSCAR MÓDULOS DE UM CURSO
// ===============================
export async function fetchModulesByCourse(courseId: number) {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('id', { ascending: true });

  if (error) {
    console.error('Erro ao buscar módulos:', error);
    throw error;
  }

  return data;
}
