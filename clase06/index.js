/* Entrega Clase 6 - Websockets

- Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.
- Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento
- Además, crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.
    - Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.
    - Ya que la conexión entre una consulta HTTP y websocket no está contemplada dentro de la clase. Se recomienda que, para la creación y eliminación de un producto, Se cree un formulario simple en la vista  realTimeProducts.handlebars. Para que el contenido se envíe desde websockets y no HTTP. Sin embargo, esta no es la mejor solución, leer el siguiente punto.
    - Si se desea hacer la conexión de socket emits con HTTP, deberás buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST. ¿Cómo utilizarás un emit dentro del POST ?
*/

const express = require("express");
const handlebars = require("express-handlebars");
const routes = require("./routes");
const ProductManager = require("./classes/ProductManager");
const { Server } = require("socket.io");

// Initializaion
const PORT = 8080;
const app = express();
const manager = new ProductManager();

// Config middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/public"));
app.use((error, req, res, next) => {
  console.log(error.stack);
  res.status(500).send();
});
app.use("/api", routes);

// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views/");
app.set("view engine", "handlebars");

// Server
const httpServer = app.listen(PORT, (error) => {
  if (error) return console.error(error);
  console.log(`Server running on port ${PORT}`);
});

// Sockets
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  console.log(`New user connected with ID: ${socket.id}`);

  // Events
  socket.emit("welcome", { message: `Welcome ${socket.id} to my socket` });
  socket.broadcast.emit("welcomeNewConnection", {
    message: `Say welcome to ${socket.id} to our socket`,
  });

  // Listeners
  socket.on("newProduct", (data) => {
    socketServer.emit("productListChange", {
      message: `${socket.id} changed products`,
    });
  });
});

// APIs
app.get("/", (req, res) => {
  res.status(200).send("Welcome to my backend!");
});

app.get("/home", (req, res) => {
  const products = manager.getProducts();
  const viewData = {
    title: "Title",
    hasRows: products.length > 0,
    tableHeader: [
      "Product ID",
      "Title",
      "Description",
      "Code",
      "Category",
      "Price",
      "Thumbnail",
      "Stock",
      "Status",
    ],
    tableRows: products,
  };
  res.render("home", viewData);
});

app.get("/realtimeproducts", (req, res) => {
  const products = manager.getProducts();
  const viewData = {
    title: "Title",
    styleSheetRoute: "realTimeProducts.css",
    hasRows: products.length > 0,
    tableHeader: [
      "Product ID",
      "Title",
      "Description",
      "Code",
      "Category",
      "Price",
      "Thumbnail",
      "Stock",
      "Status",
    ],
    tableRows: products,
  };
  res.render("realTimeProducts", viewData);
});
