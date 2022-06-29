const fs = require('fs')
const {v4: uuidv4} = require('uuid')

const guardarUser = (user, guarda = false) => {
    let {roommates} = JSON.parse(fs.readFileSync('./roommates.json', 'utf8'))
    if(guarda){
        roommates = user
    }else{
        roommates.push(user)
    }
    fs.writeFileSync('roommates.json', JSON.stringify({roommates}))
}
const getUsuarios = () => {
    const data = fs.readFileSync('./roommates.json', 'utf8')
    return data
}
const getGastos = () => {
    const data = fs.readFileSync('./gastos.json', 'utf8')
    return data
}
const buscarGasto = (id) => {
    const {gastos} = JSON.parse(getGastos())
    const gasto = gastos.find((g) => g.id == id)
    return gasto
}
const borrarGasto = (id) => {
    const {gastos} = JSON.parse(getGastos())
    const gasto = buscarGasto(id)
    gastos.splice(gastos.indexOf(gasto), 1)
    fs.writeFileSync('./gastos.json', JSON.stringify({gastos}))
}
const guardarGasto = (gasto, method) => {
    const {gastos} = JSON.parse(fs.readFileSync('./gastos.json', 'utf8'))
    if(method == "PUT"){
        gastos.forEach(g => {
            if(g.id == gasto.id){
                g.monto =  gasto.monto
                g.roommate = gasto.roommate
                g.descripcion = gasto.descripcion

            }
        });
    }else{
        gasto.id = uuidv4().slice(0,6)
        gastos.push(gasto)
    }
    fs.writeFileSync('gastos.json', JSON.stringify({gastos}))
}
const getEmails = () => {
    const {roommates} = JSON.parse(getUsuarios())
    const emails = roommates.map((r) => r.email)
    return emails;
}

module.exports = {
    guardarUser, 
    getUsuarios, 
    getGastos, 
    guardarGasto, 
    buscarGasto, 
    borrarGasto, 
    getEmails};