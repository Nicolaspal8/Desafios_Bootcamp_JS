const express = require('express');
const app = express();
const PORT = 3000;
const {getPosts, addPost, addLike} = require('./consultas.js')

app.use(express.json());

app.listen(PORT, () => console.log("App iniciada en puerto: " + PORT));

app.get("/",(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

/* 1. Disponibilizar una ruta POST /post que utilice una función asíncrona para emitir una
consulta SQL parametrizada y almacenar un nuevo post en la tabla posts. */


app.post("/post", async (req, res) =>{
    try{
        const {usuario, URL, descripcion} = req.body;
        const result = await addPost(usuario, URL, descripcion);
        res.send()
    }catch(e){
        console.log(`Error en ruta POST usuario Error: ${e}`)
        res.status(500).send();
    } 

})


/* 2. Disponibilizar una ruta PUT /post que utilice una función asíncrona para emitir una
consulta SQL y sume un like a un post identificado por su id. Considera que este dato
es enviado como query strings. */
app.put("/post", async (req, res) =>{
    try{
        const id = req.query.id;
        console.log("IDDIDIDIDID === " + id);
        const result = await addLike(id);
        res.send(result)
    }catch(e){
        console.log(`Error en ruta PUT POST Error: ${e}`)
        res.status(500).send();
    }
})
/* 3. Disponibilizar una ruta GET /posts que utilice una función asíncrona para emitir una
consulta SQL y devuelva todos los posts de la tabla posts.
 */
app.get("/posts", async (req, res) =>{
    try{
        const result = await getPosts();
        res.send(result)
    }catch(e){
        console.log(`Error en ruta GET POSTS Error: ${e}`)
        res.status(500).send();
    }
})