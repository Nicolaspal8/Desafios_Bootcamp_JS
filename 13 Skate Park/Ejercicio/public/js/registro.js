let $imagenPrevisualizacion = document.querySelector("#imagenPrevisualizacion");
let formRegister = document.querySelector("#registerForm");

formRegister.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = new FormData(event.currentTarget);
  console.log(payload);
  const { data } = await axios.post("/register", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(data);
  if (data.error) {
    let erroresDiv = document.querySelector("#errores");
    let { errores } = data;
    for (let e of errores) {
      erroresDiv.innerHTML += `
        <div class="alert alert-danger alert-dismissible fade show w-50 m-auto my-1" role="alert">
          <strong>${e}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `;
    }
  }else{
    localStorage.setItem("token", JSON.stringify(data.token))
    window.location.href = `http://localhost:3000/login`
  }
});


//Solo para visualizar la imagen antes de enviarla
const foto = document.querySelector("#foto");
foto.addEventListener("change", () => {
  // Los archivos seleccionados, pueden ser muchos o uno
  const archivos = foto.files;
  // Si no hay archivos salimos de la función y quitamos la imagen
  if (!archivos || !archivos.length) {
    $imagenPrevisualizacion.src = "";
    return;
  }
  // Ahora tomamos el primer archivo, el cual vamos a previsualizar
  const primerArchivo = archivos[0];
  console.log(archivos);
  // Lo convertimos a un objeto de tipo objectURL
  const objectURL = URL.createObjectURL(primerArchivo);
  console.log(objectURL);
  // Y a la fuente de la imagen le ponemos el objectURL
  $imagenPrevisualizacion.src = objectURL;
});
