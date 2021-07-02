import { Arbol } from '../AST/Arbol';
import { Nodo } from "../AST/Nodo";
import { Simbolo } from '../AST/Simbolo';
import { Tabla } from '../AST/Tabla';
import { Tipo, tipos } from '../AST/Tipo';
import { Break } from '../Expresiones/Break';
import { Continue } from '../Expresiones/Continue';
import { Primitivo } from '../Expresiones/Primitivo';
import { Return } from '../Expresiones/Return';
import { Arreglo } from './Arreglo';
import { Arreglo_3d, Get_Arreglo_3d } from './Arreglo_3d';
import { Declaracion } from './Declaracion';

class For_1 extends Nodo{


    variable: string;
    id: string;
    tipo_for: string;
    contenido: Array<Nodo>;


    constructor(variable: string, tipo_for: string,id: string, contenido: Array<Nodo>, linea: number, columna: number){
        super(null, linea, columna);
        this.variable = variable;
        this.tipo_for = tipo_for;
        this.id = id;
        this.contenido = contenido;
    }

    traducir(tabla: Tabla, arbol: Arbol){
        let simbol =  tabla.get_var(this.id);
        let arr:Arreglo_3d;
        if(simbol != null){
            if(simbol.valor instanceof Arreglo_3d){
                arr = simbol.valor;
            } 
        }
        let nueva_tabla = new Tabla(tabla);
        let e_inicio = arbol.generar_etiqueta();
        let e_si = arbol.generar_etiqueta();
        let e_no = arbol.generar_etiqueta();
        arbol.etiquetas_fin.push(e_no);
        arbol.etiquetas_inicio.push(e_si);
        let tmp_iterator = arbol.generar_temporal();
        let tmp_tamanio = arbol.generar_temporal();
        arbol.contenido += "\n" + e_si + ":";
        arbol.contenido += "\n" + tmp_tamanio + " = " + arr.tmp_tamanio + ";";
        arbol.contenido += "\n" + tmp_iterator + " = -1;";
        arbol.contenido += "\n" + e_inicio + ":";
        arbol.contenido += "\n" + tmp_iterator + " = " + tmp_iterator + " + 1;";
        arbol.contenido += "\nif(" + tmp_iterator + " >= " + tmp_tamanio + ")goto " + e_no + ";";
        let dec = new Declaracion("let", null, this.variable, null, this.linea, this.columna);
        let sim_val:Simbolo;
        let tmp_dec;
        if(this.tipo_for == "in"){
            dec.tipo = new Tipo(tipos.NUMBER);
            tmp_dec = dec.traducir(nueva_tabla, arbol);
            arbol.contenido += "\nstack[(int)" + tmp_dec + "] = " + tmp_iterator + ";";
        }else if(this.tipo_for == "of"){
            dec.tipo  = new Tipo(arr.tipo.type);
            tmp_dec = dec.traducir(nueva_tabla, arbol);
            let tmp_arr = arbol.generar_temporal();
            let tmp_pos = arbol.generar_temporal();
            arbol.contenido += "\n" + tmp_pos + " = " + arr.tmp_incio + " + " + tmp_iterator  + ";"; 
            arbol.contenido += "\n" + tmp_arr + " = heap[(int) " + tmp_pos + "];";
            arbol.contenido += "\nstack[(int)" + tmp_dec + "] = " + tmp_arr + ";";
        }
        this.contenido.forEach(element => {
           element.traducir(nueva_tabla, arbol); 
        });
        arbol.contenido += "\ngoto " +e_inicio + ";";
        arbol.contenido += "\n" + e_no + ":";
        arbol.etiquetas_fin.pop();
        arbol.etiquetas_inicio.pop();
        this.graficar_ts(nueva_tabla, arbol);
        
        return null;
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        let arr = "ARRAY#_" + this.id;
        let res = tabla.get_var(this.id);
        if(res == null){
            res = tabla.get_var(arr);
        }
        let fin;
        if(res.tipo.type == tipos.STRING){
            fin = res.valor.toString().length;
            if(this.tipo_for == "in"){
                // error
            }
        }else if(res.valor instanceof Arreglo){
            fin = res.valor.contenido.length;
        }else{
            return null;
        }
        
        let nueva_tabla = new Tabla(tabla);
        for(let i = 0; i < fin; i++){
            let dec:Declaracion;
            if(this.tipo_for == "of"){
                dec = new Declaracion("let", res.tipo, this.variable, null, this.linea, this.columna);
                if(res.tipo.type == tipos.STRING){
                    dec.valor = new Primitivo(res.tipo, res.valor[i],this.linea, this.columna);
                }else if(res.valor instanceof Arreglo){
                    dec.valor = res.valor.contenido[i];
                }    
            }else if(this.tipo_for == "in"){
                dec = new Declaracion("let", res.tipo, this.variable, null, this.linea, this.columna);
                if(res.valor instanceof Arreglo){
                    dec.valor = new Primitivo(res.tipo, i,this.linea, this.columna);
                }        
            }
            dec.ejecutar(nueva_tabla, arbol);
            for (let j = 0; j < this.contenido.length; j++) {
                const cont = this.contenido[j].ejecutar(nueva_tabla, arbol);
                if(cont instanceof Return){
                    return cont;
                }
                if(cont instanceof Continue || cont instanceof Break){
                    return null;
                }
            }
            nueva_tabla = new Tabla(tabla);   
        }
    }
}
export {For_1};