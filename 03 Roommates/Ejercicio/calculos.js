const {guardarUser, guardarGasto, getUsuarios} = require('./fileSystem.js')
let posoTotal = 0;
const calcular = (gasto, recalculo = false) => {
    let nombreRoommate = gasto.roommate
    let roommates = JSON.parse(getUsuarios()).roommates
    let montoPrincipal = Number((gasto.monto / roommates.length).toFixed(2))
  
    if(roommates.find((r) => r.nombre == nombreRoommate)){
        roommates.forEach(r => {
            if(r.nombre == nombreRoommate){
                r.recibe += gasto.monto - montoPrincipal
                posoTotal += gasto.monto - montoPrincipal
            }else{
                r.debe += montoPrincipal
            }
        });
        posoTotal += montoPrincipal
        guardarUser(roommates, true)
    }else{
    }
}
const recalcular = (gasto, recalculo = false) => {
    let nombreRoommate = gasto.roommate
    let roommates = JSON.parse(getUsuarios()).roommates
    let montoPrincipal = Number((gasto.monto / roommates.length).toFixed(2))
  
    if(roommates.find((r) => r.nombre == nombreRoommate)){
        roommates.forEach(r => {
            if(r.nombre == nombreRoommate){
                r.recibe = Number((r.recibe - (gasto.monto - montoPrincipal)).toFixed(2))
                posoTotal -= gasto.monto - montoPrincipal
            }else{
                r.debe = Number((r.debe - montoPrincipal).toFixed(2))
            }
        });
        posoTotal -= montoPrincipal
        guardarUser(roommates, true)
    }else{
        console.log("No existe el usuario al que se desea asignar el gasto")
    }
}
module.exports = {calcular, recalcular}