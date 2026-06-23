# Lamia Analytics Dashboard

Dashboard responsivo criado com Next.js App Router, TypeScript strict, Tailwind CSS, componentes no estilo Shadcn UI, Lucide React e Recharts.

## Como rodar

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run build
npm run lint
npm run test
npm run test:watch
npm run test:coverage
npm run typecheck
```

## Arquitetura

- `app/`: páginas e layout do App Router.
- `components/`: UI desacoplada e componentes compostos.
- `lib/validation.ts`: schemas Zod e helper de validação.
- `lib/format.ts`: formatadores reutilizáveis.
- `types/`: reexports e contratos compartilhados.
- `tests/`: testes de validação e helpers.

O dashboard não possui persistência local nem chamadas externas com secrets, então as camadas `services/`, `context/` e `app/api/` ficam reservadas para quando houver fluxo de dados mutável ou integração real.
