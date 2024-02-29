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

const PORT = 8080;
const productManager = new ProductManager();
const app = express();

// Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints
app.get("/", (req, res) => {
  res.status(200).send("Welcome to my backend");
});

app.get("/products", (req, res) => {
  let { limit } = req.query;

  // Validate limit format
  if (!Number(limit)) limit = 0;

  const products = productManager.getAllProducts();
  return res
    .status(200)
    .json(limit > 0 ? products.slice(0, limit) : products || []);
});

app.get("/products/:pid", (req, res) => {
  const { pid } = req.params;

  // Validate PID format
  if (!Number(pid)) return res.status(400).send("Invalid PID");

  // Respond to the user request
  const product = productManager.getProductById(pid);
  if (product == "Not found")
    return res.status(400).send("PID does not exists");
  return res.status(200).json(product);
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
