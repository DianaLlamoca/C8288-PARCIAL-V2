
//Este componente se encargará de mostrar los eventos
export function VerEventos({eventos}){
    //Acá se reciba la propiedad "eventos" que se pasa a través del componente padre
    //Por cada evento creado, iteraré cada uno de ellos y solo mostraré el nombre (o titulo) del evento
    return(
        <div>
            <ul>
                <label>
                    <h3>VISUALIZACIÓN DE LOS EVENTOS CREADOS:</h3>
                    {eventos.map((elemento,index)=>{
                        return <li key={index}>{elemento.titulo}</li>
                    })}
                </label>
            </ul>
        </div>
    )
}