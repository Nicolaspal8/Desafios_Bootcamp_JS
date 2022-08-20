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

const addSkater = async (email, nombre, password, experiencia, especialidad, foto) =>{
    try{
        const query = "INSERT INTO skaters(email, nombre, password, anos_experiencia, especialidad, foto, estado) values($1, $2, $3,$4,$5,$6, false) RETURNING *"
        const result = await pool.query(query,[email, nombre, password, experiencia, especialidad, foto])
        const usuario = result.rows[0]
        return usuario;
    }catch(e){
        console.log("Error al crear un nuevo skater")
        console.log(e)
    }
}
const getSkaters = async () => {
    try{
        const query = "SELECT * FROM skaters"
        const result = await pool.query(query)
        return result.rows
    }catch(e){
        console.log("Algo salio mal en consulta get Skaters Error: " + e)
    }
}
const setSkaterStatus = async (id, estado) => {
    try{
        const query = "UPDATE skaters SET estadi=$1 where id=$2 RETURNING *"
        const result = await pool.query(query,[estado, id])
        return result.rows[0]
    }catch(e){
        console.log("Algo salio mal en consulta SET Status Error: " + e)
    }
}
const getSkater = async (email, password)=> {
    try {
        const query = "SELECT * FROM skaters WHERE email=$1 and password=$2 "
        const result = await pool.query(query,[email, password])
        return result.rows[0]
    } catch (e) {
        console.log("Error al obtener skater con email: " + email + " Error: " + e)
    }
}
const getSkaterBcrypt = async (email)=> {
    try {
        const query = "SELECT * FROM skaters WHERE email=$1"
        const result = await pool.query(query,[email])
        return result.rows[0]
    } catch (e) {
        console.log("Error al obtener skater con email: " + email + " Error: " + e)
    }
}
const editSkater = async (id,nombre, password, experiencia, especialidad) => {
    try{
        const query = "UPDATE skaters set nombre=$2, password=$3, anos_experiencia=$4, especialidad=$5  WHERE id = $1 RETURNING *"
        const result = await pool.query(query,[id,nombre, password, experiencia, especialidad])
        return result.rows[0]
    }catch(e){
        console.log("Algo salio mal en consulta edit Skater Error: " + e)
    }
}
const cambiarEstado = async(id, estado)=>{
    const query = "UPDATE skaters set estado=$1 WHERE id=$2"
    try{
        await pool.query(query,[estado, id])
    }catch(e){
        console.log("Error al cambiar el Estado Error: " + e)
    }
}
module.exports = {addSkater, getSkaters, setSkaterStatus, getSkater, getSkaterBcrypt, editSkater,cambiarEstado}