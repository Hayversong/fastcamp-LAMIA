import { useState } from "react"

function AddTask({onTaskAdd}){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    return(
        <div className=" space-y-4 p-6 bg-slate-200 rounded-md shadow flex flex-col">
            <input
                type="text" 
                placeholder="Título da tarefa"
                className="border border-slate-400 outline-slate-400 px-4 py-2 rounded-md" 
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />
            <input 
                type="text" 
                placeholder="Descrição da tarefa" 
                className="border border-slate-400 outline-slate-400 px-4 py-2 rounded-md" 
                value={description}
                onChange={(event) => setTitle(event.target.value)}
            />
            <button className="bg-slate-500 text-white px-4 py-2 rounded-md font-medium" onClick={() => {
                onTaskAdd(title, description);
                setTitle("");
                setDescription("");
            }}>adicionar</button>
        </div>
    )
}

export default AddTask