import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';
import { Tipo } from '../AST/Tipo';

class Return extends Nodo {

    condicion: Nodo;
    valor: Object;
    constructor(condicion: Nodo, linea: number, columna: number) {
        super(null, linea, columna);
        this.condicion = condicion;
        this.valor = null;
    }

    traducir(tabla: Tabla, arbol: Arbol){
        if(this.condicion != null){
            if(arbol.etiquetas_return.length > 0){
                let e_retrn = arbol.etiquetas_return.pop();
                arbol.etiquetas_return.push(e_retrn);
                let tmp_return = arbol.return_principal;
                arbol.contenido += "\n//--------   Return ----------";
                let tmp = this.condicion.traducir(tabla, arbol);
                this.tipo.type = this.condicion.tipo.type; 
                
                arbol.contenido += "\n//--------   Return  ----------";
                arbol.contenido += "\nstack[(int) " + tmp_return +"] = " + tmp + ";\ngoto " + e_retrn + ";";
            }else{
                //error semantico
                const error = new Errror('Semantico',
                    `El Return no se encuentra dentro de una funcion`,
                    this.linea, this.columna);
                    arbol.errores.push(error);
                    arbol.consola.push(error.toString());
                    return error;
            }
            
        }
        
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        if(this.condicion != null){
            this.valor = this.condicion.ejecutar(tabla, arbol);
            this.tipo = this.condicion.tipo;
            return this;
        }
        return null;
    }
}
export {Return};