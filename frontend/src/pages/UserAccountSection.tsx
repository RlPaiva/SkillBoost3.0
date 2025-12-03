// frontend/src/pages/UserAccountSection.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function UserAccountSection(): JSX.Element {
  console.log("UserAccountSection mounted");
  const [user, setUser] = useState<any | null>(null);
  const [name, setName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUser() {
    try {
      const { data } = await supabase.auth.getUser();
      const u = data?.user ?? null;
      setUser(u);
      setName(u?.user_metadata?.name || "");
      setAvatarUrl(u?.user_metadata?.avatar_url || "");
    } catch (err) {
      console.error("loadUser error", err);
    }
  }

  async function updateName() {
    if (!user) return alert("Usuário não encontrado.");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { name } });
      if (error) throw error;
      alert("Nome atualizado!");
      await loadUser();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao atualizar nome: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setLoading(true);
    const fileName = `${user.id}-${Date.now()}`;
    try {
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      const { error: upError } = await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      if (upError) throw upError;

      setAvatarUrl(publicUrl);
      alert("Foto atualizada!");
    } catch (err: any) {
      console.error("avatar error", err);
      alert("Erro ao enviar imagem: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function updateEmail() {
    if (!user) return alert("Usuário não encontrado.");
    const newEmail = prompt("Novo email:");
    if (!newEmail) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      alert("Verifique sua caixa de entrada para confirmar o novo email.");
      await loadUser();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao alterar email: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function updatePassword() {
    const newPass = prompt("Nova senha:");
    if (!newPass) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) throw error;
      alert("Senha atualizada!");
    } catch (err: any) {
      console.error(err);
      alert("Erro ao alterar senha: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function deleteAccount() {
    if (!user) return alert("Usuário não encontrado.");
    if (!confirm("Tem certeza que deseja excluir sua conta? Essa ação é irreversível.")) return;
    setLoading(true);
    try {
      // tenta chamar edge function 'delete-account' se existir
      try {
        // supabase.functions.invoke retorna { data, error } em versões antigas; tratamos generically
        // @ts-ignore
        const fnRes = await supabase.functions.invoke?.("delete-account");
        console.log("delete-account fnRes", fnRes);
        alert("Se a fução existir, a solicitação de exclusão foi enviada.");
      } catch (fnErr) {
        console.warn("Edge function não disponível:", fnErr);
        alert("Não foi possível excluir via função remota. Contate o administrador.");
      }
      await supabase.auth.signOut();
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (user === null) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <img src={avatarUrl || "https://i.imgur.com/6VBx3io.png"} className="w-24 h-24 rounded-full border" alt="avatar" />
        <div>
          <label className="block text-sm font-medium mb-1">Atualizar foto</label>
          <input type="file" onChange={uploadAvatar} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Seu nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 border rounded w-full" />
        <button onClick={updateName} disabled={loading} className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">Salvar nome</button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <div className="flex items-center justify-between">
          <span>{user?.email || "—"}</span>
          <button onClick={updateEmail} disabled={loading} className="px-3 py-2 border rounded hover:bg-gray-100">Alterar email</button>
        </div>
      </div>

      <div>
        <button onClick={updatePassword} disabled={loading} className="px-3 py-2 border rounded hover:bg-gray-100">Alterar senha</button>
      </div>

      <div>
        <button className="px-3 py-2 border rounded hover:bg-gray-100" onClick={() => alert("Futuramente: exportar todos os seus dados.")}>Baixar meus dados (LGPD)</button>
      </div>

      <div>
        <button onClick={deleteAccount} disabled={loading} className="px-3 py-2 border rounded text-red-600 hover:bg-red-100">Excluir conta permanentemente</button>
      </div>

      <div>
        <button onClick={logout} className="px-3 py-2 bg-red-600 text-white rounded">Sair da conta</button>
      </div>
    </div>
  );
}
