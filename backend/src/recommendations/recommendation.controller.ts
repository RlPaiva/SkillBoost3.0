// backend/src/recommendations/recommendation.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller()
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('recommendation')
  async postRecommendation(@Body() body: any) {
    const useMock = body?.useMock ?? true;
    return this.recommendationService.getRecommendations(body, { useMock });
  }

  @Post('recommendations/compute')
  async compute(@Body() body: any) {
    const useMock = body?.useMock ?? true;
    return this.recommendationService.getRecommendations(body, { useMock });
  }
}
