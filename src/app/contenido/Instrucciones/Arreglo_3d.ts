import { table } from 'console';
import { connect } from 'http2';
import { isArray } from 'util';
import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Nodo } from "../AST/Nodo";
import { Simbolo } from '../AST/Simbolo';
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';
import { Primitivo } from '../Expresiones/Primitivo';

class Arreglo_3d extends Nodo{
    
    nombre: string;
    contenido = Array<Nodo>();
    dimension: number;
    tamanio: Nodo;
    tmp_tamanio: string;
    tmp_incio: string;
    list_valor: Array<string>;

    

    constructor(nombre: string, tipo:Tipo, contenido: Array<Nodo>, dimension: number, tamanio: Nodo, linea: number, columna:number){
        super(tipo, linea, columna);
        if(tipo == null){
            this.tipo = new Tipo(tipos.ANY);
        }
        
        this.nombre = nombre;
        this.contenido = contenido;
        this.dimension = dimension;
        this.tamanio = tamanio;
        this.list_valor = [];
        
    }
    
    traducir(tabla: Tabla, arbol: Arbol){
        let simbolo: Simbolo;    
        simbolo = new Simbolo(this.tipo, this.nombre, this, this.linea, this.columna);
        let resp = tabla.set_variable(simbolo);

        if(resp != null){
             //error   
        }else{
            this.tmp_tamanio = arbol.generar_temporal();
            let tam = 0;
            if(this.tamanio != null){
                 tam = this.tamanio.traducir(tabla, arbol);
            }else{
                this.contenido.forEach(element => {
                    tam++;
                });
            } 
            let dec = true;

            this.contenido.forEach(element => {
                let val = element.traducir(tabla, arbol);
                this.list_valor.push(val);
                if(element.tipo.type != this.tipo.type){
                   dec =false;
                }
            });
            if(!dec){   
                const error = new Errror('Semantico',
                `El tipo del arreglo no coincide con el tipo de la expresion`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
        
            }
            arbol.contenido += "\n" + this.tmp_tamanio + " = " + tam + ";//-- tamanio arreglo";
            this.tmp_incio = arbol.generar_temporal();
            simbolo.tmp = this.tmp_incio;
            arbol.contenido += "\n" + this.tmp_incio + " = h; //-- inicio    arreglo";
    
            this.list_valor.forEach(element => {
                let val = element;
                arbol.contenido += "\nheap[(int)h] = " + val + ";"; 
                arbol.contenido += "\nh = h + 1;"
            });
            if(this.tamanio != null){
                arbol.contenido += "\nh = h + " + this.tmp_tamanio +";";    
            }
    
        }        
    }
    ejecutar(tabla: Tabla, arbol: Arbol){

    }
   
}
class Asig_Arreglo_3d extends Nodo{
    
    nombre: string;
    contenido = Array<Nodo>();
    tamanio: Nodo;
    list_valor: Array<string>;

    constructor(nombre: string, contenido: Array<Nodo>,  tamanio: Nodo, linea: number, columna:number){
        super(null, linea, columna);
        
        this.nombre = nombre;
        this.contenido = contenido;
        this.tamanio = tamanio;
        this.list_valor = [];
        
    }
    
    traducir(tabla: Tabla, arbol:Arbol){
        let resp = tabla.get_var(this.nombre);
        let arr;
        if(resp ==  null){
            return null;
        }
        arr = resp.valor;
        if(arr instanceof Arreglo_3d){
            let tam = 0;
            if(this.tamanio != null){
                 tam = this.tamanio.traducir(tabla, arbol);
            }else{
                this.contenido.forEach(element => {
                    tam++;
                });
            } 
            let dec = true;

            this.contenido.forEach(element => {
                let val = element.traducir(tabla, arbol);
                this.list_valor.push(val);
                if(element.tipo.type != this.tipo.type){
                   dec =false;
                }
            });
            if(!dec){
                const error = new Errror('Semantico',
                `El tipo del arreglo no coincide con el tipo de la expresion`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
            }
            arbol.contenido += "\n" + arr.tmp_tamanio + " = " + tam + ";//-- tamanio arreglo";
            arbol.contenido += "\n" + arr.tmp_incio + " = h; //-- inicio    arreglo";
    
            this.list_valor.forEach(element => {
                let val = element;
                
                arbol.contenido += "\nheap[(int)h] = " + val + ";"; 
                arbol.contenido += "\nh = h + 1;"
            });
            if(this.tamanio != null){
                arbol.contenido += "\nh = h + " + arr.tmp_tamanio +";";    
            }
        }

    }
    ejecutar(tabla: Tabla, arbol: Arbol){

    }
}



class Get_Arreglo_3d extends Nodo{
    
