import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Nodo } from "../AST/Nodo";
import { Simbolo } from '../AST/Simbolo';
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';
import { Primitivo } from '../Expresiones/Primitivo';
import { Arreglo } from './Arreglo';

class Char_At extends Nodo{
    expresion: Nodo;
    posicion: Nodo;
    id: string;
    
    constructor(expresion:Nodo, posicion:Nodo,  linea: number, columna: number){
        super(null, linea, columna);
        this.expresion = expresion;
        this.posicion = posicion;
    }
    traducir(tabla: Tabla, arbol: Arbol){
        let res = this.expresion.traducir(tabla, arbol);
        let tmp_res = res;
        
        let pos  = this.posicion.traducir(tabla, arbol);
        if(pos instanceof Errror){
            return null;
        }
        if(res instanceof Errror){
            //error
            return null;
        }

        if(this.expresion.tipo.type != tipos.STRING){
            //error
            return null;
        }
        if(this.posicion.tipo.type != tipos.NUMBER){
            //error
            return null;
        }
        let e_si = arbol.generar_etiqueta();
        let e_no = arbol.generar_etiqueta();
        let e_ma = arbol.generar_etiqueta();
        this.tipo = this.expresion.tipo;   
        arbol.contenido += "\nt1 = " + tmp_res + ";";
        arbol.contenido += "\nt4 = " + pos + ";";
        arbol.contenido += "\nchar_at();";
        arbol.contenido += "\nif(t6 == 1)goto " + e_si+ ";";
        arbol.contenido += "\ngoto " + e_no +";";
        arbol.contenido += "\n" + e_si +":";
        let aux = arbol.generar_temporal();
        arbol.contenido += "\n" + aux +" = h;";
        arbol.contenido += "\nt1 = t2;";
        arbol.contenido += "\nheap[(int)h] = t1;\nh = h + 1;";
        arbol.contenido += "\nt1 = -1;\nheap[(int)h] = t1;\nh = h + 1;";
        arbol.contenido += "\ngoto " +e_ma +";";
        arbol.contenido += "\n" + e_no +":";
        arbol.contenido += "\n" + aux +" = h;";
        arbol.contenido += "\nt1 = -1;\nheap[(int)h] = t1;\nh = h + 1;";
        arbol.contenido += "\n"+e_ma+":";
        return aux;  
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        return 0;
    }
    
}
export {Char_At};
