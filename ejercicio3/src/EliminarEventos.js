//Hago uso de useState para capturar el nombre del evento que el usuario quiere eliminar
import {useState} from 'react';

//Este componente solo se encargará de mostrar los eventos restantes


export function EventosRestantes({events}){
    return(
        <div>
            <ul>
                <h3>ELEMENTOS RESTANTES:</h3>
                {events.map((evento,index)=>{
                    return <li key={index}>{evento.titulo}</li>
                })}
            </ul>
        </div>
    )
}


//Recibe el array, pues lo que haré es eliminar eventos en base a la propiedad "titulo"
export function EliminarEvento({eventos}){
    const [eventoActualizado,setEvent]=useState(false); //Este estado servirá como valor "truthy" para mostrar el componente cuando el usuario decide eliminar un evento
    const [events,setEvents]=useState([]); //En este arreglo se almacenarán los eventos cuya propiedad "titulo" con coincide con la enviada por el usuario

    const [nombre_evento,setNombreEvento]=useState('');

    //Defino la función controladora de eventos que se encargará de ejecutar esta función cada vez
    //que el elemento <input> cambie. Es decir, cada que el usuario escribe en esta sección
    const NombreEvento=(evento)=>{
        //Actualizo el estado de "nombre_evento" de tal forma que almacene el input del usuario
        setNombreEvento(evento.target.value);
        
    }

    const Valor=()=>{
        //Al hacer click, se eliminará ese elemento de la prop pasada "eventos"
        const eventos_restantes=eventos.filter((objeto)=>{
            //Acá encontraré el índice del evento cuyo nombre sean distintos del evento que se quiere remover
            return objeto.titulo!==nombre_evento;
            
        })
        //Acá colocaré la condicional de que si el arreglo de eventos actualizados es el mismo que el original, entonces
        //significa que no hubo modificaciones y que el titulo del evento pasado por el input no existe
        if (eventos_restantes.length === eventos.length){
            //Se manda un mensaje de alerta que no se encuentra dicho evento con ese titulo
            alert("El título del evento no existe")
        }

        //En caso contrario, el evento existe y se muestran los eventos restantes actualizando el estado del componente que servirá
        //para mostrar los eventos restantes
        else{
            setEvents(eventos_restantes);
            setEvent(true);
        }
    }

    return(
        <div>
            <label>
                <h1>EVENTO A ELIMINAR:</h1>
                TÍTULO DEL EVENTO A ELIMINAR: <input onChange={NombreEvento}/>
            </label>

            <button onClick={Valor}>Eliminar</button>

            {eventoActualizado && <EventosRestantes events={events}/>}
        </div>
    )
}
