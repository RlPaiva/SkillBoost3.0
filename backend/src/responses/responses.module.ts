// backend/src/responses/responses.module.ts
import { Module } from '@nestjs/common';
import { ResponsesController } from './responses.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ResponsesController],
})
export class ResponsesModule {}
