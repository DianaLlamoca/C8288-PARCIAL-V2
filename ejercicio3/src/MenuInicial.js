//En este componente haré uso de useEffect para mostrar un mensaje inicial por 3 segundos
import {useEffect} from 'react';
import {useState} from 'react';

//Importo el componente que muestra el formulario
import {CrearEvento} from './CrearEvento';

export function Menu(){
    //Usaré useState para controlar cuándo debe aparecer o no el mensaje (al inicio será true y luego lo cambiaré a "false" para
    //que aparezca el componente que mostrará el formulario)
    const [mensaje,setMensaje]=useState(true);

    //Acá haré uso de "useState" para mostrar un mensaje por 3 segundos al inicio del renderizado, por ello uso "[]" como dependencia.
    //Luego de 3 segundos el estado de "mensaje" cambiará a false
    useEffect(()=>{
        setTimeout(()=>{
            setMensaje(false);
        },3000);
    },[])

    //Si el estado de "mensaje" es "true", mostraré el mensaje de bienvenida
    if (mensaje){
        return(
            <div>
                <h1>¡Hola! Acá podrás crear eventos</h1>
            </div>
        )
    }
    //Cuando el estado de "mensaje" sea "false" (esto sucede luego de 3 segundos por el useEffect), se ejecutará
    //el siguiente return porque ya no cumple con la condicional inicial de 'if (mensaje)'.
    //Acá muestro el componente que enseñará el formulario. Para lo cual usaré anidamiento de componentes.
    return(
        <div>
            <CrearEvento/>
        </div>
    )
}