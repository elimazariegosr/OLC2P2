import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';

class Break extends Nodo {

    constructor(linea: number, columna: number) {
        super(null, linea, columna);
    }
    traducir(tabla: Tabla, arbol: Arbol){
        if(arbol.etiquetas_fin.length > 0){
            let etiqueta = arbol.etiquetas_fin.pop();
            arbol.contenido += "\ngoto " + etiqueta + ";";
            arbol.etiquetas_fin.push(etiqueta);
        }else{
            //errorr semantico
            const error = new Errror('Semantico',
                `El Break no se encuentra dentro de una sentencia correcta`,
                this.linea, this.columna);
                arbol.errores.push(error);
                arbol.consola.push(error.toString());
                return error;
        }
        
    }

    ejecutar(tabla: Tabla, arbol: Arbol){
        return this;
    }
}
export {Break};