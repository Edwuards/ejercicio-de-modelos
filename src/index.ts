import { Usuarios } from './db';

let a = Usuarios.select({campos:['firstname','lastname','id'],donde:[['id','=',1]]});
console.log(a);