let card = document.querySelectorAll(".card-body")
let btnCarrito = document.querySelector("#carrito")
localStorage.setItem("carrito",JSON.stringify([]))
$(card).on( "click" ,function(e){
    let id = this.id
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    if(carrito.some(i => i == id)){
        $(this).removeClass("opacity-50");
        carrito.splice(carrito.indexOf(this),1)
    }else{
        carrito.push(id)
        $(this).addClass("opacity-50");
    }
    console.log("click en ", this.id)
    localStorage.setItem("carrito",JSON.stringify(carrito))
})
btnCarrito.addEventListener("click", function(e){
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    $(".modal-body").html("");
    carrito.forEach(element => {
        document.querySelector(".modal-body").innerHTML +=`
       <img src="/assets/img/${element}.png" width="50px" class="card-img-bot" alt="${element}">
       `
    });
})

