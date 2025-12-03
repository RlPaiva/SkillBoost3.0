import { useEffect, useState } from "react";
import { fetchCourses } from "../services/supabaseService";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await fetchCourses();

      if (error) {
        console.error("Erro ao carregar cursos:", error);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Carregando cursos...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Cursos disponíveis</h1>

      {courses.length === 0 ? (
        <p>Nenhum curso encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
              <p className="text-blue-600 mt-2 font-medium">
                Categoria: {course.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
