import { Module } from '@nestjs/common';
import { RecommendationModule } from './recommendations/recommendation.module';

// IMPORTS EXISTENTES — NÃO REMOVA OS SEUS
// Exemplo:
// import { CoursesModule } from './courses/courses.module';
// import { AuthAdminModule } from './auth-admin/auth-admin.module';

@Module({
  imports: [
    // seus módulos existentes aqui
    // CoursesModule,
    // AuthAdminModule,
    
    // 🔥 IMPORTANTE! Carrega o módulo de recomendações
    RecommendationModule,
  ],
})
export class AppModule {}
