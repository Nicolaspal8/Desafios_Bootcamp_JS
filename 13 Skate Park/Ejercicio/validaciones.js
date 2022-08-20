const { response } = require("express");
const jwt = require("jsonwebtoken");
const key = "lskjdf";
const {getSkaterBcrypt} = require('./consultas')
const bcrypt = require('bcryptjs')

require('dotenv').config({path:'./.env'})


const verifyLogin = async(email, password) => {
 
  const skater = await getSkaterBcrypt(email)
  console.log(skater)
  if(skater && bcrypt.compareSync(password, skater.password)){
    console.log("Entrooooooooooooo")
    return skater
  }else{
    throw "Datos incorrectos"
  }
};

const verifyRegister = async (inputs, files)=>{
  try{
    const {password, confirmpassword} = inputs
    const response = {error: false,errores: []}
    console.log(inputs)
    for (const key in inputs) {
      if(inputs[key] == ''){
        response.errores.push(`El campo ${key} no puede estar vacio`)
        response.error = true
      }
    }
    if(files == null){
      response.error = true
      response.errores.push("Debe seleccionar una imagen")
    }
    if(password != confirmpassword){
      response.error = true
      response.errores.push("Contraseñas deben coincidir")
    }
    console.log(`Saliendo de verificacion response = ${response.error}`)
    return response
  }catch(e){
    console.log(`Error al Verificar Usuario Error: ${e}`)
    return response
  }
}

const verifyToken = (req, res, next) => {
  let { token } = req.query;
  console.log(token);
  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).render("Login", {errorAcceso: "Acceso no autorizado"});
    }
    req.body.data = decoded.data
    next();
  });
};

module.exports = {verifyToken, verifyLogin, verifyRegister}