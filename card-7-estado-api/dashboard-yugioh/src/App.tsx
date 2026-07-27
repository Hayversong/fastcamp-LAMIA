import { useRegulationsQuery } from "./modules/regulations/hooks/useRegulationsQuery";
import type { RegulationLimit } from "./modules/regulations/types";
import "./App.css";

function getLimitLabel(limit: RegulationLimit): string {
  switch (limit) {
    case 0:
      return "Proibida";

    case 1:
      return "Limitada";

    case 2:
      return "Semilimitada";
  }
}

function App() {
  const regulationsQuery = useRegulationsQuery();

  if (regulationsQuery.isPending) {
    return (
      <main>
        <h1>Regulamentação Yu-Gi-Oh!</h1>
        <p>Carregando lista de cartas...</p>
      </main>
    );
  }

  if (regulationsQuery.isError) {
    return (
      <main>
        <h1>Regulamentação Yu-Gi-Oh!</h1>
        <p>Não foi possível carregar os dados.</p>
        <p>{regulationsQuery.error.message}</p>

        <button onClick={() => regulationsQuery.refetch()}>
          Tentar novamente
        </button>
      </main>
    );
  }

  const { date, cards } = regulationsQuery.data;

  return (
    <main>
      <h1>Regulamentação Yu-Gi-Oh!</h1>

      <p>Lista atual do Master Duel</p>
      <p>Em vigor desde: {date}</p>
      <p>Total de cartas regulamentadas: {cards.length}</p>

      <table>
        <thead>
          <tr>
            <th>ID da carta</th>
            <th>Status</th>
            <th>Cópias permitidas</th>
          </tr>
        </thead>

        <tbody>
          {cards.slice(0, 20).map((card) => (
            <tr key={card.cardId}>
              <td>{card.cardId}</td>
              <td>{getLimitLabel(card.limit)}</td>
              <td>{card.limit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Exibindo as primeiras 20 cartas.</p>
    </main>
  );
}

export default App;
