
const API = import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';
export async function getCourses() {
  const res = await fetch(`${API}/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}
export async function postRecommendationCompute(userId: string) {
  const res = await fetch(`${API}/recommendations/calculate`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to compute');
  return res.json();
}