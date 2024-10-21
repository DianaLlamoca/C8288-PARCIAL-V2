//Importo los hooks que usaré
import {useEffect} from 'react'
import {useState} from 'react'
import {useReducer} from 'react'

//Crearé un arreglo "data" que tendrá cada uno de los datos simulados para mostrar en pantalla
//Cada elemento será un objeto que tendrá la propiedad "id" y su valor correspondiente
//La propiedad "id" está debido a que la información que mostraré estará en formato de un elemento lista <li>, por lo que será necesaria
//dicha propiedad 
const data_inicial=[];

for (let i=0; i<10;i++){
    //Agrego los valores correspondientes
    data_inicial.push({
        id:i+1,
        valor:Math.floor(Math.random()*100)
    });
}

//Usaré una función reducer para que maneje las posibilidades de si se quiere filtrar o actualizar la data generada
//Esta función recibirá el estado (representará la data actual) y la accion (un objeto que indicará qué se va a realizar(si filtrar o actualizar))
const DataReducer=(estado,action)=>{
    //Aquí es donde usaré "switch" para manejar las diferentes acciones
    switch (action.type){
        //Si la acción es actualizar data, entonces lo retorno
        case 'actualizar_data':
            //Acá retornaré la nueva data generada
            return action.nueva_data;

        case 'filtrar_data':
            //Acá usaré la función "filter" para filtrar la data que está representada mediante "estado"
            return estado.filter((data)=>{
                //Solo se filtrará la data que es mayor al valor indicado
                return data.valor>action.nueva_data;
            })
        //De lo contrario, se resuelve la data actual almacenada en "estado"
        default:
            return estado;
    }
}


export function Tablero(){
    
    //Ya que la data inicial ha sido generada, usaré el hook useReducer, que recibirá como parámetro la función Reducer y la data inicial
    //Y retornará la data pasada por parámetro y una función dispatch, en el que mediante esta función se podrán ejecutar las acciones indicadas en la función reducer
    const [data,dispatch]=useReducer(DataReducer,data_inicial);

    //Además, implementaré un estado que capture el valor que representa el valor que servirá para filtrar la data en base al valor introducido por el usuario
    const [datoFiltro,setDatoFiltro]=useState(""); //Inicialmente será una cadena vacía, pero se irá actualizando a medida que se ingrese un input

    //Ahora voy a definir la función que actualizará los datos cada 3 segundos
    const ActualizarData=()=>{
        //Acá es donde genero nueva data, para ello usaré desestructuración de objetos
        const data_nueva=data.map((data)=>({
            ...data,
            valor:data.valor+Math.floor(Math.random()*15) //Acá el nuevo valor sobreescribirá al número de la propiedad "valor" anterior del objeto (por la desestructuración) 
        }));
        //Ahora, esta nueva data generada, la pasaré mediante la función "dispatch", la cual recibirá un objeto
        //con las propiedades "type" y "nueva_data" para que utilice la función reductora que definí anteriormente
        //dispatch acá retornará el return correspondiente a case "actualizar_data"
        dispatch({type:"actualizar_data",nueva_data:data_nueva});
    };

    //Usaré el hook useEffect para simular la generación de data cada cierto intervalo de tiempo y para ello tendrá
    //como elementos en el arreglo de dependencias la data actual y la función que la irá modificando. En este caso, la generación de data nueva será de 3 segundos.
    //Para simular que la data se muestra en cada intervalo de tiempo, usaré setInterval
    useEffect(()=>{
        //A la función setInterval, le pasaré como parámetro la función que definí y se encargará de actualizar la data
        setInterval(ActualizarData,3000);
        },[data,ActualizarData])

    //Ahora, como se indica que el usuario puede filtrar data, usaré estado "dato_filtro" que definí al inicio para que
    //se pueda filtrar en base a lo que el usuario coloca como input

    //Defino la función controladora de eventos que se encargará de capturar lo que el usuario ingresa
    //Esta recibirá el evento y accederé a la propiedad ".target.value" para obtener el input
    const Filtro=(evento)=>{
        //Uso el setDatoFiltro que definí anteriormente y modicar el estado "datoFiltro"
        setDatoFiltro(evento.target.value);

        //Aquí colocaré una condicional para que se filtren datos siempre y cuando el valor del filtro no sea una cadena vacía
        if (evento.target.value){
            //Uso dispatch, pero ahora en el caso "filtrar_data" que definí en la función reductora
            dispatch({type:"filtrar_data",nueva_data:evento.target.value})
        }
        //Sin embargo, si no hay ningún valor en el filtro, que se muestren todos los datos
        else{
            dispatch({type:"actualizar_data",nueva_data:data_inicial});
        }
    };

    //Aquí devuelvo un JSX, que contendrá un input y un botón.
    //En "input" se está registrando el evento onChange, de la tal manera que cada que el usuario
    //ingrese un valor este será capturado y manejado por la función controladora de evento "Filtro" que
    //definí anteriormente.
    //De la misma forma, el botón contiene un evento "click", que usará la función "setDatoFiltro" al clickear sobre él.
    //Finalmente, uso el operador ternario que determina si la data actual con respecto al filtro introducido está vacía
    //(es decir, que no hay valores mayores al ingresado por el usuario en la data actual), se mostrará "Resultados no encontrados".
    //De lo contrario, usaré el método "map" de los arreglos para retornar cada valor como elementos en una lista
    return(
        <div>
            <input type="number" value={datoFiltro} onChange={Filtro}/>

            <button onClick={()=>{setDatoFiltro("")}}>Restablecer filtro</button>

            <ul>
                {data.length === 0 ? (<p>Resultados no encontrados</p>) : data.map((item)=>{
                    return <li key={item.id}>{item.valor}</li>
                })}
            </ul>
            
        </div>
    )
    
}