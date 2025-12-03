#!/bin/bash
set -e

# instalar dependências
npm ci

# buildar
npm run build

# iniciar em produção (usa PORT fornecido pelo Railway)
npm run start:prod
