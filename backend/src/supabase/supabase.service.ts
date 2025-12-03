// backend/src/supabase/supabase.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);

  // O cliente pode não existir quando SUPABASE_URL não está definido
  private client?: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      this.logger.warn(
        'Supabase credentials not found — running in NO-OP mode (dev sem Supabase).',
      );
      this.client = undefined;
      return;
    }

    try {
      this.client = createClient(url, key);
      this.logger.log('Supabase client initialized.');
    } catch (err) {
      this.logger.error('Error initializing Supabase client:', err);
      this.client = undefined;
    }
  }

  // Cliente seguro (não quebra a aplicação)
  public getClient(): SupabaseClient | undefined {
    return this.client;
  }

  // Wrapper opcional para facilitar uso
  public from(table: string) {
    if (!this.client) {
      throw new Error('Supabase client not initialized.');
    }
    return this.client.from(table);
  }
}
