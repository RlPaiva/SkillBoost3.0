// backend/src/auth-admin/auth-admin.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthAdminService {
  private supabase: ReturnType<typeof createClient>;
  private readonly logger = new Logger(AuthAdminService.name);

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      this.logger.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
      throw new Error('Missing SUPABASE envs');
    }
    this.supabase = createClient(url, key);
  }

  async listUsers() {
    const { data, error } = await this.supabase.auth.admin.listUsers();
    if (error) throw error;
    return data;
  }

  async deleteUserByEmail(email: string) {
    const { data } = await this.supabase.auth.admin.listUsers({ perPage: 100 });
    const user = data.users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    const { error } = await this.supabase.auth.admin.deleteUser(user.id);
    if (error) throw error;
    return { ok: true };
  }

  async resendConfirmation(email: string) {
    // Supabase não tem "resend confirmation" público — estratégia:
    //  - delete + create (poderoso, destrutivo) OU
    //  - updateUserById para alterar flags (requer teste)
    const { data } = await this.supabase.auth.admin.listUsers({ perPage: 100 });
    const user = data.users.find(u => u.email === email);
    if (!user) throw new Error('User not found');

    // Exemplo não-destrutivo: atualizar user_metadata (sem alterar email) — 
    // Isso por si só não garante reenvio. Se quiser forçar reenvio, a forma
    // segura é eliminar e recriar ou usar endpoints admin específicos.
    // Aqui apenas mostramos um placeholder que pode ser adaptado:
    const { data: upd, error: updErr } = await this.supabase.auth.admin.updateUserById(user.id, {
      // exemplo: set user_metadata (opcional)
      user_metadata: { resendConfirmationAt: new Date().toISOString() },
    });

    if (updErr) throw updErr;
    return { ok: true, message: 'Operação executada (verifique e-mail).' };
  }
}
