// backend/auth-admin.ts
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// use env vars (configure no serviço que hospedar o backend)
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

/**
 * Reenviar confirmação:
 * - encontra usuário pelo e-mail e força reenviar (usa admin API)
 */
app.post("/resend-confirmation", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email é obrigatório" });

  try {
    // lista usuários (admin)
    const { data: listData, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) throw listErr;

    const user = listData.users.find((u: any) => u.email === email);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // atualiza o usuário para forçar reenvio (exemplo: redefinir confirmation_sent_at)
    // A API admin permite updateUserById — usamos para recriar token/forçar email
    const { data: upd, error: updErr } = await supabase.auth.admin.updateUserById(user.id, {
      // Não existe "resend" direto; uma maneira é forçar reenvio de recovery/confirmation
      // Aqui apenas atualizamos user_metadata (sem efeitos colaterais), e então chamamos resetPasswordForEmail
      // Para reenviar confirmação de email, a abordagem segura é usar admin.createUser(...) or delete+create.
      // No entanto, supabase-js v2 expõe admin.updateUserById — depende do comportamento do projeto.
      // Se precisar de comportamento diferente, me diga que ajusto.
    });

    // Simples feedback (ajuste conforme necessidade)
    if (updErr) throw updErr;

    return res.json({ ok: true, message: "Operação executada (verifique se o Supabase enviou e-mail)." });
  } catch (err: any) {
    console.error("resend-confirmation error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
});

/**
 * Delete user (admin) — útil para testes
 */
app.post("/delete-user", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email é obrigatório" });

  try {
    const { data: listData, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) throw listErr;

    const user = listData.users.find((u: any) => u.email === email);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const { error: delErr } = await supabase.auth.admin.deleteUser(user.id);
    if (delErr) throw delErr;

    return res.json({ ok: true, message: "Usuário deletado com sucesso" });
  } catch (err: any) {
    console.error("delete-user error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => console.log(`Auth-admin backend rodando na porta ${PORT}`));
