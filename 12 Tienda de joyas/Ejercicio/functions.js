
const HATEOAS = (elementos, endPointName)=>{
    console.log("HATEOS------------", elementos)
    return elementos.map((e) =>{
        return {
            name: e.name,
            url: `localhost:3000/${endPointName}/${e.id}`
        }
    })
}
const HATEOASV2 = (elementos, endPointName)=>{
    return elementos.map(e =>{
        return {
            nombre: e.name,
            link: `localhost:3000/${endPointName}/${e.id}`
        }
    })
}


const filterFields = (joya, parameters)=>{
    for(e in joya){
        if(!parameters.includes(e)) delete joya[e]
    }
    return joya
}

module.exports = {HATEOAS, HATEOASV2, filterFields}