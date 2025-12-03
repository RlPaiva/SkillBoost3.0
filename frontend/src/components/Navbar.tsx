// src/components/Navbar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, User as UserIcon, Info, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const isActive = (path: string) =>
    location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-600";

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          SkillBoost v2.1
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          {!user && (
            <Link to="/" className={`flex items-center gap-2 ${isActive("/")}`}>
              <Home size={18} />
              <span className="hidden sm:block">Início</span>
            </Link>
          )}

          <Link to="/courses" className={`flex items-center gap-2 ${isActive("/courses")}`}>
            <BookOpen size={18} />
            <span className="hidden sm:block">Cursos</span>
          </Link>

          

          <Link to="/info" className={`flex items-center gap-2 ${isActive("/info")}`}>
            <Info size={18} />
            <span className="hidden sm:block">Recomendações</span>
          </Link>

          {user && (
            <>
              {/*<Link to="/dashboard" className={`flex items-center gap-2 ${isActive("/dashboard")}`}>
                <UserIcon size={18} />
                <span className="hidden sm:block">Meu Espaço</span>
              </Link>*/}

              <Link to="/meus-cursos" className="px-3 py-2">Meus Cursos</Link>

              {/* Nova aba: Comunidade */}
              <Link to="/community" className={`flex items-center gap-2 ${isActive("/community")}`}>
                <MessageSquare size={18} />
                <span className="hidden sm:block">Comunidade</span>
              </Link>
            </>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="px-3 py-1.5 text-sm text-gray-500">Carregando...</div>
          ) : user ? (
            <>
              <div className="flex items-center gap-2 text-gray-700">
                <UserIcon size={18} />
                <span className="hidden sm:block">{user.email ?? "Usuário"}</span>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
