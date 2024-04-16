import { useEffect, useState } from "react"

//creamos la funcion del formulario pasandole la prop de crear Tarea
function Formulario({crearTarea}){

    let [textoTemporal, setTextoTemporal] = useState("") //creamos un estado para el texto que luego se añadira a las tareas.
    return (
        <form onSubmit={evento => {
            evento.preventDefault()

            //hacemos la conexión post a la bbdd en que le pasamos el texto temporal para que lo añada a la tarea.
            fetch("https://api-tareas-proyecto.onrender.com/api-todo/crear", {
                method : "POST",
                body : JSON.stringify({ tarea : textoTemporal }),
                headers : { "Content-type" : "application/json"}
            })
            .then(respuesta => respuesta.json())
            .then(({id}) => {
                if(id){ //si te devuelve el idea es que se ha creado correctamente
                    crearTarea({tarea : textoTemporal, terminada : false, id}) //se llama a la función crear Tarea para agregar ka nueva tarea a la lista de tareas mostrada en la interfaz.
                    return setTextoTemporal("") //te devuelve el textoTemporal vacio.
                }
                console.log("error") //en el caso de que va fallo se mostrará en la consola "error"
            })
        }}>
            <input type="text" placeholder="¿Qué hay que hacer?" value={textoTemporal} onChange={evento => setTextoTemporal(evento.target.value)} /> 
            <input type="submit" value="crear tarea" />
        </form>
    ) //El input text en el que el valor equivaldrá al texto temporal. 
}

export default Formulario