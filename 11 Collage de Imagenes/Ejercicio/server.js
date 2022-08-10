const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const fs = require("fs").promises;
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit:
      "sobrepasó el límite especificado para la carga de la imagen 5MB",
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/formulario.html");
});
app.get("/collage", (req, res) => {
  res.sendFile(__dirname + "/views/collage.html");

});
app.post("/imagen", (req, res) => {
  if(req.files != null){
    const { target_file } = req.files;
    const { posicion } = req.body;
    target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (err) => {
      if(err || target_file == null){
          console.log(err)
          res.redirect("/")
      }
      res.redirect("/collage");

    });    
  }else{
    res.redirect("/")
  }
  });
  app.get("/deleteImg/:nombre", async (req, res) => {
    const { nombre } = req.params;
    try{
      await fs.unlink(`${__dirname}/public/imgs/${nombre}`);
      res.redirect("/collage");
    }catch(e){
      console.log(`No se pudo eliminar la imagen: ${nombre} Error: ${e}`)
      res.redirect("/")
    }
  });
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
