import { useState } from "react";

function App() {
  const [message, setMessage] = useState("Olá, mundo!");
  //states (ou estado)
  return (
    <div>
      <h1>{message}</h1>
      <button
        onClick={() => {
          setMessage("Olá, fui clicado!");
        }}
      >
        Mudar mensagem
      </button>
    </div>
  );
}

export default App;
