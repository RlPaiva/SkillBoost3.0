// frontend/src/pages/MySpace.tsx
import { useState } from "react";
import MyCoursesSection from "./MyCoursesSection";
import UserAccountSection from "./UserAccountSection";

export default function MySpace(): JSX.Element {
  // debug log para confirmar carregamento
  // (remova depois quando tudo estiver OK)
  console.log("MySpace mounted");

  const [activeTab, setActiveTab] = useState<"courses" | "account">("courses");

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Espaço</h1>

      <div className="flex gap-3 border-b pb-2 mb-6">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 ${activeTab === "courses" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-600"}`}
        >
          Meus Cursos
        </button>

        <button
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 ${activeTab === "account" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-600"}`}
        >
          Minha Conta
        </button>
      </div>

      <div>
        {activeTab === "courses" && <MyCoursesSection />}
        {activeTab === "account" && <UserAccountSection />}
      </div>
    </div>
  );
}
