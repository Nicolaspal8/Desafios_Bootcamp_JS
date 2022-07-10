const {Pool, Client} = require('pg')
const prompt = require('prompt')
require('dotenv').config({path:'./.env'})

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new Pool(config)

/* 
1. Crear una función asíncrona que registre una nueva transferencia utilizando una
transacción SQL. Debe mostrar por consola la última transferencia registrada.
2. Realizar una función asíncrona que consulte la tabla de transferencias y retorne los
últimos 10 registros de una cuenta en específico.
3. Realizar una función asíncrona que consulte el saldo de una cuenta en específico.
4. En caso de haber un error en una transacción SQL, se debe retornar el error por
consola */
const addTransferencia = async (id1, id2, monto, descripcion) =>{
    try {
      
        await pool.query("BEGIN")
        let transferencia = "INSERT INTO transferencias(descripcion, fecha, monto, cuenta_origen, cuenta_destino) VALUES($1,now(),$2,$3,$4) returning *";
        let result = await pool.query(transferencia, [descripcion, monto, id1, id2]);
        let transaccion = `UPDATE cuentas set saldo = saldo + $1 WHERE id = $2`
        await pool.query(transaccion, [monto * -1, id1])
        await pool.query(transaccion, [monto, id2])
        await pool.query("COMMIT")
        await pool.end()
        console.log(result.rows);
       
    } catch (e) {
        const {code} = e;
        console.log(code);
        await pool.query("ROLLBACK");
        console.log("Error código: " + e.code);
        console.log("Detalle del error: " + e.detail);
        console.log("Tabla originaria del error: " + e.table);
        console.log("Restricción violada en el campo: " + e.constraint);
    }
}

const consultarRegistros = async (id)=>{
    let query = "SELECT * FROM transferencias WHERE cuenta_origen = $1 or cuenta_destino = $1 ORDER BY fecha DESC LIMIT 10";
    try
    {
        let result = await pool.query(query, [id]);
        console.log(result.rows);
        pool.end()
    }catch (e) {
        const {code} = e;
        console.log(code);
        pool.end()
        console.log("Error código: " + e.code);
        console.log("Detalle del error: " + e.detail);
        console.log("Tabla originaria del error: " + e.table);
        console.log("Restricción violada en el campo: " + e.constraint);
    }
}

const getSaldo = async (id)=>{
    let query = "SELECT * FROM cuentas WHERE id = $1";
    try
    {
        let result = await pool.query(query, [id]);
        console.log(result.rows);
        pool.end()
    }catch (e) {
        pool.end()
        const {code} = e;
        console.log(code);
        console.log("Error código: " + e.code);
        console.log("Detalle del error: " + e.detail);
        console.log("Tabla originaria del error: " + e.table);
        console.log("Restricción violada en el campo: " + e.constraint);
    }
}

addTransferencia(1,2,500,"Juuuy");
consultarRegistros(1);
getSaldo(1);
