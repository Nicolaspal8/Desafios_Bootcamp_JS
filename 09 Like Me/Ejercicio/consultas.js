const { url } = require('inspector');
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

const addPost = async (usuario, URL, descripcion)=>{
    try
    {
    const query = "INSERT INTO posts(usuario, url, descripcion, likes) VALUES ($1, $2, $3, 0) returning *";
    const result = await pool.query(query, [usuario, URL, descripcion])
    return result.rows;
    }
    catch(e)
    {
    const {code} = e;
    console.log(`Error al crear un nuevo POST Error : ${code}`)
    }
}
const getPosts = async () =>{
    try
    {
        const query = "SELECT * FROM posts;"
        const result = await pool.query(query)

        return result.rows;
    }
    catch(e)
    {
        const {code} = e;
        console.log(`Error al "Obtener POSTS" Error : ${code}`)
        
    }
}
const addLike = async (id) =>{
    try{
        const query = "UPDATE posts set likes = likes + 1 WHERE id = $1 returning *"
        const result = await pool.query(query, [id])

        return result.rows
    }
    catch(e){
        const {code} = e
        console.log(`Error al Agregar likes al Post con el id ${id}, Codigo de Error: ${code}`, e)
    }
}
module.exports = {
        addPost,
        getPosts, 
        addLike}