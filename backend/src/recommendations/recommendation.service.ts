// backend/src/recommendations/recommendation.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { RecommendationMlService } from './recommendation-ml.service';
import { RecommendationMockService } from './recommendation.mock.service';
import { AREA_NAMES } from './area-names';

type RawArea = {
  area?: string;
  areaCode?: string;
  areaName?: string;
  score?: number;
  pct?: number;
  [k: string]: any;
};

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(
    private readonly mlService: RecommendationMlService,
    private readonly mockService: RecommendationMockService,
  ) {}

  private isObject(v: unknown): v is Record<string, any> {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  private extractAreas(raw: unknown): RawArea[] {
    if (!raw) return [];

    if (Array.isArray(raw)) return raw as RawArea[];

    if (!this.isObject(raw)) return [];

    const obj = raw as Record<string, any>;

    if (Array.isArray(obj.areas)) return obj.areas as RawArea[];
    if (Array.isArray(obj.recommendations)) return obj.recommendations as RawArea[];
    if (Array.isArray(obj.results)) return obj.results as RawArea[];
    if (Array.isArray(obj.items)) return obj.items as RawArea[];
    if (Array.isArray(obj.data)) return obj.data as RawArea[];

    // fallback: se alguma propriedade for array, retorna a primeira array
    for (const key of Object.keys(obj)) {
      if (Array.isArray(obj[key])) return obj[key] as RawArea[];
    }

    return [];
  }

  /**
   * Retorna { areas: [...], profiles: [...] }
   */
  async getRecommendations(input: any, opts?: { useMock?: boolean }) {
    this.logger.debug('getRecommendations input: ' + JSON.stringify(input || {}).slice(0, 1000));

    const raw: unknown = opts?.useMock ? await this.mockService.predict(input) : await this.mlService.predict(input);

    // extrai areas de forma segura
    const areasRaw = this.extractAreas(raw);

    // extrai profiles de forma segura: narrow e cast quando necessário
    let profiles: any[] = [];
    if (this.isObject(raw)) {
      const rawObj = raw as Record<string, any>;
      if (Array.isArray(rawObj.profiles)) {
        profiles = rawObj.profiles;
      } else if (Array.isArray((rawObj as any).profiles)) {
        // fallback com cast (compatibilidade)
        profiles = (rawObj as any).profiles;
      } else if (Array.isArray(rawObj.profiles_list)) {
        // caso seu mock use outra chave
        profiles = rawObj.profiles_list;
      } else {
        // tenta encontrar alguma propriedade plausível contendo perfis (opcional)
        for (const k of ['profiles', 'profile', 'profilesList', 'items']) {
          if (Array.isArray(rawObj[k])) {
            profiles = rawObj[k];
            break;
          }
        }
      }
    }

    // formata as areas
    const formattedAreas = (areasRaw || []).map((r: RawArea) => {
      const code = String(r.areaCode ?? r.area ?? '').toLowerCase().trim();
      const score = Number(r.score ?? r.pct ?? r.value ?? 0);

      const name =
        (r.areaName && String(r.areaName)) ||
        (code && (AREA_NAMES[code] ?? undefined)) ||
        (r.area && String(r.area)) ||
        code ||
        'Desconhecido';

      return {
        areaCode: code || 'unknown',
        areaName: name,
        score,
      };
    });

    // ordena por score desc (opcional)
    formattedAreas.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    const output = {
      areas: formattedAreas,
      profiles: Array.isArray(profiles) ? profiles : [],
    };

    this.logger.debug('getRecommendations output: ' + JSON.stringify(output));
    return output;
  }
}
