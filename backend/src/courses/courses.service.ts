// backend/src/courses/courses.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async getAllCourses() {
    const client = this.supabase.getClient();

    if (!client) {
      this.logger.warn(
        'Supabase client unavailable — returning empty courses list (dev mode).',
      );
      return [];
    }

    const { data, error } = await client.from('courses').select('*');

    if (error) {
      this.logger.error('Error fetching courses:', error);
      return [];
    }

    return data ?? [];
  }

  async getCourseById(id: string) {
    const client = this.supabase.getClient();

    if (!client) {
      this.logger.warn(
        'Supabase client unavailable — returning null for getCourseById.',
      );
      return null;
    }

    const { data, error } = await client
      .from('courses')
      .select('*')
      .eq('id', id)
      .limit(1);

    if (error) {
      this.logger.error('Error fetching course by id:', error);
      return null;
    }

    return data && data.length ? data[0] : null;
  }
}
