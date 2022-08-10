const express = require("express");
const app = express();
const { engine } = require("express-handlebars");

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/jquery",express.static(__dirname + "/node_modules/jquery/dist"))
//Bootstrap
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/bootstrapJs",express.static(__dirname + "/node_modules/bootstrap/dist/js"));


app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  engine({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/componentes",
  })
);

const PORT = 3000;

app.get("/", (req, res) =>{
    
    res.render("dashboard",{frutas: ["banana","cebollas","lechuga","papas","pimenton","tomate"]})
})


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
