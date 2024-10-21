//Defino mediante unión los tipos literales para tarea
type Tipo= "microtarea" | "macrotarea" | "promise" ; //Coloco como "Tipo", el tipo de "promise", porque me servirá para identificar
//a una tarea de este tipo y pueda usar await cuando sea un elemento de ese tipo.

//También crearé un tipo para la propiedad "prioridad"
type Prioridad="baja" | "alta";

//Definiré la interfaz Tarea con sus propiedades y métodos, donde colocaré que prioridad sea de solo tipo lectura, es decir, "readonly"
interface Tarea{
    id:number;
    tipo:Tipo;
    readonly prioridad:Prioridad;
    ejecutar():void | Promise<string>; //Acá esta función consideré que puede devolver una promesa, ya que la usaré para usar "await" al momento de
    //ejecutar una tarea de tipo "promise" en el arreglo que simulará el bucle de eventos
}

//Ahora crearé un clase abstracta "Tareas" que implementará la interfaz "Tarea"
//y así definir las propiedades para las clases hijas que heredan de esta clase abstracta
abstract class Task implements Tarea{
    //Defino las propiedades definidas por la interfaz en el constructor
    constructor(public id:number,public tipo:Tipo,readonly prioridad:Prioridad){};


    //Ahora, el método "ejecutar" definido por la interfaz, será abstracto, ya que una clase abstracta
    //debe tener por lo menos un método abstracto. Este método la heredarán las clases hijas, donde cada una de ellas implementará el
    //método, pero tendrá un comportamiento distinto dependiendo de qué clase la ejecuta (polimorfismo)
    abstract ejecutar():void;
} 

//Creo la clase Microtarea que heredará de la clase abstracta "Task"
class Microtarea extends Task{
    //La propiedad "tipo" para esta clase será por defecto "microtarea"

    //De la misma forma, defino las props. restantes definidas por la interfaz en el constructor
    constructor(public id_micro:number,readonly prioridad_micro:Prioridad){
        //Llamo al constructor de la clase padre mediante "super" para que inicialice las propiedades del objeto que se está instanciando
        super(id_micro,"microtarea",prioridad_micro); //Acá se inicializan las propiedades "id,tipo,prioridad" para el objeto
    };


    //Implemento el método definido por la clase abstracta
    ejecutar():void{
        console.log(`${this.tipo} de ID ${this.id_micro} y prioridad ${this.prioridad_micro} fue ejecutada`);
    };
}

//De la misma forma, creo la clase Macrotarea que heredará de la clase abstracta "Task" (lo mismo que con Microtarea)
class Macrotarea extends Task{
    //Creo el constructor para colocarle las propiedades al objeto ni bien sea instanciado
    constructor(public id_macro:number,readonly prioridad_macro:Prioridad){
        //Llamo al constructor de la clase padre para que inicialice las props del objeto
        super(id_macro,"macrotarea",prioridad_macro);
    }

    //Implemento el método definido por la clase abstracta
    ejecutar():void{
        console.log(`${this.tipo} de ID ${this.id_macro} y prioridad ${this.prioridad_macro} fue ejecutada`);
    };

}

//Por eso, crearé tipos de macrotareas, así que para ello crearé clases específicas que heredarán de "Macrotarea"
class TareaTimeOut extends Macrotarea{
    //De igual manera, defino el constructor y agrego una propiedad nueva "delay"
    constructor(public id_timeout:number,readonly prioridad_timeout:Prioridad,public delay:number){
        //Llamo al constructor de la clase padre mediante super y se inicialicen las propiedades
        super(id_timeout,prioridad_timeout);
    }

    //Ahora, definiré un método (ejecutar), pero como es una tarea de tipo "timeout",
    //entonces el método "ejecutar" simulará la ejecución de la tarea si transcurrió el tiempo de espera (delay) y en caso sea así, la ejecutará
    //Para ello, usaré setTimeout con el valor "delay" pasado por parámetro
    ejecutar():void{
        console.log(`${this.tipo} TimeOut de ID ${this.id_timeout} se ejecutará en ${this.delay/1000} segundos`);
        setTimeout(()=>{
            console.log(`${this.tipo} TimeOut de ID ${this.id_macro} y prioridad ${this.prioridad_macro} empezó a ejecutarse`);
        },this.delay);
    }
}

