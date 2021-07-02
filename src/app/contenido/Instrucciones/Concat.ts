import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Nodo } from "../AST/Nodo";
import { Simbolo } from '../AST/Simbolo';
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';
import { Primitivo } from '../Expresiones/Primitivo';
import { Arreglo } from './Arreglo';

class Concat extends Nodo{
    exp1: Nodo;
    exp2: Nodo;
    id: string;
    
    constructor(exp1:Nodo, exp2:Nodo, linea: number, columna: number){
        super(null, linea, columna);
        this.exp1 = exp1;
        this.exp2 = exp2;
    }
    traducir(tabla: Tabla, arbol: Arbol){
        let res1 = this.exp1.traducir(tabla, arbol);
        let res2 = this.exp2.traducir(tabla, arbol);
        let tmp1 = res1;
        let tmp2 = res2;
        if(res1 instanceof Errror){
            //error
            return null;
        }
       
        if(this.exp1.tipo.type != tipos.STRING || this.exp1.tipo.type != tipos.STRING){
            //error
            return null;
        }
        this.tipo = this.exp1.tipo;   
        let tmp = arbol.generar_temporal();
        
        arbol.contenido += "\n" + tmp + " = h;";
        arbol.contenido += "\nt1 = " + tmp1 + ";";
        arbol.contenido += "\nunir_cadena();";
        arbol.contenido += "\nt1 = " + tmp2 + ";";
        arbol.contenido += "\nunir_cadena();";
        arbol.contenido += "\nt1 =  -1;\nheap[(int)h] = t1;\nh = h + 1;\n";
        return tmp;  
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        return 0;
    }
    
}
export {Concat};
