// Clase 05 - Motores de Plantillas
const port = process.env.port || "8000";
const express = require("express");
const app = express();
const claseO4Routes = require("./routes/clase04Apis.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", claseO4Routes);
app.use(express.static(__dirname + "/public"));

app.listen(port, (req, res) => {
  console.log("listening port:", port);
});
