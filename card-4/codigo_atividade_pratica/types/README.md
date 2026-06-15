# Estrutura de Tipos TypeScript

## Organização

A pasta `types/` contém todos os tipos e interfaces TypeScript do projeto, organizados por domínio:

```
types/
├── index.ts      # Export centralizado de todos os tipos
├── game.ts       # Tipos relacionados a jogos
├── form.ts       # Tipos relacionados a formulários
└── api.ts        # Tipos de API e responses
```

## Arquivos

### `game.ts` - Tipos de Jogos

Define interfaces para dados de jogos:

- `SearchedGame` - Jogo encontrado na API RAWG
- `GameData` - Jogo com dados completos para salvar
- `SavedGame` - Jogo salvo no localStorage (com id e createdAt)
- `GameCardProps` - Props do componente GameCard

**Importação:**

```typescript
import type { SearchedGame, GameData, SavedGame, GameCardProps } from "@/types";
```

### `form.ts` - Tipos de Formulários

Define interfaces para formulários e inputs:

- `GameFormInput` - Dados de entrada do formulário
- `GameFormProps` - Props do componente GameForm

**Importação:**

```typescript
import type { GameFormInput, GameFormProps } from "@/types";
```

### `api.ts` - Tipos de API

Define interfaces para validações e responses:

- `ValidationResult<T>` - Resultado genérico de validação
- `ApiError` - Estrutura de erro da API
- `RawgApiResponse<T>` - Response padrão da API RAWG

**Importação:**

```typescript
import type { ValidationResult, ApiError, RawgApiResponse } from "@/types";
```

### `index.ts` - Export Central

Arquivo de re-export que centraliza todas as importações:

```typescript
export type { SearchedGame, GameData, SavedGame, GameCardProps } from "./game";
export type { GameFormInput, GameFormProps } from "./form";
export type { ValidationResult, ApiError, RawgApiResponse } from "./api";
```

## Como Usar

### Importar um tipo específico

```typescript
import type { SavedGame } from "@/types";

const game: SavedGame = {
  /* ... */
};
```

### Importar múltiplos tipos

```typescript
import type { GameData, GameFormInput } from "@/types";
```

### Importar um tipo genérico

```typescript
import type { ValidationResult } from "@/types";

const result: ValidationResult<GameData> = {
  /* ... */
};
```

## Padrões

### 1. Props de Componentes

Props são definidas como interfaces sufixadas com `Props`:

```typescript
export interface GameCardProps {
  game: SavedGame;
  onDelete: (id: number) => void;
  onUpdateRating: (id: number, rating: number, comment: string) => void;
}
```

### 2. Tipos Genéricos

Tipos reutilizáveis usam genéricos:

```typescript
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 3. Nullabilidade Explícita

Campos opcionais são explícitos:

```typescript
image: string | null;  // Pode ser string ou null
released?: string;     // Opcional (undefined)
```

## Adicionar Novos Tipos

1. **Identifique o domínio:** O tipo é sobre jogos, formulários ou API?
2. **Escolha o arquivo:** Adicione em `game.ts`, `form.ts` ou `api.ts`
3. **Exporte em `index.ts`:** Adicione na lista de re-exports
4. **Use em todo o projeto:** Importe de `@/types`

Exemplo - Adicionar novo tipo em `game.ts`:

```typescript
// types/game.ts
export interface GameStats {
  totalGames: number;
  averageRating: number;
}

// types/index.ts
export type { GameStats } from "./game";

// Usando em componente
import type { GameStats } from "@/types";
```
