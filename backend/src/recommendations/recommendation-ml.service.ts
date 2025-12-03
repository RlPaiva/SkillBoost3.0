// backend/src/recommendation/recommendation-ml.service.ts
import { Injectable, Logger } from '@nestjs/common';

/**
 * Serviço que faria a chamada ao modelo / algoritmo real.
 * Aqui deixei um exemplo genérico que você pode adaptar para chamar
 * um modelo externo, um microserviço, ou executar inferência local.
 */
@Injectable()
export class RecommendationMlService {
  private readonly logger = new Logger(RecommendationMlService.name);

  constructor(
    // injete dependências se necessário (ex.: client HTTP, kafka, etc.)
  ) {}

  async predict(input: any): Promise<Array<{ area: string; score: number }>> {
    // Exemplo placeholder — substitua pela sua lógica/ML real.
    // Mantive a mesma saída do mock como fallback.
    this.logger.debug('Recebendo input para ML predict: ' + JSON.stringify(input));

    // === Aqui você chamaria o seu pipeline de ML ===
    // const mlResult = await this.mlClient.predict(input);

    // Por enquanto, retorno simulado:
    return [
      { area: 'be', score: 34 },
      { area: 'ss', score: 34 },
      { area: 'ux', score: 20 },
      { area: 'fe', score: 12 },
    ];
  }
}
