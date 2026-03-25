import { useState } from "react";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";

function App() {
  const[tasks, setTasks] = useState([
    {
    id: 1,
    title: "estudar programação",
    description: "Estudar programação para se tornar um desenvolvedor fullstack.",
    isCompleted: false  
  }, {
    id: 2,
    title: "fazer exercícios",
    description: "Fazer exercícios para praticar o que aprendeu.",
    isCompleted: false
  }, {    
    id: 3,
    title: "ler livros",
    description: "Ler livros para aprofundar o conhecimento.",
    isCompleted: false
  },
]);

  return (
    <div className="w-screen h-screen bg-slate-500 flex justify-center p-6">
      <div className="w-[500px]">
        <h1 className="text-3xl text-slate-100 font-bold text-center">
          Gerenciador de tarefas
        </h1>
        <AddTask />
        <Tasks tasks={tasks} />
      </div>
    </div>
  );
}

export default App;
