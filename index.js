// Clase 03 - Administradores de Paquetes - NPM
const port = process.env.port || "8082";

// Method HTTP
/*const http = require("http");
const app = http.createServer((req, res) => {
    res.end("Server created");
});

app.listen(port, () => {
    console.log("listening port:", port);
});*/

// Method Express
const fs = require("fs");
const express = require("express");
const app = express();

app.listen(port, (req, res) => {
  console.log("listening port:", port);
});

app.get("/", (req, res) => {
  res.send("Welcome to my backend");
});

app.get("/products", (req, res) => {
  let products;
  try {
    const file = fs.readFile("./products.json", "utf-8", (error, content) => {
      if (error) {
        console.error(error);
      }
      let data = JSON.parse(content);
      if (data?.length === 0) {
        products = [];
      }
      //Profe, lo imprimo de esta manera porque si intento lo que tengo en linea 53 me dice que send esta discontinuado y me da 500. Lo podriamos revisar?
      data.forEach((element) => {
        console.log(
          "Product:",
          element.id,
          "Name:",
          element.name,
          "Category:",
          element.category
        );
      });
    });
  } catch (error) {
    console.error(error);
  }
  //res.send("Product list:", products.length > 0 ? products : "No products yet");
  res.send("Check console for result");
});

app.get("/randomProduct", (req, res) => {
  let products;
  try {
    const file = fs.readFile("./products.json", "utf-8", (error, content) => {
      if (error) {
        console.error(error);
      }
      let data = JSON.parse(content);
      if (data?.length === 0) {
        products = [];
      }
      let id = Math.ceil(Math.random() * data.length);
      data.forEach((element) => {
        if (element.id === id) {
          console.log(
            "Product:",
            element.id,
            "Name:",
            element.name,
            "Category:",
            element.category
          );
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
  res.send("Check console for result");
});
