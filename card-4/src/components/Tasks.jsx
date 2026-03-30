import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function Tasks(props) {
  const navigate = useNavigate();

  function onSeeDetails(task) {
    //uma boa prática para se usar em react é criar uma query string para passar os dados para outra página, ao invés de usar o state do react-router, pois isso permite que a página seja recarregada sem perder os dados. Além disso, é mais fácil de debugar e compartilhar a URL com os dados.
    const query = new URLSearchParams;
    query.set("title", task.title);
    query.set("description", task.description);
    navigate(`/task?${query.toString()}`);
  }
  return (
    <ul className="space-y-4 p-6 bg-slate-200 rounded-md shadow">
      {props.tasks.map((task) => (
        //para cada item da lista renderizado, é necessário passar uma key única para o React identificar qual item foi alterado, adicionado ou removido. A key deve ser única entre os irmãos, mas pode ser a mesma em diferentes listas. O ideal é usar um ID único para cada item, como o ID da tarefa.
        <li key={task.id} className="flex gap-2">
          <button
            onClick={() => props.onTaskClick(task.id)} className={
            `bg-slate-400 text-left w-full text-white p-2 rounded-md ${task.isCompleted && 'line-through'}`
            }>
                {task.title}
          </button>
          <Button onClick={() => onSeeDetails(task)} >
            <ChevronRightIcon />
          </Button>
          <Button onClick={() => props.onTaskDelete(task.id)} >
            <TrashIcon />
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default Tasks;
