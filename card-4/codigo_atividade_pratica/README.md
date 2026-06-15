# 🎮 Games Review - Aplicação Next.js

Uma aplicação web para registro e avaliação de jogos que você já jogou!

## 📋 Funcionalidades

- ✅ Adicionar jogos com nota e comentário
- ✅ Buscar capas de jogos automaticamente (API RAWG)
- ✅ Editar e deletar jogos
- ✅ Persistência com localStorage
- ✅ Interface responsiva com Tailwind CSS
- ✅ Sistema de avaliação por estrelas ⭐

## 🚀 Como Rodar o Projeto

### 1. Instalar dependências

```bash
cd games-review
npm install
```

### 2. Executar em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### 3. Build para produção

```bash
npm run build
npm run start
```

## 📁 Estrutura do Projeto

```
games-review/
├── app/
│   ├── layout.jsx       # Layout principal com navegação
│   ├── globals.css      # Estilos globais
│   ├── page.jsx         # Página inicial (lista de jogos)
│   └── add/
│       └── page.jsx     # Página para adicionar jogo
├── components/
│   ├── GameCard.jsx     # Card individual do jogo
│   ├── GameForm.jsx     # Formulário para adicionar jogo
│   ├── Header.jsx       # Componente de navegação
│   └── EmptyState.jsx   # Estado vazio (nenhum jogo adicionado)
├── services/
│   └── gamesApi.js      # Chamadas para API RAWG
└── public/
    └── images/          # Imagens estáticas
```

## 🎯 Como Usar

1. **Acessar a página inicial** - Vê todos seus jogos salvos
2. **Adicionar um jogo** - Clique em "+ Adicionar Jogo"
3. **Buscar no RAWG** - A app busca automaticamente a capa do jogo
4. **Avaliar e comentar** - Dê uma nota e deixe um comentário
5. **Editar/Deletar** - Modifique suas avaliações quando quiser

## 🔑 Configuração da API RAWG

1. Acesse https://rawg.io/apidocs
2. Registre-se e obtenha sua chave de API
3. Crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_RAWG_API_KEY=sua_chave_aqui
```

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **React 19** - Biblioteca UI
- **Tailwind CSS** - Estilização
- **JavaScript ES6+** - Linguagem

## 📝 Licença

Este projeto é livre para uso educacional.
