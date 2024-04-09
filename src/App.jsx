import { useEffect, useState } from 'react'
import './index.css'
import Formulario from './Formulario'
import Tarea from './Tarea'


function App() {
  let [tareas, setTareas] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/api-todo")
    .then(respuesta => respuesta.json())
    .then(tareas => setTareas(tareas))
  },[])

  function crearTarea(tarea){
    setTareas([...tareas,tarea])
    
  }

  function borrarTarea(id){
    fetch(`http://localhost:3000/api-todo/borrar/${id}`, {
      method : "DELETE"
    })
    .then(respuesta => respuesta.json())
    .then(({resultado}) => {
      if(resultado == "ok"){
        return setTareas(tareas.filter(tarea => tarea.id != id))
      }
      console.log("error usuario")
    })
  }
  
  function toggleEstado(id){
    return fetch(`http://localhost:3000/api-todo/actualizar/${id}/2`, {
      method : "PUT"
    })
    .then(respuesta => respuesta.json())
    .then(({resultado}) => {
      if(resultado == "ok"){
        setTareas(tareas => 
          tareas.map(tarea => {
            if (tarea.id === id) {
              return { ...tarea, terminada: !tarea.terminada };
            }
            return tarea;
          })
        );
      }
    })
  }

  function editarTexto(nuevaTarea){
    setTareas(tareas.map(tarea => {
      if(tarea.id === nuevaTarea.id){
        return { ...tarea, tarea : nuevaTarea.tarea, terminada : nuevaTarea.terminada}
      }
      return tarea
    }))
  }

  return (
    <>
      <Formulario  crearTarea={crearTarea} />
      <section className='tareas'>
        { tareas.length > 0 ? tareas.map(tarea => <Tarea key={tarea.id}
                                    id={tarea.id}
                                    tarea={tarea.tarea}
                                    terminada={tarea.terminada}
                                    borrarTarea={borrarTarea}
                                    toggleEstado={toggleEstado}
                                    editarTexto={editarTexto} />) : <p>No hay Tareas</p>}
      </section>
    </>
  )
}

export default App
