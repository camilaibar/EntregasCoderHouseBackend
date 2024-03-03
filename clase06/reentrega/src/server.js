/* Entrega Clase 6 - Websockets

- Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.
- Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento
- Además, crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.
    - Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.
    - Ya que la conexión entre una consulta HTTP y websocket no está contemplada dentro de la clase. Se recomienda que, para la creación y eliminación de un producto, Se cree un formulario simple en la vista  realTimeProducts.handlebars. Para que el contenido se envíe desde websockets y no HTTP. Sin embargo, esta no es la mejor solución, leer el siguiente punto.
    - Si se desea hacer la conexión de socket emits con HTTP, deberás buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST. ¿Cómo utilizarás un emit dentro del POST ?
*/

const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const apisRouter = require("./routes/index");
const handlebarsViewsRouter = require("./routes/handlebarsViewsRouter");

// Initializaion
const PORT = 8080;
const app = express();

// Configuration middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration socket
const httpServer = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
const socketServer = new Server(httpServer);

// Configuration handlebars
app.use("/static", express.static(__dirname + "/public"));
app.engine(
  "hbs",
  handlebars.engine({ defaultLayout: "main", extname: ".hbs" })
);
app.set("views", __dirname + "/views/");
app.set("view engine", "hbs");

// Endpoints
app.use("/api", apisRouter);
app.use("/hbs", handlebarsViewsRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my backend - class 06");
});

// Socket events
socketServer.on("connection", (socket) => {
  console.log("New client connected with id: ", socket.id);

  socket.on("newProduct", () =>
    socket.emit("productListChange", {
      message: `Product list changed by user: ${socket.id}`,
    })
  );
});
