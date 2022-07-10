const express = require('express');
const app = express();
const PORT = 3000;
const {getData, addCancion, updateCancion, deleteCancion} = require('./consultas.js');

/* 
1. Crear una ruta POST /cancion que reciba los datos correspondientes a una canción y
realice a través de una función asíncrona la inserción en la tabla canciones.
2. Crear una ruta GET /canciones que devuelva un JSON con los registros de la tabla
canciones.
3. Crear una ruta PUT /cancion que reciba los datos de una canción que se desea
editar, ejecuta una función asíncrona para hacer la consulta SQL correspondiente y
actualice ese registro de la tabla canciones.
4. Crear una ruta DELETE /cancion que reciba por queryString el id de una canción y
realiza una consulta SQL a través de una función asíncrona para eliminarla de la base
de datos.
*/


app.use(express.json());

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html")
})

app.get("/canciones", async (req, res)=>{
    const result = await getData();
    res.send(result.rows);
})
app.post("/cancion", async (req, res)=>{
    const cancion = req.body
    const result = await addCancion(cancion);
    res.send(result.rows);
})
app.put("/cancion/:id", async (req, res)=>{
    console.log("----------------------PUT----------------------")
    const id = Number(req.params.id);
    const cancion = req.body;
    const result = await updateCancion(id,cancion);
    console.log(id,cancion,result)
    console.log("----------------------FIN---PUT----------------------")
    res.send();

})
app.delete("/cancion", async (req, res)=>{
    const id = req.query.id;
    console.log("--------------ID Delete----------", id)
    const result = await deleteCancion(id);
    console.log("----Delete----", result.rows)
    res.send();
})





app.listen(PORT, () => console.log("Aplicacion iniciada en puerto " + PORT))
