const express = require('express');
const app = express();
const PORT = 3000;
const { addUser,
    getUsers, 
    deleteUser, 
    editUser,
    getTransferencias,
    addTransferencia} = require("./consultas.js")

app.use(express.json());

app.listen(PORT, () => console.log("App iniciada en puerto: " + PORT));

app.get("/",(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

/* Las rutas que deberás crear son las siguientes:
● / GET: Devuelve la aplicación cliente disponible en el apoyo de la prueba.
● /usuario POST: Recibe los datos de un nuevo usuario y los almacena en PostgreSQL.
● /usuarios GET: Devuelve todos los usuarios registrados con sus balances.
● /usuario PUT: Recibe los datos modificados de un usuario registrado y los actualiza.
● /usuario DELETE: Recibe el id de un usuario registrado y lo elimina .
● /transferencia POST: Recibe los datos para realizar una nueva transferencia. Se debe
ocupar una transacción SQL en la consulta a la base de datos.
● /transferencias GET: Devuelve todas las transferencias almacenadas en la base de
datos en formato de arreglo. */




app.post("/usuario", async (req, res) =>{
    try{
        const {nombre, balance} = req.body;
        const result = await addUser(nombre, balance);
        res.send()
    }catch(e){
        console.log(`Error en ruta POST usuario Error: ${e}`)
        res.status(500).send();
    } 

})
app.get("/usuarios", async (req, res) =>{
    try{
        const result = await getUsers();
        res.send(result)
    }catch(e){
        console.log(`Error en ruta GET usuarios Error: ${e}`)
        res.status(500).send();
    }
})
app.put("/usuario", async (req, res) =>{
    try{
        const id = req.query.id;
        console.log("IDDIDIDIDID === " + id);
        const {name, balance} = req.body
        const result = await editUser(id, name, balance);
        res.send(result)
    }catch(e){
        console.log(`Error en ruta PUT usuario Error: ${e}`)
        res.status(500).send();
    }
})
app.delete("/usuario", async (req, res) =>{
    try{
        const id = req.query.id;
        const result = await deleteUser(id);
        res.send(result)
    }catch(e){
        console.log(`Error en ruta Delete usuario Error: ${e}`)
        res.status(500).send();
    }
})
app.post("/transferencia", async (req, res) =>{
    try{
        const {emisor, receptor, monto} = req.body;
        const result = await addTransferencia(emisor, receptor, monto);
        res.status(200).send(result);

    }catch(e){
        console.log(`Error en Ruta Error: ${e}`);
        res.status(500).send();
    }
})
app.get("/transferencias", async (req, res) =>{
    try{
        const result = await getTransferencias();
        res.send(result)
    }catch(e){
        console.log(`Error en ruta GET Transferencias Error: ${e}`)
    }
})
