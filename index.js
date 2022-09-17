// Clase 04 - Express Avanzado
const port = process.env.port || "8082";

// Method Express
const express = require("express");
const claseO4Routes = require("./routes/clase04Apis.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", claseO4Routes);

app.listen(port, (req, res) => {
  console.log("listening port:", port);
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my backend");
});
