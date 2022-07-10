const {Pool, Client} = require('pg');
require('dotenv').config({path:'./.env'})
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new Pool(config)

const getData = async ()=>{
    const query = "SELECT * FROM canciones";
    const result = await pool.query(query);
    return result;
}
const addCancion = async (cancion)=>{
    const query = "insert into canciones(titulo,artista,tono) values ($1,$2,$3) returning *"
    const result = await pool.query(query, [cancion.titulo, cancion.artista, cancion.tono]);
    return result;

}
const updateCancion = async (id, cancion)=>{
    try{
        const query = "update canciones set titulo = $1, artista = $2, tono = $3 where id = $4 returning *"
        const result = await pool.query(query,[cancion.titulo, cancion.artista, cancion.tono, id]);
        console.log(result)
        return result;
    }catch(e){
        const {code} = e;
        console.log(code);
        
    }
}
const deleteCancion = async (id)=>{
    try{
        const query = "delete from canciones where id = $1 returning *"
        const result = await pool.query(query,[id]);
        return result;
    }catch(e){
        const {code} = e;
        console.log(code);
        pool.end();
    }
}

module.exports = {getData, addCancion, updateCancion, deleteCancion};