//Crearé la clase para representar una microtarea "Promise", por lo que extenderá de la clase "Microtarea"
class TareaPromise extends Microtarea{
    //Defino el constructor de igual manera
    constructor(public id_tareapromise:number,readonly prioridad_tareapromise:Prioridad,public delay:number){
        //Llamo al constructor de la clase padre
        super(id_tareapromise,prioridad_tareapromise);
        this.tipo="promise"; //Acá establezco el tipo "promise" y en base a ello, dentro del arreglo que simulará la queue en el bucle de eventos
        //pueda usar "await" siempre y cuando "tipo" sea promise
        
    }

    //Defino el método ejecutar el cual retornará una promesa
    ejecutar():Promise<string>{
        return new Promise((resolve)=>{
            console.log(`Microtarea 'Promise' de ID ${this.id_tareapromise} se completará en ${this.delay/1000} segundos`);
            setTimeout(()=>{
                //La promesa se resuelve luego del tiempo pasado por parámetro
                resolve(`Microtarea 'Promise' de ID ${this.id_tareapromise} y prioridad ${this.prioridad_tareapromise} completada`);
            },this.delay)
        })
    }
}


//Crearé la clase genérica que simule el event loop y aceptará cualquier elemento que tenga como mínimo
//las propiedades definidas por la interfaz Tarea y así pueda manejar los elementos del arreglo, pues estos elementos pueden ser de diferentes tipos:
//"microtareas, tareaTimeOut,promises",etc. Y como estas clases no necesariamente comparten todas sus propiedades y métodos, pero sí parten de la interfaz "Tarea", entonces
//la clase será genérica para que pueda manipular cualquier tipo que tengan como mínimo las props y métodos definidos por la interfaz "Tarea"
class EventLoop<T extends Tarea>{
    //Crearé un arreglo (será privado) que simule la queue donde se almacenan las tareas
    private queue:T[]=[];

    //Creo el método para agregar tareas y que aceptará elementos del tipo "T" genérico que ya expliqué anteriormente
    agregarTareas(tarea:T){
        this.queue.push(tarea);
    }

  
    //Crearé otro método que se encargará de la ejecución (simular la ejecución del event loop)
    async ejecutar(){
        //Usaré un bucle while, pues este tendrá que iterar siempre y cuando la queue no esté vacía.
        while (this.queue.length){
            //Mientras no esté vacía, y como la queue tiene un comportamiento de tal forma de que la primera tarea en entrar, sea la primera en salir, utilizaré "shift" de
            //los arreglos, y almacenaré dicho elemento removido por el método "shift" en una constante; 
            const tarea_ejecutada=this.queue.shift()
            
            //Como "tarea_ejecutada", al ser un elemento del arreglo de tipo "T", entonces tendrá la propiedad "ejecutar", por lo que usaré ello para simular
            //que la tarea ya fue ejecutada llamando al método "ejecutar" de cada elemento del tipo "T" (que ya se sabe, tendrá el método "ejecutar"), pues "T extends Tarea"
            //Lo colocaré en un condicional, pues el método shift bien puede devolver elementos de tipo "T", como undefined
            if (tarea_ejecutada){
                //Ahora, si es una tarea "promise", entonces usaré await, pues el método "ejecutar" de la clase "TareaPromise" retorna una promesa
                if (tarea_ejecutada.tipo=="promise"){
                    const resultado=await tarea_ejecutada.ejecutar();
                    console.log("Resultado:",resultado);
                }
                //En caso contrario, no será necesario, ya que los métodos "ejecutar" de las otras clases no retornan promesas
                else{
                    tarea_ejecutada.ejecutar();
                }
                
            }
        }
    }

    //Definiré el getter para visualizar el arreglo "queue" en caso sea necesario
    obtenerQueue(){
        return this.queue;
    }
}


//Definiré una función para simular el funcionamiento del event loop
function Ejecucion(){
    //Acá creo las tareas
    const tarea1=new Microtarea(1,"alta");
    const tarea2=new Macrotarea(2,"alta");
    const tarea3=new TareaTimeOut(3,"alta",2000);
    const tarea4=new Macrotarea(4,"alta");
    const tarea5=new TareaPromise(5,"alta",4000);
    const tarea6=new Microtarea(6,"baja");


    //Creo un objeto de la clase EventLoop
    const event_loop=new EventLoop();

    //Agrego las tareas
    event_loop.agregarTareas(tarea1);
    event_loop.agregarTareas(tarea2);
    event_loop.agregarTareas(tarea3);
    event_loop.agregarTareas(tarea4);
    event_loop.agregarTareas(tarea5);
    event_loop.agregarTareas(tarea6);



    //Ejecuto mediante el método "ejecutar" del objeto "event_loop"
    event_loop.ejecutar();


}

Ejecucion();