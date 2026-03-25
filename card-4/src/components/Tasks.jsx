import { ChevronRightIcon, DeleteIcon, TrashIcon } from "lucide-react";

function Tasks(props) {
  console.log(props);
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
          <button className=" bg-slate-400 p-2 rounded-md text-white">
            <ChevronRightIcon />
          </button>
           <button onClick={() => props.onTaskDelete(task.id)} className=" bg-slate-400 p-2 rounded-md text-white">
            <TrashIcon />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Tasks;
