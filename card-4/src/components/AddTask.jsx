function AddTask(){
    return(
        <div className=" space-y-4 p-6 bg-slate-200 rounded-md shadow flex flex-col">
            <input type="text" placeholder="Título da tarefa" className="border border-slate-400 outline-slate-400 px-4 py-2 rounded-md" />
            <input type="text" placeholder="Descrição da tarefa" className="border border-slate-400 outline-slate-400 px-4 py-2 rounded-md" />
            <button>adicionar</button>
        </div>
    )
}

export default AddTask