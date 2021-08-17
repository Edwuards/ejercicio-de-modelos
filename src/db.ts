import mysql from 'mysql';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'edwuards',
    password: 'Edwuards!#@&',
    database: 'ejercicios'
});

type UserCallBack = (error: mysql.MysqlError | null, resultado: any) => void;
type ArgumentosConsulta = [string,Array<any>,UserCallBack];
const respuestaMysql = (conexión: mysql.PoolConnection, callback: UserCallBack): mysql.queryCallback => {
    return (error, resultado, campos) => {
        if (error) { throw error; }
        callback(error, resultado)
        conexión.release();
    }
}

export const consulta = (argumentos: ArgumentosConsulta) => {

    pool.getConnection((error: mysql.MysqlError, conexión: mysql.PoolConnection) => {
        if (error) {
            throw error;
        }
        const [sql,valores,cb] = argumentos;
        let aplicar: Array<any> = [];
        if(valores.length){
            conexión.query(sql,valores,respuestaMysql(conexión,cb));
        }
        else{
            conexión.query(sql,respuestaMysql(conexión,cb));
        }
        


    })
}


