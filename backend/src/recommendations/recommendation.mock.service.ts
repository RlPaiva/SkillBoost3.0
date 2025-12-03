// backend/src/recommendations/recommendation.mock.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecommendationMockService {
  async predict(input: any) {
    // Aqui você pode usar o input (respostas) para customizar a simulação.
    // Para dev, vamos retornar um objeto completo com areas + profiles + courses.
    return {
      areas: [
        { areaCode: 'be', areaName: 'Back-End', score: 34 },
        { areaCode: 'ss', areaName: 'Segurança da Informação', score: 34 },
        { areaCode: 'ux', areaName: 'UX / UI Design', score: 20 },
        { areaCode: 'fe', areaName: 'Front-End', score: 12 },
      ],
      profiles: [
        {
          perfil: 'Programação — Back-End',
          habilidades: 'APIs, banco de dados, segurança, lógica, testes',
          courses: [
            {
              id: 'c-be-1',
              title: 'Desenvolvimento Back-End com Node.js e NestJS',
              description: 'Aprenda a construir APIs escaláveis com Node.js, TypeScript e NestJS.',
              youtube: 'https://www.youtube.com/watch?v=example1',
            },
            {
              id: 'c-be-2',
              title: 'Banco de Dados e Modelagem (SQL)',
              description: 'Modelagem relacional, índices, consultas otimizadas e boas práticas.',
              youtube: 'https://www.youtube.com/watch?v=example2',
            },
          ],
        },
        {
          perfil: 'UX / UI Design',
          habilidades: 'Prototipação, testes de usabilidade, design system',
          courses: [
            {
              id: 'c-ux-1',
              title: 'UX Design: Pesquisa e Prototipação',
              description: 'Metodologias de pesquisa, criação de protótipos e testes com usuários.',
              youtube: 'https://www.youtube.com/watch?v=example3',
            },
          ],
        },
      ],
    };
  }
}
