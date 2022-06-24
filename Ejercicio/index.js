const express = require('express')
const app = express()
const PORT = 3000
const fs = require('fs')


app.use(express.static('public'))

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/public/views/index.html")
})
app.get("/crear", (req, res) => {
    const {nombreClub, precioClub} = req.query
    const club = {
        nombre: nombreClub,
        precio: precioClub
    }
    const {clubs} = JSON.parse(fs.readFileSync("Clubs.json", "utf8"));
    clubs.push(club)
    fs.writeFileSync("Clubs.json", JSON.stringify({clubs}))
    res.send("Club Alamacenado con exito")


})

app.get("/deportes", (req, res) => {
    const json = JSON.parse(fs.readFileSync("Clubs.json"))
    res.send(json)
})

app.get("/editarPrecio", (req, res) =>{
    const {nombreClub, precioClub} = req.query
    const {clubs} = JSON.parse(fs.readFileSync("Clubs.json", "utf8"));
    let busqueda = clubs.find(club => club.nombre == nombreClub);
    if(busqueda){
        busqueda.precio = precioClub
        fs.writeFileSync("Clubs.json", JSON.stringify({clubs}))
        res.send("Club editado")
    }else{
        res.send("Club no encontrado")
    }
    
})

app.get("/eliminarClub", (req, res) =>{
    const {nombreClub} = req.query
    const {clubs} = JSON.parse(fs.readFileSync("Clubs.json", "utf8"));
    let busqueda = clubs.find(club => club.nombre == nombreClub);
    if(busqueda){
        clubs.splice(clubs.indexOf(busqueda),1)
        fs.writeFileSync("Clubs.json", JSON.stringify({clubs}))
        res.send("Club Eliminado")
    }else{
        res.send("Club no encontrado")
    }
})


app.listen(PORT, () => console.log("Aplicacion iniciada en puerto " + PORT))

