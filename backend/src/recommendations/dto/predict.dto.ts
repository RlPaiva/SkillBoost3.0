// backend/src/recommendations/dto/predict.dto.ts
import { IsString, IsObject, IsOptional } from 'class-validator';

export class PredictDto {
  @IsString()
  userId: string;

  @IsObject()
  answers: Record<string, number>;

  @IsOptional()
  meta?: Record<string, any>;
}
