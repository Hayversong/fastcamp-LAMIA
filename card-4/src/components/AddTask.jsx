import { useState } from "react"
import Input from "./Input.jsx";

function AddTask({onTaskAdd}){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return(
        <div className=" space-y-4 p-6 bg-slate-200 rounded-md shadow flex flex-col">
            <Input
                type="text" 
                placeholder="Título da tarefa"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />
            <Input
                type="text" 
                placeholder="Descrição da tarefa" 
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />
            <button onClick={() => {
                //verificar se o título e a descrição não estão vazios
                if (title.trim() === "" || description.trim() === "") {
                    alert("Por favor, preencha o título e a descrição da tarefa.");
                    return;
                }
                onTaskAdd(title, description);
                setTitle("");
                setDescription("");
            }} className="bg-slate-500 text-white px-4 py-2 rounded-md font-medium">adicionar</button>
        </div>
    )
}

export default AddTask