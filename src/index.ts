import {
    consulta
} from './db';

consulta(['SELECT * FROM usuarios',[],(error,resultado)=>{
    console.log(resultado)
}]);