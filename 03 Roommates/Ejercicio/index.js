const express = require("express");
const app = express();
const { send } = require("./correo.js");
const {
  getUsuarios,
  getGastos,
  guardarGasto,
  buscarGasto,
  borrarGasto,
  getEmails,
} = require("./fileSystem.js");
const { roommateRandom } = require("./usuario.js");
const { calcular , recalcular} = require("./calculos.js");
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/views/index.html");
});

app.get("/roommates", (req, res) => {
  res.send(getUsuarios());
});

app.post("/roommate", async (req, res) => {
  try {
    const user = await roommateRandom();
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
app.get("/gastos", (req, res) => {
  res.send(getGastos());
});
app.post("/gasto", async (req, res) => {
  try {
    let data = req.body;
    guardarGasto(data);
    calcular(data);
    const mensajeEmail = `
               <h1> Nuevo Gasto Agregado </h1>
               <p> Monto: ${data.monto}\n
                   Rommate: ${data.roommate}\n
                   Descripcion: ${data.descripcion}\n
               </p>
               `;
    //  send(getEmails(), mensajeEmail);
    res.status(200).send("Ok");
  } catch (e) {
    res.status(400).send("Error: " + e);
  }
});

app.put("/gasto", async (req, res) => {
  const id = req.query.id;
  let gasto = req.body;
  gasto.id = id;
  let gastoAntiguo = buscarGasto(id)
  try {
    recalcular(gastoAntiguo, true);
    calcular(gasto);
    guardarGasto(gasto, "PUT");
    const mensajeEmail = `
          <h1> Gasto Actualizado </h1>
          <p> ID: ${id}
              Monto: ${gasto.monto}\n
              Rommate: ${gasto.roommate}\n
              Descripcion: ${gasto.descripcion}\n
          </p>
          `;
    res.status(200).send("Todo bem");
  } catch (e) {
    res.status(400).send("Error: " + e);
  }
});
app.delete("/gasto", (req, res) => {
  const idGasto = req.query.id;
  try {
    const gasto = buscarGasto(idGasto);
    const mensajeEmail = `
          <h1> Gasto borrado </h1>
          <p> ID: ${gasto.id}
              Monto: ${gasto.monto}\n
              Rommate: ${gasto.roommate}\n
              Descripcion: ${gasto.descripcion}\n
          </p>
          `;
    borrarGasto(idGasto);
    recalcular(gasto, true);
    // send(getEmails(), mensajeEmail);
    res.status(200).send("Borrado");
  } catch (e) {
    res.status(400).send("Error: " + e);
  }
});

app.listen(port, () => console.log("App inciada en puerto: " + port));
