import { useState } from "react"

function Tarea({id,tarea,terminada,borrarTarea,toggleEstado,editarTexto}){
    
    let [editando, setEditando] = useState(false)
    let [nuevaTarea, setNuevaTarea] = useState(tarea)  

    let guardar = () => {
        setEditando(false)
        fetch(`http://localhost:3000/api-todo/actualizar/${id}/1`, {
            method : "PUT",
            body : JSON.stringify({ tarea : nuevaTarea}),
            headers : {"Content-type" : "application/json"}
        })
        .then(respuesta => respuesta.json())
        .then(({resultado}) => {
            if(resultado === "ok"){
                editarTexto({tarea : nuevaTarea, terminada : false, id})
              }
          })
      }
    
    return (
        <div className='tarea'>
            {editando ? (<input type="text" className="visible" value={nuevaTarea} onChange={evento => setNuevaTarea(evento.target.value)} />) : (<h2 className={editando ? "" : "visible"}>{tarea}</h2>) }
            
            <button className='boton' onClick={() => {
                if(editando){
                    guardar()
                }
                else{
                    setEditando(true)
                }
            }}>{editando ? "Guardar" : "Editar"}</button>
            <button className='boton' onClick={() => borrarTarea(id)}>Borrar</button>
            <button className={`estado ${terminada ? "terminada" : null}`} onClick={() => toggleEstado(id)}><span></span></button>
          </div>
    )
}

export default Tarea