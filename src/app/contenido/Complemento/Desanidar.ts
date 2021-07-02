import {Arbol} from '../AST/Arbol';
import { Nodo } from '../AST/Nodo';
import { Funcion } from '../Instrucciones/Funcion';
import { Traducir } from './Traducir';
class Desanidar{

    contenido:Array<Nodo> = [];
    contenido_aux:Array<Nodo> = [];
    contador = 0;
    val_exp = "";
    inicio = 0;
    fin = 0;
    desanidar(arbol: Arbol):string{//metodo para desanidar funciones
        this.contenido = [];//en esta lista se va guardar el contenido desanidado
        for(let i  = 0; i < arbol.instrucciones.length; i++){// reccorer las instrucciones 
            let instruccion = arbol.instrucciones[i];// guardas inst[i] en unava
            if(instruccion instanceof Funcion){ // pregunto si es de tipo funcion
                this.recorrer_funcion(instruccion, instruccion.nombre,[]);
                if(this.contenido_aux.length > 0){
                    for(let i = this.contenido_aux.length -1; i >= 0; i--){
                        this.contenido.push(this.contenido_aux[i]);
                    }
                    this.contenido_aux = [];
                }
            }else{//agregar la instruccion como tal
                this.contenido.push(instruccion);
            }
        }
        arbol.instrucciones = this.contenido;
        
        return new Traducir().traducir(arbol.instrucciones);
    }

    recorrer_funcion(func: Funcion, nombre: string,padre:string[]){//metodo que recorre las intrucciones de las funciones
        let f_aux = new Funcion(nombre, func.parametros,[],func.tipo,func.linea, func.columna);
        f_aux.padre = padre;
        for(let i = 0; i < func.contenido.length; i++){
            let inst = func.contenido[i];
            if(inst instanceof Funcion){
                padre.push(f_aux.nombre);
                this.recorrer_funcion(inst, inst.nombre, padre);
            }else{
                f_aux.contenido.push(inst);
            }
        }
        this.contenido_aux.push(f_aux);
    }

    hay_anidada(arbol: Arbol):boolean{
        for(let i = 0; i < arbol.instrucciones.length; i++){
            let funcion  = arbol.instrucciones[i];
            if(funcion instanceof Funcion){
                for(let j = 0; j < funcion.contenido.length; j++){
                    let contenido = funcion.contenido[j];
                    if(contenido instanceof Funcion){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

export {Desanidar};