import { useEffect, useState } from 'react'
import './index.css'
import Formulario from './Formulario'

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
              return { ...tarea, completada: !tarea.completada };
            }
            return tarea;
          })
        );
      }
    })
  }

  return (
    <>
      <Formulario  crearTarea={crearTarea} />
      <section className='tareas'>
        {tareas.map(tarea => (
          <div key={tarea.id} className='tarea'>
            <h2 className='visible'>{tarea.tarea}</h2>
            <input type="text" defaultValue="Aprender React" />
            <button className='boton'>Editar</button>
            <button className='boton' onClick={() => borrarTarea(tarea.id)}>Borrar</button>
            <button className={`estado ${tarea.completada ? "terminada" : null}`} onClick={() => toggleEstado(tarea.id)}><span></span></button>
          </div>
        ))}
      </section>
    </>
  )
}

export default App
