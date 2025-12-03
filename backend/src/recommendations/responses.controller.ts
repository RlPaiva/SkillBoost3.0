import { Body, Controller, Post } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation') // rota: POST /recommendation
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async getRecommendations(@Body() body: any) {
    const { useMock = false } = body;
    return this.recommendationService.getRecommendations(body, { useMock });
  }
}
