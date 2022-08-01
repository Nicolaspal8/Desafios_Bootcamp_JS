const {Pool, Client} = require('pg');
require('dotenv').config({path:'./.env'})


const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new Pool(config);

const addUser = async (nombre, balance)=>{
    try
    {
    const query = "INSERT INTO usuarios(nombre, balance) VALUES ($1, $2) returning *";
    const result = await pool.query(query, [nombre, balance])
    return result.rows;
    }
    catch(e)
    {
    const {code} = e;
    console.log(`Error al crear un nuevo Usuario Error : ${code}`)
    }
}
const getUsers = async () =>{
    try
    {
        const query = "SELECT * FROM usuarios;"
        const result = await pool.query(query)

        return result.rows;
    }
    catch(e)
    {
        const {code} = e;
        console.log(`Error al "Obtener Usuarios" Error : ${code}`)
        
    }
}
const deleteUser = async (id) =>{
    try{
        const query = "DELETE FROM usuarios WHERE id = $1 returning *"
        const result = await pool.query(query, [id])

        return result.rows
    }
    catch(e){
        const {code} = e
        console.log(`Error al elimninar Usuario con el id ${id}, Codigo de Error: ${code}`, e)
    }
}
const editUser = async (id, name, balance) =>{
    try{
        const query = "UPDATE usuarios SET nombre = $2, balance = $3 WHERE id = $1 returning *"
        const result = await pool.query(query, [id, name, balance])

        return result.rows
    }
    catch(e){
        const {code} = e
        console.log(`Error al editar Usuario con id ${id} Codigo de Error: ${e}`);
    }
}
const addTransferencia = async (emisor, receptor, monto) =>{
    const queryTransferencia = "INSERT INTO transferencias(emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW())"
    const queryUsuario = "UPDATE usuarios SET balance = balance + $2 WHERE id = $1"
    console.log("Datos de transferencia", emisor, receptor, monto)
    try{
        await pool.query("BEGIN");
        await pool.query(queryTransferencia, [emisor, receptor, monto]);
        await pool.query(queryUsuario, [emisor, monto * -1]);
        await pool.query(queryUsuario, [receptor, monto]);
        await pool.query("COMMIT")


    }catch(e){
        const {code} = e;
        console.log(`Error al insertar transferencia, Error: ${code}`)
        await pool.query("ROLLBACK");
        console.log("Error código: " + e.code);
        console.log("Detalle del error: " + e);
    }
}
const getTransferencias = async ()=>{
    const query = `
    SELECT 
    e.nombre as emisor, 
    r.nombre as receptor, 
    t.fecha, t.monto 
    FROM transferencias t 
    JOIN usuarios e ON t.emisor = e.id 
    JOIN usuarios r ON t.receptor = r.id 
    ORDER BY t.id`;
    try{
        const result = await pool.query(query);
        console.log(result.rows)
        const response = result.rows.map(obj => [obj.fecha, obj.emisor, obj.receptor, obj.monto])
        return response;
    }catch(e){
        console.log(`Error al obtener datos de la tabal historial Error: ${e}`)
    }
}
module.exports = {
    addUser,
    getUsers, 
    deleteUser, 
    editUser,
    getTransferencias,
    addTransferencia};