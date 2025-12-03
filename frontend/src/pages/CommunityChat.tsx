// frontend/src/pages/CommunityChat.tsx
import { useEffect, useState } from "react";
import CommunityFeed from "../components/community/CommunityFeed";
import ChatRoom from "../components/community/ChatRoom";
import { supabase } from "../lib/supabase";

type Room = {
  id: string;
  name: string;
};

export default function CommunityChatPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "chat">("feed");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);

  async function loadRooms() {
    setLoadingRooms(true);
    const { data } = await supabase
      .from("chat_rooms")
      .select("*")
      .order("name", { ascending: true });
    setRooms((data || []) as Room[]);
    setLoadingRooms(false);
  }

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    // se não houver sala selecionada, seleciona a primeira
    if (!selectedRoom && rooms.length > 0) setSelectedRoom(rooms[0]);
  }, [rooms, selectedRoom]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold">Comunidade</h1>
        <p className="text-gray-600">Participe do feed, comente e entre nos chats por tópico.</p>

        <div className="mt-4 flex gap-2">
          <button
            className={`px-4 py-2 rounded ${activeTab === "feed" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setActiveTab("feed")}
          >
            Feed
          </button>

          <button
            className={`px-4 py-2 rounded ${activeTab === "chat" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
        </div>
      </div>

      {activeTab === "feed" && <CommunityFeed />}

      {activeTab === "chat" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <aside className="md:col-span-1 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Salas</h3>
              <button
                className="text-sm text-blue-600"
                onClick={loadRooms}
                title="Recarregar salas"
              >
                Atualizar
              </button>
            </div>

            {loadingRooms && <div className="text-sm text-gray-500">Carregando...</div>}

            <ul className="space-y-2">
              {rooms.map((r) => (
                <li key={r.id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded ${selectedRoom?.id === r.id ? "bg-blue-50" : "hover:bg-gray-100"}`}
                    onClick={() => setSelectedRoom(r)}
                  >
                    {r.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="md:col-span-3">
            {selectedRoom ? (
              <ChatRoom roomId={selectedRoom.id} roomName={selectedRoom.name}/>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow">Selecione uma sala para entrar no chat.</div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
