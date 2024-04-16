import { useEffect, useState } from 'react'
import './index.css'
import { FaRegLightbulb } from "react-icons/fa"; //icono de la bombilla
import Formulario from './Formulario'
import Tarea from './Tarea'


function App() {
  let [tareas, setTareas] = useState([]) // Creamos un estado para las tareas para poder actualizarlas y lo metemos en un array.
  let [dragTarea,setDragTarea] = useState(null) // Creamos un estado para cuando se arrastra la tarea, el null indice que no hay ninguna tarea siendo arrastrada.

  //hace la conexión principal a la api para que traigan las tareas.
  useEffect(() => {
    fetch("https://api-tareas-proyecto.onrender.com/api-todo")
    .then(respuesta => respuesta.json())
    .then(tareas => setTareas(tareas))
  },[])

  //creamos una función de crear para que traiga la tarea creada y la añadimos a las tareas que ya teniamos.
  function crearTarea(tarea){
    setTareas([...tareas,tarea])
  }

  //creamos la función de borrar Tarea, con el id hacemos una conexion a la base de datos y hacemos un filtro con el resto de las tareas menos  a la que le hemos hecho click.
  function borrarTarea(id){
    fetch(`https://api-tareas-proyecto.onrender.com/api-todo/borrar/${id}`, {
      method : "DELETE"
    })
    .then(respuesta => respuesta.json())
    .then(({resultado}) => {
      if(resultado == "ok"){
        return setTareas(tareas.filter(tarea => tarea.id != id)) //si el id de la tarea que hemos hecho click es es diferente al id si que lo metemos dentro de la nueva lista.
      }
      console.log("error usuario")
    })
  }
  
  //creamos una función de Toggle del estado.
  function toggleEstado(id){
    return fetch(`https://api-tareas-proyecto.onrender.com/api-todo/actualizar/${id}/2`, { //hacemos una conexión a la bbdd con el id y con la operacion 2 que es la que le indica a la base de datos que es el toggle.
      method : "PUT"
    })
    .then(respuesta => respuesta.json())
    .then(({resultado}) => {
      if(resultado == "ok"){
        setTareas(tareas => 
          tareas.map(tarea => {
            if (tarea.id === id) {
              return { ...tarea, terminada: !tarea.terminada }; //haces nueva tarea diciendo que si la tarea que he le hemos dado tiene el mismo id lo añadas pero con la propiedad terminada del reves.
            }
            return tarea; //devolvemos la tarea nueva que hemos creado.
          })
        );
      }
    })
  }

  //creamos una función de editar el texto.
  function editarTexto(nuevaTarea){ //le pasamos la nuevaTarea (que seriá el texto editado)
    setTareas(tareas.map(tarea => {
      if(tarea.id === nuevaTarea.id){
        return { ...tarea, tarea : nuevaTarea.tarea, terminada : nuevaTarea.terminada} //creamos una nueva tarea en la si el id de la tarea y el id de la nueva tarea tiene el mismo ide se añade la nueva tarea.
      }
      return tarea
    }))
  }

  //creamos una función del cuando se comienxa el arrastre de la tarea y recibe como argumento la tarea.
  function dragStart(tarea){
    setDragTarea(tarea) // se actualiza el estado para reflejar la tarea que se está arrastrando.
  }

  //creamos una funcion de cuando una tarea arrastrada se está moviendose sobre otra tarea. Recibe el índice de la tarea sobre la cual se está moviendo la tarea arrastrada.
  function dragOver(indice){
    if(!dragTarea) return //Comprueba si hay una tarea arrastrada actualmente, si no hay no hace nada.
    let nuevaTareas = [...tareas] //creamos una copia de las tareas actuales, para evitar mutar el estado directamente.
    let indiceAntiguo = nuevaTareas.findIndex(tarea => tarea.id === dragTarea.id) //busca el indice de la tarea arrastrada en la lista de tareas originales.
    let tarea = nuevaTareas.splice(indiceAntiguo, 1)[0] //utilizamos el splice para eliminar la tarea arrastrada de su posición original en la lista y guardarla en la variable "tarea".
    nuevaTareas.splice(indice,0,tarea) //luego inserta la tarea en la nueva posicion especificada por el indice recibido como argumento "indice" utilizando "splice"
    setTareas(nuevaTareas) //actualiza el estado de las tareas con la nueva lista de tareas.
  }

  //la función se activa cuando se completa el arrastre de una tarea.
  function dragEnd(){ 
    setDragTarea(null) //reinicia el estado a "null". Esto indica que no hay ninguma tarea siendo arrastrada actualmente.
  }

  return (
    //En el formulario le pasamos en el prop de la función de crear la tarea.
    //Dentro de la sección de las tareas hay una condición ternaria en la que primero miramos si hay alguna tarea con "tareas.length". Si la longuitud de la lista es mayor de cero, se renderiza el contenido dentro del primer bloque. De lo contrario se renderizará el contenido dentro del segundo bloque de código. Que seria la "p".
    //En el segundo bloque, se hace un map para que por cada tarea, se renderiza un elemento div que representa la tarea. En el que añadimos todas las props. Y dentro del div el componento Tarea.
    <>
      <Formulario  crearTarea={crearTarea} /> 
      <div className='info'>
        <FaRegLightbulb className='bombilla' />
        <p>Prueba arrastar para cambiar el orden</p>
      </div>
      <section className='tareas'>
        { tareas.length > 0 ? tareas.map((tarea, indice) => ( 
        <div key={tarea.id} draggable
              onDragStart={() => dragStart(tarea)}
              onDragOver={() => dragOver(indice)}
              onDragEnd={dragEnd}> 
          <Tarea key={tarea.id}
                id={tarea.id}
                tarea={tarea.tarea}
                terminada={tarea.terminada}
                borrarTarea={borrarTarea}
                toggleEstado={toggleEstado}
                editarTexto={editarTexto} />
        </div>
        )) : <p>No hay Tareas</p>}
      </section>
    </>
  )
}

export default App
