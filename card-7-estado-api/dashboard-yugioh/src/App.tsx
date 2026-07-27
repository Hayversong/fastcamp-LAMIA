import { useState } from "react";
import { Header } from "./components/Header";
import { useRegulationsQuery } from "./modules/regulations/hooks/useRegulationsQuery";
import type { RegulationLimit } from "./modules/regulations/types";
import "./App.css";

type StatusFilter = "all" | "0" | "1" | "2";

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

function RegulationContent() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const regulationsQuery = useRegulationsQuery();

  if (regulationsQuery.isPending) {
    return (
      <div className="feedback">
        <p>Carregando lista de cartas...</p>
      </div>
    );
  }

  if (regulationsQuery.isError) {
    return (
      <div className="feedback feedback--error">
        <strong>Não foi possível carregar os dados.</strong>
        <p>{regulationsQuery.error.message}</p>

        <button onClick={() => regulationsQuery.refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  const { date, cards } = regulationsQuery.data;

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.cardId.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" || String(card.limit) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <section className="summary">
        <article className="summary__card">
          <span>Modalidade</span>
          <strong>Master Duel</strong>
        </article>

        <article className="summary__card">
          <span>Em vigor desde</span>
          <strong>{date}</strong>
        </article>

        <article className="summary__card">
          <span>Cartas regulamentadas</span>
          <strong>{cards.length}</strong>
        </article>
      </section>

      <section className="regulation">
        <div className="regulation__heading">
          <div>
            <h2>Lista de regulamentação</h2>

            <p>
              {filteredCards.length} de {cards.length} cartas encontradas
            </p>
          </div>

          <div className="filters">
            <label>
              <span>Pesquisar por ID</span>

              <input
                type="search"
                value={search}
                placeholder="Ex.: 4023"
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label>
              <span>Status</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
              >
                <option value="all">Todos</option>
                <option value="0">Proibidas</option>
                <option value="1">Limitadas</option>
                <option value="2">Semilimitadas</option>
              </select>
            </label>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID da carta</th>
                <th>Status</th>
                <th>Cópias permitidas</th>
              </tr>
            </thead>

            <tbody>
              {filteredCards.slice(0, 20).map((card) => (
                <tr key={card.cardId}>
                  <td>#{card.cardId}</td>

                  <td>
                    <span className={`status status--${card.limit}`}>
                      {getLimitLabel(card.limit)}
                    </span>
                  </td>

                  <td>{card.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCards.length === 0 && (
          <p className="empty-state">
            Nenhuma carta corresponde aos filtros selecionados.
          </p>
        )}
      </section>
    </>
  );
}

function App() {
  return (
    <>
      <Header />

      <main className="dashboard">
        <section className="dashboard__intro">
          <span>Lista de proibidas & limitadas</span>
          <h1>Regulamentação Yu-Gi-Oh!</h1>
          <p>Acompanhe a lista atual de restrições do Master Duel.</p>
        </section>

        <RegulationContent />
      </main>
    </>
  );
}

export default App;
