// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

// páginas existentes
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Recommend from "./pages/Recommendations";
import CommunityChat from "./pages/CommunityChat";
import Questionnaire from "./pages/Questionnaire";
import RecommendationResult from "./pages/RecommendationResult";
import InfoRecommendations from "./pages/InfoRecommendations";

// autenticação
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// página exclusiva do usuário
import UserHome from "./pages/UserHome";

// contexto global de autenticação
import { AuthProvider } from "./context/AuthContext";

// rota protegida
import ProtectedRoute from "./components/ProtectedRoute";

import { supabase } from "./lib/supabase";
import MyCourses from "./pages/MySpace";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("");

  useEffect(() => {
    async function test() {
      try {
        const userRes = await supabase.auth.getUser();
        console.log("SUPABASE AUTH TEST:", userRes?.data?.user ? "user ok" : "no user");

        try {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .limit(1);

          console.log("SUPABASE TABLE TEST:", { data, error });
        } catch (err) {
          console.debug("Tabela 'users' não disponível ou select não permitido:", err);
        }
      } catch (err) {
        console.warn("Supabase test failed", err);
      }
    }

    test();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <main className="p-4">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Home setCurrentPage={setCurrentPage} />} />
              <Route path="/courses" element={<Courses />} />

              {/* 🔧 Corrigido: rota certa para o botão Descobrir minha profissão */}
              <Route path="/recommendation" element={<Recommend />} />

              <Route path="/community" element={<CommunityChat />} />
              <Route path="/questionnaire" element={<Questionnaire />} />

              {/* Resultado da recomendação */}
              <Route path="/recommendation/result" element={<RecommendationResult />} />

              <Route path="/info" element={<InfoRecommendations />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* 🔒 Rota protegida do usuário */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserHome />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/meus-cursos"
                element={
                  <ProtectedRoute>
                    <MyCourses />
                  </ProtectedRoute>
                }
              />

              {/* fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
