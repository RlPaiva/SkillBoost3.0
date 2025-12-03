// backend/src/responses/responses.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('responses')
export class ResponsesController {
  private readonly logger = new Logger(ResponsesController.name);

  constructor(private readonly supabase: SupabaseService) {}

  @Post()
  async create(@Body() payload: any) {
    const client = this.supabase.getClient();

    if (!client) {
      this.logger.warn(
        'Supabase client unavailable — cannot save response (dev mode).',
      );
      return {
        success: false,
        message: 'Supabase not configured (dev mode)',
      };
    }

    try {
      const { error } = await client.from('responses').insert({
        ...payload,
        created_at: new Date(),
      });

      if (error) {
        this.logger.error('Error saving response:', error);
        return { success: false, message: 'Failed to save response' };
      }

      return { success: true };
    } catch (err) {
      this.logger.error('Unexpected error saving response:', err);
      return { success: false, message: 'Unexpected server error' };
    }
  }
}
