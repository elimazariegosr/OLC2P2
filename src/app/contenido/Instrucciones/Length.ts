import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Nodo } from "../AST/Nodo";
import { Simbolo } from '../AST/Simbolo';
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';
import { Arreglo } from './Arreglo';
import { Arreglo_3d } from './Arreglo_3d';
import { Identificador } from './Identificador';

class Length extends Nodo{
    expresion: Nodo;
    id: string;
    
    constructor(expresion:Nodo, linea: number, columna: number){
        super(null, linea, columna);
        this.expresion = expresion;
    }
    traducir(tabla: Tabla, arbol: Arbol){
        this.tipo = new Tipo(tipos.NUMBER);
         let val:Simbolo = null;
        if(this.expresion instanceof Identificador){
            val = tabla.get_var(this.expresion.id);     
        }   
        let tmp;
        if(val != null){
            let arr = val.valor;
            if(arr instanceof Arreglo_3d){
                tmp  = arbol.generar_temporal();
                arbol.contenido += "\n" + tmp + " = " + arr.tmp_tamanio + ";";
                return tmp;
            }   
        }
        let res = this.expresion.traducir(tabla, arbol);
        if(res instanceof Errror){
             //error
             return null;
         }   
        arbol.contenido += "\nt1 = " + res + ";";
        tmp  = arbol.generar_temporal();
        arbol.contenido += "\nlength_expresion();";
        arbol.contenido += "\n" + tmp + " = t5;";
        return tmp;  
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        return 0;
    }
    
}
export {Length};
