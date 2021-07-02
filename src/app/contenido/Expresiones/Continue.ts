import { Nodo } from '../AST/Nodo';
import { Tabla } from '../AST/Tabla';
import { Arbol } from '../AST/Arbol';
import { Errror } from '../AST/Errror';

class Continue extends Nodo {
    constructor(linea: number, columna: number) {
        super(null, linea, columna);
    }
    traducir(tabla: Tabla, arbol: Arbol){
        if(arbol.etiquetas_inicio.length > 0){
            let etiqueta = arbol.etiquetas_inicio.pop();
            arbol.contenido += "\ngoto " + etiqueta + ";";
            arbol.etiquetas_inicio.push(etiqueta);
        }else{
            //errorr semantico
            const error = new Errror('Semantico',
            `El Continue no se encuentra dentro de un ciclo`,
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
export {Continue};