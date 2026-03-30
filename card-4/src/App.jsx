import { useState } from "react";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";

function App() {
  //quando eu altero um state, eu altero a interface
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

function onTaskClick(taskId) {
  const newTasks = tasks.map((task) => {
    //se o id da tarefa for igual ao id da tarefa clicada, eu altero o estado da tarefa para o contrário do que ele é atualmente
    if (task.id === taskId) {
      return { ...task, isCompleted: !task.isCompleted };
    } else {
      return task;
    }
    return task;
  });
  setTasks(newTasks);  
}

function onTaskDelete(taskId) {
  //Deletar tarefas da lista
  const newTasks = tasks.filter(task => task.id != taskId);
  setTasks(newTasks);
}

function onTaskAdd(title, description) {
  //Adicionar tarefas na lista
  const newTask = {
    id: tasks.length,
    title: title,
    description: description,
    isCompleted: false
  }
  setTasks([...tasks, newTask]);
}
  return (
    <div className="w-screen h-screen bg-slate-500 flex justify-center p-6">
      <div className="w-[500px] space-y-4">
        <h1 className="text-3xl text-slate-100 font-bold text-center">
          Gerenciador de tarefas
        </h1>
        <AddTask onTaskAdd={onTaskAdd} />
        <Tasks 
          tasks={tasks} 
          onTaskClick={onTaskClick} 
          onTaskDelete={onTaskDelete} />
      </div>
    </div>
  );
}

export default App;
