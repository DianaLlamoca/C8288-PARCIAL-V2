import './App.css';

//Importo el hook "useState" para gestionar el estado de los eventos y los formularios de entrada
import {useState} from 'react';


//Importo el componente de almacenar eventos para pasarle como prop el almacen donde se guardan los eventos
import {VerEventos} from './VerEventos';

import {EliminarEvento} from './EliminarEventos'

//Acá defino las funciones controladoras de evento que se encargarán de manejar cada uno de los eventos generados por el usuario
//Este controlador se encargará de mostrar los datos por consola de los eventos creados


//Componente funcional que se encargará de la creación de eventos
export function CrearEvento() {
  //Hago uso del useState (dentro del componente), cuyo valor de estado inicial será un objeto con las propiedades que deben tener los eventos
  const [evento,setEvento]=useState({
    titulo:"",
    fecha:"",
    ubicacion:"",
    descripcion:""
    });




    //Cada que el usuario haga click en "crear evento", se almacenarán los eventos en un arreglo para que luego puedan ser consultados
    //Para ello, usaré useState , para actualizar el almacén cada que el usuario crea un nuevo evento (el almacén está vació al inicio)
    const [almacen,setAlmacen]=useState([]);
   
    //console.log("Almacen:",almacen);

    //Crearé un estado que permitirá mostrar los eventos y pasar el prop "almacen" al componente AlmacenarEventos
    //Inicialmente será false, y SOLO que cambiará a "true" cuando el usuario crea un evento.
    //Lo cual sucede cuando el controlador de eventos "EventoAgregado" se activa en el evento onSubmit del formulario
    const [mostrarEventos,setMostrarEventos]=useState(false);
    //Usaré "mostrarEventos" como un valor "truthy" para renderizado condicional 


    //Crearé una función controladora de eventos para que cada que se envíe el evento (mediante el botón de tipo "submit")
    //se muestre el mensaje del evento agregado. Esta función contr. de eventos se le pasará a la función "onSubmit" del formulario
    const EventoAgregado=(event)=>{
      event.preventDefault()
      //Acá es donde agrego los eventos usando useState
      setAlmacen([...almacen,evento]);
      

      //Aquí cambiaré el estado de "mostrarEventos" ya que lo usaré como "truthy" para que solo se muestren los eventos
      //cuando el usuario cree uno
      setMostrarEventos(true);

      //Muestro un mensaje que indique la confirmación al haber creado el evento
      alert("¡Evento creado!")
    }

   //Haré uso de la función onChange en el componente "input" para obtener los valores que se ingresan al completar los formularios
   const introducirDatos=(event)=>{
    //Lo que se pasa por parámetro será el evento que desencadena la ejecución de la función controladora de eventos
    //Aplico desestructuración y el atributo "target" (referencia al elemento que activó el evento)
    //para ir cambiando los valores de cada evento de acuerdo a lo que se ingresa por el input
    const {name,value}=event.target;


    
    //Uso setEvento y desestructuración para cambiar el estado de la propiedad que está almacenada en "name", pues dicho
    //atributo lo coloqué al crear el componente "input" y contiene el nombre de la propiedad al que hace referencia 
    setEvento({
      ...evento,
      [name]:value
    })

   }

  return (
    <div>
      <h1>CREAR EVENTO</h1>
      <form onSubmit={EventoAgregado}>
        <label>
          Título: <input name="titulo" onChange={introducirDatos}/>
        </label>

        <br/>

        <label>
          Fecha: <input name="fecha" onChange={introducirDatos}/>
        </label>

        <br/>

        <label>
          Ubicación: <input name="ubicacion" onChange={introducirDatos}/>
        </label>

        <br/>

        <label>
          Descripción: <input name="descripcion" onChange={introducirDatos}/>
        </label>

        <hr/>

        <button type="submit">Crear evento</button>


      </form>

      {mostrarEventos && <VerEventos eventos={almacen}/>}
      {mostrarEventos && <EliminarEvento eventos={almacen}/>}
      
    </div>
  );
}

export default CrearEvento;
