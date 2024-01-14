/* Entrega Clase 04 -  Servidores web & Express avanzado

Servidor con express

Consigna
- Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.
Aspectos a incluir
- Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos. 
- Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.
- El servidor debe contar con los siguientes endpoints:
    - ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
        - Si no se recibe query de límite, se devolverán todos los productos
        - Si se recibe un límite, sólo devolver el número de productos solicitados
    - ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos. 
*/
const express = require("express");
const ProductManager = require("./ProductManager");
const Product = require("./Product");

const productManager = new ProductManager("./products.txt");

// Create items from scratch
/*productManager.addProduct(
  new Product("Producto 001", "Description Producto 001", 10, "", "00001", 100)
);
productManager.addProduct(
  new Product("Producto 002", "Description Producto 002", 10, "", "00002", 100)
);
productManager.addProduct(
  new Product("Producto 003", "Description Producto 003", 10, "", "00003", 100)
);

// Tests
console.log("This are my products:", JSON.stringify(productManager.getProducts()));
console.log("Get first product:", JSON.stringify(productManager.getProductById(1)));
console.log("Get second product:", JSON.stringify(productManager.getProductById(2)));
console.log("Get third product:", JSON.stringify(productManager.getProductById(3)));

// Delete file
//productManager.deleteProducts();*/

// Create my server
const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my backend");
});

/* 
- La siguiente función debe leer el archivo de productos y devolverlos dentro de un objeto.
- También agrega soporte para recibir el valor "?limit=" a través de los parámetros de consulta (query param).
  - Si no se recibe un query param de límite, se devolverán todos los productos.
  - Si se recibe un límite, se devolverá solo el número de productos solicitados.
*/
app.get("/products", (req, res) => {
  let result = [];
  const limit = req.query.limit || 0;
  result = productManager.getProducts();
  if (result) {
    if (limit > 0) {
      res.status(200).send(result.slice(0, limit));
      return;
    }
    res.status(200).send(result);
    return;
  }

  res.status(500).send("The was a problem with the request");
  throw Error("The was a problem with the request");
});

/*
- La siguiente función debe recibir el parámetro "pid" (product ID) a través de "req.params".
- Luego, devolver el producto solicitado en lugar de todos los productos.
*/
app.get("/products/:pid", (req, res) => {
  let result = [];
  const pid = req.params.pid || null;
  result = productManager.getProductById(Number(pid));
  if (result) {
    res.status(200).send(result);
    return;
  }

  res.status(500).send("The was a problem with the request");
  throw Error("The was a problem with the request");
});

app.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
