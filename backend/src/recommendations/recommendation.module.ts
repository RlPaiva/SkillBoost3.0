// backend/src/recommendations/recommendation.module.ts
import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { RecommendationMlService } from './recommendation-ml.service';
import { RecommendationMockService } from './recommendation.mock.service';

@Module({
  controllers: [RecommendationController],
  providers: [
    RecommendationService,
    RecommendationMlService,
    RecommendationMockService,
  ],
  exports: [RecommendationService],
})
export class RecommendationModule {}
