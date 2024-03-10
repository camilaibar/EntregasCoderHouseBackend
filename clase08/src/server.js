/* Entrega Clase 8 - Mongoose & Primera práctica integradora

Práctica de integración sobre tu ecommerce

- Agregar el modelo de persistencia de Mongo y mongoose a tu proyecto.
- Crear una base de datos llamada “ecommerce” dentro de tu Atlas, crear sus colecciones “carts”, “messages”, “products” y sus respectivos schemas.
- Separar los Managers de fileSystem de los managers de MongoDb en una sola carpeta “dao”. Dentro de dao, agregar también una carpeta “models” donde vivirán los esquemas de MongoDB. La estructura deberá ser igual a la vista en esta clase
- Contener todos los Managers (FileSystem y DB) en una carpeta llamada “Dao”
- Reajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de FileSystem
- NO ELIMINAR FileSystem de tu proyecto.
- Implementar una vista nueva en handlebars llamada chat.handlebars, la cual permita implementar un chat como el visto en clase. Los mensajes deberán guardarse en una colección “messages” en mongo (no es necesario implementarlo en FileSystem). El formato es:  {user:correoDelUsuario, message: mensaje del usuario}
- Corroborar la integridad del proyecto para que todo funcione como lo ha hecho hasta ahora.

*/

const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");

const dbConfig = require("./config/dbConfig");
const apisRouter = require("./routes/index");
const handlebarsViewsRouter = require("./routes/handlebarsViewsRouter");

// Initializaion
const PORT = 8080;
const app = express();

// BD
dbConfig.connectDB();

// Configuration middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration socket
const httpServer = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
const socketServer = new Server(httpServer);

// Configuration handlebars
app.use(express.static(__dirname + "/public"));
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