    nombre: string;
    posicion: Array<Object>;
    simbol: Simbolo;
    arreglo: Arreglo_3d;
    constructor(nombre:string, posicion:Array<Object>, fila: number, columna:number){
        super(null, fila, columna);
        this.nombre = nombre;
        this.posicion = posicion;
    }

    traducir(tabla: Tabla, arbol: Arbol){
        let pos = null;
        if(this.posicion[0] instanceof Nodo){
          pos =  this.posicion[0].traducir(tabla, arbol);
        }
        this.simbol = tabla.get_var(this.nombre);
        if(this.simbol.valor instanceof Arreglo_3d){
            this.arreglo = this.simbol.valor;
        }
        this.tipo = this.arreglo.tipo;
        let pos_real = arbol.generar_temporal();
        arbol.contenido += "\n" + pos_real + " = " + this.arreglo.tmp_incio + " + " + pos +" ;"; 
        let tmp_res = arbol.generar_temporal();
        arbol.contenido += "\n" + tmp_res + " = heap[(int) " + pos_real + "];";
        return tmp_res;
    }

    ejecutar(tabla: Tabla, arbol: Arbol){

    }
   
}
class Set_Arreglo_3d extends Nodo{
    
    nombre: string;
    posicion: Array<Object>;
    valor: Nodo;
    simbol: Simbolo;
    arreglo: Arreglo_3d;
    constructor(nombre:string, posicion:Array<Object>, valor:Nodo, fila: number, columna:number){
        super(null, fila, columna);
        this.nombre = nombre;
        this.posicion = posicion;
        this.valor = valor;
    }

    traducir(tabla: Tabla, arbol: Arbol){
        
        this.simbol = tabla.get_var(this.nombre);
        if(this.simbol == null){
            //no existe 
            const error = new Errror('Semantico',
            `No existe el arreglo`,
            this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
            return error;
        }
        if(this.simbol.valor instanceof Arreglo_3d){
            this.arreglo = this.simbol.valor;
        }
    
        let pos = null;
        if(this.posicion[0] instanceof Nodo){
          pos =  this.posicion[0].traducir(tabla, arbol);
        }

        let val = this.valor.traducir(tabla, arbol);
        this.tipo = this.valor.tipo;
        this.tipo = this.arreglo.tipo;
        if(this.tipo.type != this.valor.tipo.type){
            //error tipos
            const error = new Errror('Semantico',
            `El tipo del arreglo no coincide con la expresion`,
            this.linea, this.columna);
            arbol.errores.push(error);
            arbol.consola.push(error.toString());
            return error;
            return null;
        }
        let pos_real = arbol.generar_temporal();
        arbol.contenido += "\n//------- Obteniendo posicion";
        arbol.contenido += "\n" + pos_real + " = " + this.arreglo.tmp_incio + " + " + pos +" ;"; 
        arbol.contenido += "\n//------- Agregando valor a al arreglo";
        arbol.contenido += "\nheap[(int) " + pos_real + "] = " + val + ";" ;
        return null;
    }

    ejecutar(tabla: Tabla, arbol: Arbol){

    }
   
}


export{Arreglo_3d, Get_Arreglo_3d, Set_Arreglo_3d, Asig_Arreglo_3d};
