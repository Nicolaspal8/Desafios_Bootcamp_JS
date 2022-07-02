const {Pool, Client} = require('pg')
const prompt = require('prompt')
require('dotenv').config({path:'./.env'})

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new Pool(config)
// prompt.start()

const registrar = async ({Nombre, RutActual, Curso}) =>{
  console.log("----------DATOS--------------", Nombre, RutActual, Curso)
    try{
      const query = {
        text: `insert into usuarios(nombre, rut, curso) values ($1, $2, $3);`,
        values: [Nombre, RutActual, Curso]
      }
      const result = await pool.query(query)
      console.log(result)
      pool.end()
      return result
    }catch(error){
      const {code} = error
      console.log(code)
    }
}

const buscar = async ({Rut}) =>{
  try{
    console.log("-----Buscar-----", Rut)
    const query = {
      text: `SELECT * FROM usuarios WHERE rut = $1;`,
      values: [Rut]
    }
    const result = await pool.query(query)
    if(result.rows.length > 0){
      console.log(result.rows)
      pool.end()
      return result.rows
    }else{console.log("Usuario no encontrado")}
    pool.end()
  }catch(error){
    const {code} = error
    console.log(code)
  }
}

const getAll = async () =>{
  try{
    const query = {
      text: `SELECT * FROM usuarios;`,
    }
    const result = await pool.query(query)
    console.log(result.rows)
    pool.end()
    return result.rows
  }catch(error){
    const {code} = error
    console.log(code)
  } 
}

const update = async ({RutActual, Nombre, NuevoRut, Curso}) =>{
  try{
    const query = {
      text: `UPDATE usuarios SET nombre = $1, rut = $2, curso = $3 WHERE rut = $4;`,
      values: [Nombre, NuevoRut, Curso, RutActual]
    }
    const result = await pool.query(query)
    console.log(result)
    pool.end()
    if(result.rowCount == 0){
      console.log("Usuario no encontrado")
    }
    return result
  }catch(error){
    const {code} = error
    console.log(code)
  } 
}

const deleteUser = async ({Rut}) =>{
  try{
    const query = {
      text: `DELETE FROM usuarios WHERE rut = $1;`,
      values: [Rut]}
    const result = await pool.query(query)
    console.log(result)
    pool.end()
    if(result.rowCount == 0){
      console.log("Usuario no encontrado")
    }
    return result
  }catch(error){
    const {code} = error
    console.log(code)
  } 
}
const deleteAll = () =>{
  try{
    pool.query({text:"DELETE FROM usuarios;"})
    pool.end()
  }catch(error){
    const {code} = error
    console.log(code)
  }
}

const solicitarDatos = async (mensaje) =>{
  console.log(mensaje)
  prompt.start()
  if(mensaje == "2" || mensaje == "5"){
    const {Rut} = await prompt.get([
    {
      name: 'Rut',
      required: true
    }])
    return {Rut}
  }
  const {Nombre,RutActual,Curso} = await prompt.get([{
    name: 'Nombre',
    required: true
  }, 
  {
    name: 'RutActual',
    required: true
  },{
    name: 'Curso',
    required: true
  }])
  if(mensaje == "4"){
    const {NuevoRut} = await prompt.get(['NuevoRut'])
    return {RutActual ,Nombre, NuevoRut, Curso}
  }
  return {Nombre, RutActual, Curso};
}

const consulta = (async (mensaje)=>{
  console.log(`
  Seleccion el numero de la operacion que desea realizar
  1) Registrar estudiante
  2) Obtener estudiante por Rut
  3) Obtener todos los estudiantes
  4) Actualizar estudiante
  5) Eliminar estudiante
  6) Borrar datos de tabla
  `)
  if(mensaje)console.log(mensaje)
  prompt.start()
  const {Operacion} = await prompt.get(['Operacion'])
  console.log(Operacion)
  switch (Operacion){
    case "1":
      registrar(await solicitarDatos())
      break;
    case "2":
      buscar(await solicitarDatos(Operacion))  
      break;
    case "3":
      getAll()
      break;
    case "4":
      update(await solicitarDatos(Operacion))
      break;
    case "5":
      deleteUser(await solicitarDatos(Operacion))
      break;
    case "6":
      deleteAll()
      break;
    default:
      consulta("Ingrese Operación valida");
    }  

});
consulta()