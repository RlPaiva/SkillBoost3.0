import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import Recommendations from "../pages/Recommendations";
import RecommendationResult from "../pages/RecommendationResult";
import CommunityChat from "../pages/CommunityChat";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Components
import ProtectedRoute from "../components/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Recommendation (requires login) */}
      <Route
        path="/recommend"
        element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recommend/result"
        element={
          <ProtectedRoute>
            <RecommendationResult />
          </ProtectedRoute>
        }
      />

      {/* Community Chat */}
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <CommunityChat />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
