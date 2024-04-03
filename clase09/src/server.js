/* Entrega clase 09 - Mongo Avanzado (Parte I) & Mongo Avanzado (Parte II)

Segunda pre-entrega de tu Proyecto final

- Con base en nuestra implementación actual de productos, modificar el método GET / para que cumpla con los siguientes puntos:
  - Deberá poder recibir por query params un limit (opcional), una page (opcional), un sort (opcional) y un query (opcional)
    - limit permitirá devolver sólo el número de elementos solicitados al momento de la petición, en caso de no recibir limit, éste será de 10.
    - page permitirá devolver la página que queremos buscar, en caso de no recibir page, ésta será de 1
    - query, el tipo de elemento que quiero buscar (es decir, qué filtro aplicar), en caso de no recibir query, realizar la búsqueda general
    - sort: asc/desc, para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento
  - El método GET deberá devolver un objeto con el siguiente formato:
    {
    status:success/error
    payload: Resultado de los productos solicitados
    totalPages: Total de páginas
    prevPage: Página anterior
    nextPage: Página siguiente
    page: Página actual
    hasPrevPage: Indicador para saber si la página previa existe
    hasNextPage: Indicador para saber si la página siguiente existe.
    prevLink: Link directo a la página previa (null si hasPrevPage=false)
    nextLink: Link directo a la página siguiente (null si hasNextPage=false)
    }
  - Se deberá poder buscar productos por categoría o por disponibilidad, y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio.
  - Además, agregar al router de carts los siguientes endpoints:
    - DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
    - PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
    - PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
    - DELETE api/carts/:cid deberá eliminar todos los productos del carrito
    - Esta vez, para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.
  - Crear una vista en el router de views ‘/products’ para visualizar todos los productos con su respectiva paginación. Cada producto mostrado puede resolverse de dos formas:
    - Llevar a una nueva vista con el producto seleccionado con su descripción completa, detalles de precio, categoría, etc. Además de un botón para agregar al carrito.
    - Contar con el botón de “agregar al carrito” directamente, sin necesidad de abrir una página adicional con los detalles del producto.
  - Además, agregar una vista en ‘/carts/:cid (cartId) para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito.
*/

const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");

const dbConfig = require("./config/mongoDBConfig");
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

  socket.on("postedMessage", () =>
    socketServer.emit("newMessage", {
      message: `User: ${socket.id}, posted a new message`,
    })
  );
});