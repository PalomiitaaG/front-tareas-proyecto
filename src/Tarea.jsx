import { useState } from "react"
import { FaTrashAlt } from "react-icons/fa";
import { FaGripVertical } from "react-icons/fa"; //icono para arrastrar
import { FaPen } from "react-icons/fa"; //boton editar
import { FaFloppyDisk } from "react-icons/fa6"; //boton guardar

//Creamos un funcion para la tarea con todas las props para poder hacer todas las funciones.
function Tarea({id,tarea,terminada,borrarTarea,toggleEstado,editarTexto}){
    
    let [editando, setEditando] = useState(false) //creamos un estado para identificar si la tarea se esta editando o no. La colocamos como false como principal.
    let [nuevaTarea, setNuevaTarea] = useState(tarea) //crea un estado con un valor inicial igual al valor de la tarea actual.

    let guardar = () => { //definimos una función guardar, que se utiliza para guardar los cambios realizados en una tarea después de editarla.
        fetch(`https://api-tareas-proyecto.onrender.com/api-todo/actualizar/${id}/1`, { //hacemos la solicitud post con el id y con la operación 1 que es la de editar el texto.
            method : "PUT",
            body : JSON.stringify({ tarea : nuevaTarea}), //incluye el campo "tarea", que se establece en el valor de la variable de estado "nuevaTarea"
            headers : {"Content-type" : "application/json"}
        })
        .then(respuesta => respuesta.json())
        .then(({resultado}) => { 
            if(resultado === "ok"){ //si el resultado de ok se llama la función de editar texto.
                editarTexto({tarea : nuevaTarea, terminada : false, id}) // se añade la nueva tarea
                setNuevaTarea(nuevaTarea) // se actualiza el estado.
                setEditando(false) //para indicar que ya no se está editando la tarea.
            }
        })
    }
    
    return (
    //Se utiliza un operador ternario para determinar si se debe mostrar el campo de edición o el texto de la tarea. 
    //Si "editando" es verdadero, se muestra el input donde puedes editar el texto de la tarea. El formulario con el valor establecido como "nuevaTarea", que almacena el valor de la tarea mientras se edita.
    //Si "editando" es false, se muestra el h2 con el texto de la tarea.

    //Dentro de la seccion se colocan los botones. En el botón de editar cuando hacemos clic pregunta que si esta editando y si es true llama  a la función guardar y si no se cambia el estado de editar.
    //Creamos un operador ternario en el que si editando es true sale el icono de guardar y si el false aparece el icono del boli.

    //En el botón de borrar cuando hacemos click llamamos a la función de borrar.

    //botón de estado en la clase creamos un operador ternario en el que si el si el estado esta terminado la clase se cambia a terminado y si no le ponemos null. Cuando hacemos click llamamos a la función de toggle estado.
        <div className='tarea'>
            {editando ? (<input type="text" className="visible" value={nuevaTarea} onChange={evento => setNuevaTarea(evento.target.value)} />) : (<h2 className={editando ? "" : "visible"}>{tarea}</h2>) }
            <section className="opciones">
                <FaGripVertical className="icono-drag" />
                <div className="botones">
                    <button className='boton' onClick={() => {
                        if(editando){
                            guardar()
                        }
                        else{
                            setEditando(true)
                        }
                    }}>{editando ? <FaFloppyDisk /> : <FaPen />}</button>
                    <button className='boton' onClick={() => borrarTarea(id)}><FaTrashAlt /></button>
                    <button className={`estado ${terminada ? "terminada" : null}`} onClick={() => toggleEstado(id)}><span></span></button>
                </div>
            </section>
          </div>
    )
}

export default Tarea