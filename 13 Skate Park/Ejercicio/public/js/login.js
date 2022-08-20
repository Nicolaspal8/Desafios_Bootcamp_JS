let formLogin = document.querySelector("#loginForm");
let erroresDiv = document.querySelector("#erroresLogin");

formLogin.addEventListener("submit", async (evento) => {
    alert("fomrefegre")
    evento.preventDefault();
    const payload = new FormData(evento.currentTarget);
    console.log(payload);
    let token = JSON.parse(localStorage.getItem("token"))
    console.log(`Este es el token ${token}`)
    const {data}   = await axios.post("/login", payload);
    console.log(data);
   
  
    if (data.error) {
        erroresDiv.innerHTML += `
          <div class="alert alert-danger alert-dismissible fade show w-50 m-auto my-1" role="alert">
            <strong>${data.error}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          `;
    }
    else if(token == null){
        console.log("tokeenn null")
        erroresDiv.innerHTML += `
        <div class="alert alert-danger alert-dismissible fade show w-50 m-auto my-1" role="alert">
          <strong>Token null</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `;
    }else{
        window.location.href = `http://localhost:3000/editar?token=${token}`
    }

  });