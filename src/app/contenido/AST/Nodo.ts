import { Type } from '@angular/core';

import {Tipo, tipos} from './Tipo';
import {Tabla} from './Tabla';
import {Arbol} from './Arbol';
import { TitleCasePipe } from '@angular/common';

abstract class Nodo{
    linea : number;
    columna : number;
    tipo : Tipo;
    traduccion: string;
    

    abstract ejecutar(tabla: Tabla, arbol: Arbol): any;
    abstract traducir(tabla: Tabla, arbol: Arbol): any;
    
    graficar_ts(tabla: Tabla, arbol:Arbol){
        let t_actual: Tabla = tabla;
        let ambito = "";
        let cont = 0;
        for(let key of Array.from( t_actual.variables.keys()) ) {
            cont++;
        }
        if(cont > 0){
            let graph = "<table class=\"table table-striped table-hover\">";
            graph += "<tr class=\"info\"><td>Nombre</td><td>Tipo</td><td>Ambito</td><td>Apuntador</td><td>Fila</td><td>Columna</td></tr>";
            //for(t_actual = tabla; t_actual != null; t_actual = t_actual.t_anterior){
                for(let key of Array.from( t_actual.variables.keys()) ) {
                    if(t_actual.t_anterior ==  null){
                        ambito = "Global";
                    }else{
                        ambito = "Local";
                    }
                    let val = t_actual.variables.get(key);
                    if(val.mostrar){
                        graph += "<tr><td>" + key + "</td><td>" 
                        + val.tipo + "</td><td>" 
                        + ambito + "</td><td>" 
                        + val.tmp + "</td><td>"
                        + val.linea + "</td><td>" 
                        + val.columna + "</td></tr>" ;
    
                    }
                }
            //}
            graph += "<table>";
             //recorrrer la tabla   
            arbol.reportes.push(graph);
        
        }
    }
    
    cadena_a_heap(cadena:string, arbol:Arbol){
        let resultado = "";
        let t = arbol.contador_tmp;
        for(let i = 0; i < cadena.length; i++){
            let ascii = cadena.charCodeAt(i);
            if(cadena[i] == '\\'){
                if(cadena[i + 1] == 'n'){
                    ascii = 10;
                    i++;
                }else if(cadena[i + 1] == 't'){
                    ascii = 9;
                    i++;
                }

            }
            resultado += "\nt1 =  " + ascii + ";\n";
            resultado += "heap[(int)h] = t1;\nh = h + 1;"; 
        }
        return resultado;
    }

    numero_a_heap(numero, arbol:Arbol){
        let resultado = "";
            resultado += "t1 =  " + numero + ";\n";
            resultado += "heap[(int)h] = t1;\nh = h + 1;"; 
        return resultado;
    }
    
    guardar_numero(valor, arbol:Arbol){
        arbol.contenido += "t3 = " + valor + ";\n";     
        arbol.contenido += "convertir_numero();\n";
    
    }
    constructor(tipo: Tipo, linea: number, columna: number) {
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
    }
   
}

export{Nodo};