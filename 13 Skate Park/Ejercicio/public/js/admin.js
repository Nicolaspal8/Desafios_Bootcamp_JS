let check = document.querySelectorAll(".check")

// check.forEach(e =>{
//     e.addEventListener('click',(e)=>{
//         let bool = check.checked
//         console.log(e)
//         console.log(e.value)
//         console.log(`Estado de bool ${bool}`)
//     })
// })
async function cambiarEstado(id,input){
    let bool = input.checked
    await axios.post("http://localhost:3000/admin", {bool, id})
    window.location.href = "http://localhost:3000/admin"
}