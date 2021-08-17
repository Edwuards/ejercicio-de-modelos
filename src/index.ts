import { consulta } from './db';

type Operadores = "=" | "!=" | "<=" | "<" | ">=" | ">" | "LIKE" ;
type CláusulaDonde = [string, Operadores , string | number ];

interface Select {
    campos: Array<string>,
    donde: Array<CláusulaDonde>,
}

interface Modelo {
    mesa: string,
    campos: Array<string>
}

class Modelo {
}


consulta(['SELECT * FROM usuarios where id = ?',[1],(error,resultado)=>{
    console.log(resultado)
}]);