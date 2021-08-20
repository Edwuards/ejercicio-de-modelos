import mysql from 'mysql';

type Operadores = "=" | "!=" | "<=" | "<" | ">=" | ">" | "LIKE" ;
type CláusulaDonde = [string, Operadores , any ];

interface Select {
    campos: Array<string>,
    donde?: Array<CláusulaDonde>,
    límite?: number,
    desplazamiento?: number,
    ordenar?:  Array<[string ,'ASC'|'DESC']>
}

interface ModeloArgs {
    mesa: string,
    campos: Array<string>
}
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'edwuards',
    password: 'Edwuards!#@&',
    database: 'ejercicios'
});


async function ConsultaSQL (argumentos: [string,Array<any>?]):Promise<any>{

    return new Promise((resolve,reject)=>{
        pool.getConnection((error: mysql.MysqlError, conexión: mysql.PoolConnection) => {
            if (error) {
                throw error;
            }
           
    
            const [sql,valores] = argumentos;
            if(valores && valores.length){
                conexión.query(sql,valores,(error,resultado,campos)=>{
                    conexión.release();
                    if(error){ reject(error) }
                    resolve(resultado);
                });
            }
            else{
                conexión.query(sql,(error,resultado,campos)=>{
                    conexión.release();
                    if(error){ reject(error) }
                    resolve(resultado);
                });
            }
            
    
    
        })
    })
    
}



class Modelo {
     #mesa: string = '';
    constructor(mesa:string){
        this.#mesa = mesa;
    }

    #cláusulaDondeACadena(clásula: Array<CláusulaDonde>): [string,Array<any>]{
        return clásula.reduce((resultado:[string,Array<any>],arreglo,i)=>{
            let cadena:string = `${arreglo[0]} ${arreglo[1]} ? ${(i > 0 ? 'AND' : '')}`;
            resultado[0] = `${cadena} ${resultado[0]}`;
            resultado[1].push(arreglo[2])
            return resultado;
        },['',[]])
    }

    async select(args:Select):Promise<any>{
        type argsSql = {campos:string, donde?:[string,Array<any>] , desplazamiento?:string, límite?:string, ordenar?: string };
        const campos:string = args.campos.join(',');
        const donde: undefined | [string,Array<any>] = args.donde ? this.#cláusulaDondeACadena(args.donde) : undefined;
        const operación = async (args:argsSql):Promise<any>=>{ 
            let consulta:string = `SELECT ${args.campos} FROM ${this.#mesa}`;
            if(args.donde){ consulta = consulta+` WHERE ${args.donde[0]}`; }
            if(args.desplazamiento){ consulta = consulta+` OFFSET ${args.desplazamiento}`; }
            if(args.ordenar){ consulta = consulta+` ORDER BY ${args.ordenar}`; }
            if(args.límite){ consulta = consulta+` LIMIT ${args.límite}`; }
            return ConsultaSQL(args.donde ? [consulta,args.donde[1]] : [consulta] )

        }

        return operación({campos,donde})
    }


}

export const Usuarios = new Modelo('usuarios')


