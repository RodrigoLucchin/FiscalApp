# FiscalApp

Aplicação Fiscal NW Drones — interface para visualizar preços de custo, NFe e integração Omie.

## Como rodar localmente

Pré-requisitos: Node.js e npm

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (não commite). Exemplo de conteúdo:

```
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_KEY=your-public-anon-key
```

Obs: `.env` já está listado em `.gitignore`.

## Estrutura

- `src/pages/PrecosCusto.tsx` — página de preços de custo e seleção de itens
- `src/lib/supabase.ts` — cliente Supabase

## Envio para o GitHub

Repositório criado por script. Após clonar, adicione seu `.env` e rode `npm install`.

## Licença

Coloque aqui sua licença ou mantenha como privado.
