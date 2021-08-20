import { Usuarios } from './db';

Usuarios.select({campos:['nombre','apellido','id'],donde:[['id','=',1]]}).then((resultado)=>{
    console.log(resultado)
}).catch((error)=>{
    console.log(error)
})