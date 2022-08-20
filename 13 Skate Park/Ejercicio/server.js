const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken")
const { engine } = require("express-handlebars");
const bcrypt = require('bcryptjs')
const {addSkater, getSkaters, setSkaterStatus, getSkater, editSkater, cambiarEstado} = require('./consultas');
const { verifyLogin, verifyRegister, verifyToken } = require("./validaciones");

const PORT = 3000;
require('dotenv').config({path:'./.env'})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(__dirname + "/public"));
app.use("/jquery",express.static(__dirname + "/node_modules/jquery/dist"))
//Bootstrap
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/bootstrapJs",express.static(__dirname + "/node_modules/bootstrap/dist/js"));

//Habdlebars
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  engine({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/components",
  })
);
app.use(
    expressFileUpload({
      limits: { fileSize: 5000000 },
      abortOnLimit: true,
      responseOnLimit:
        "sobrepasó el límite especificado para la carga de la imagen 5MB",
    })
  );
  
app.get("/", async (req, res)=> {
    try{
        const skaters = await getSkaters()
        res.render("Index", {skaters, archivo: "registro_login.js"})
        
    }catch(e){
        console.log("Error en ruta principal Error: " + e)
        res.status(401).send({
            error: e,
            code: 401
        })
    }
})
app.post("/register",  async (req, res)=> {
    console.log(req.body)
    console.log(req.files)
    try{
        const { email, nombre, password, experiencia, especialidad } = req.body;
        const verifyResponse = await verifyRegister(req.body, req.files);
        if(!verifyResponse.error){
            const {foto}  = req.files;
            const { name }  = foto
            console.log("Nombreeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",name)

            const salt = await bcrypt.genSalt(10);
            let passwordCrypt = await bcrypt.hash(password, salt);

            const result = await addSkater(email, nombre, passwordCrypt, experiencia, especialidad, name)
            if(result){
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 9000,
                    data: result,
                },
                process.env.TOKEN_SECRET)
                foto.mv(`${__dirname}/public/img/${name}`, (err) => {
                    if(err){
                        console.log(err)
                        throw err
                    }
                  })
                
                console.log(passwordCrypt)
                return res.status(200).send({token})
                
            }
        }
        else{
            res.send({error: true, errores: verifyResponse.errores})
        }
    }catch(e){
        console.log("Error en ruta Registro POST Error: " + e)
        res.send({error: true, errores: ["Algo salio mal intenta de nuevo"]})
    }
})
app.get("/register", async (req, res)=> {
    try{
        res.render("Registro", {archivo: "registro.js"})
        
    }catch(e){
        console.log("Error en ruta Registro GET Error: " + e)
        res.status(401).send({
            error: e,
            code: 401
        })
    }
})
app.get("/login", async (req, res)=> {
    try{
        res.render("Login",{archivo: "login.js"})
    }catch(e){
        console.log("Error en ruta Login GET Error: " + e)
        res.status(401).send({
            error: e,
            code: 401
        })
    }
})
app.post("/login", async (req, res)=> {
    try{
        const { email, password } = req.body;
        console.log(req.body)
        const response = await verifyLogin(email, password)
        if(response){
            res.status(200).send({data: response})
        }else{
            res.status(401).send({error: response.error})
        }
        
    }catch(e){
        console.log("Error en ruta Login POST Error: " + e)
        res.send({error: e})
    }
})

app.get("/editar", verifyToken, (req, res)=> {
    console.log(req.body.data)
    const skater = req.body.data
    res.render("Datos",{skater})
})
app.post("/editar", verifyToken, async (req, res)=> {
    const {id, nombre, password, confirmPassword, experiencia, especialidad , data} = req.body;
    const email = data.email
    if(password != confirmPassword){
        res.render("Datos",{skater: {nombre,id, email, anos_experiencia, especialidad}, error: "Passwords deben coincidir"})
    }
    const salt = await bcrypt.genSalt(10);
    let passwordCrypt = await bcrypt.hash(password, salt);
    const result = await editSkater(id,nombre, passwordCrypt, experiencia, especialidad)
    res.redirect("/")
})

app.get("/admin", async (req, res)=> {
    try{
        const skaters = await getSkaters()
        res.render("Admin",{skaters, archivo: "admin.js", admin: true})
    }catch(e){
        console.log("Error en ruta Admin GET Error: " + e)
        res.status(401).send({
            error: e,
            code: 401
        })
    }
})
app.post("/admin", async (req, res)=> {
    try{
        console.log("llego a la ruta ")

        const {bool, id} = req.body
        console.log(bool, id)
        await cambiarEstado(id, bool)
    }catch(e){
        console.log("Error en ruta Admin POST Error: " + e)
        res.status(401).send({
            error: e,
            code: 401
        })
    }
})

app.listen(PORT, () => console.log("App iniciada en puerto: " + PORT));
