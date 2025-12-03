// src/components/community/ChatRoom.tsx
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

type Message = {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  metadata?: any;
  created_at: string;
};

type Props = {
  roomId: string;
  roomName?: string;
};

export default function ChatRoom({ roomId, roomName }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })
        .limit(200);
      if (mounted) setMessages(data || []);
      // scroll
      setTimeout(() => listRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 50);
    }
    load();

    const channel = supabase
      .channel(`messages:room_${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setTimeout(() => listRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 50);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [roomId]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!user) return alert("Faça login para enviar mensagens.");
    if (!text.trim()) return;

    const { error } = await supabase.from("messages").insert([
      { room_id: roomId, user_id: user.id, content: text.trim() },
    ]);
    if (error) return console.error("Erro enviar mensagem:", error);
    setText("");
  }

  return (
    <div className="flex flex-col h-[60vh] border rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
        <div className="font-semibold">{roomName || "Chat"}</div>
        <div className="text-xs text-gray-500">Sala: {roomId}</div>
      </div>

      <div ref={listRef} className="flex-1 p-3 overflow-auto space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`p-2 rounded ${m.user_id === user?.id ? "bg-blue-50 self-end" : "bg-gray-100"}`}>
            <div className="text-sm">{m.content}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Enviar</button>
      </form>
    </div>
  );
}
