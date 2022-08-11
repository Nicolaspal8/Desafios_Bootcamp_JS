const express = require("express");
const { results } = require("./data/joyas.js");
const joyas = results;
const { HATEOAS, HATEOASV2, filterFields } = require("./functions.js");
const app = express();
app.listen(3000, () => console.log("Your app listening on port 3000"));

/* 
1. Crear una ruta para la devolución de todas las joyas aplicando HATEOAS. (2 puntos)
2. Hacer una segunda versión de la API que ofrezca los mismos datos pero con los
nombres de las propiedades diferentes. (1 punto)
3. La API REST debe poder ofrecer una ruta con la que se puedan filtrar las joyas por
categoría. (1.5 puntos)
4. Crear una ruta que permita el filtrado por campos de una joya a consultar. (2 puntos)
5. Crear una ruta que devuelva como payload un JSON con un mensaje de error cuando
el usuario consulte el id de una joya que no exista. (0.5 puntos)
6. Permitir hacer paginación de las joyas usando Query Strings. (1.5 punto)
7. Permitir hacer ordenamiento de las joyas según su valor de forma ascendente o
descendente usando Query Strings. (1.5 punto)
*/
const orderValues = (order) => {
  if (order == "asc") {
    return joyas.sort((a, b) => (a.value > b.value ? 1 : -1));
  } else if (order == "desc") {
    return joyas.sort((a, b) => (a.value < b.value ? 1 : -1));
  } else {
    return null;
  }
};
app.get("/joyas", (req, res) => {
  const result = HATEOAS(joyas, "joya");
  const { values } = req.query;
  if (values == "asc") return res.send(orderValues("asc"));
  if (values == "desc") return res.send(orderValues("desc"));
  // Paso 1
  if (req.query.page) {
    // Paso 2
    const { page } = req.query;
    // Paso 3
    return res.send({ joyas: result.slice(page * 2 - 2, page * 2) });
  }
  res.send(result);
});
app.get("/v2/joyas", (req, res) => {
  const result = HATEOASV2(joyas, "joya");
  res.send(result);
});

app.get("/joya/:id", (req, res) => {
  const id = req.params.id;
  const parameters = req.query;
  const joya = joyas.find((e) => e.id == id);
  console.log(joya, id)
  console.log(parameters)
  if (Object.keys(parameters).length != 0) {
    console.log("entro")
    joya ? res.send(filterFields(joya, parameters.split(","))) :  res.status(404).send({
      error: "404 Not Found",
      message: "No existe una joya con ese ID: " + id,
    });
  } else if (joya != null) {
    res.send(joya);
  } else {
    res.status(404).send({
      error: "404 Not Found",
      message: "No existe una joya con ese ID: " + id,
    });
  }
});
app.get("/joyas/:category", (req, res) => {
  const category = req.params.category;
  const results = joyas.filter((e) => (e.category == category));
  console.log(results);
  res.send(results);
});
