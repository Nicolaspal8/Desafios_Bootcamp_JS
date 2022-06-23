//Imports
const express = require('express')
const app = express()
const { v4: uuidv4 } = require('uuid')
const PORT = 3000
const Jimp = require('jimp')
const fs = require('fs')
const chalk = require('chalk')

//Static Files
app.use(express.static('public'))
app.use('/css',express.static(__dirname + '/public/css'))


//EndPoints
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})
app.use(express.static('/assets'))

app.get("/imagen", async (req, res) => {
  
    res.setHeader("Content-Type", "image/jpg")
    const url = req.query.url
    try{
        const img = await Jimp.read(url)
        let nombre = uuidv4().slice(0,6)
        await img.greyscale().resize(350, Jimp.AUTO).quality(60).writeAsync(`public/img/${nombre}.jpg`)
        const imgFinal = fs.readFileSync(`public/img/${nombre}.jpg`)
        res.sendFile(`${__dirname}/public/img/${nombre}.jpg`)
    }catch(e){
        console.error(e)
        res.send("Error en consulta de imagen")
    }
})

//Port listening
app.listen(PORT, () => console.log("Aplicacion inciciada en puerto 3000"))
