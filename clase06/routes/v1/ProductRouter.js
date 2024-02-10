const { Router } = require("express");
const ProductManager = require("../../classes/ProductManager");
const Product = require("../../classes/Product");

// Initialization
const productRouter = Router();
const manager = new ProductManager();

/* 
- La siguiente función debe leer el archivo de productos y devolverlos dentro de un objeto.
- También agrega soporte para recibir el valor "?limit=" a través de los parámetros de consulta (query param).
  - Si no se recibe un query param de límite, se devolverán todos los productos.
  - Si se recibe un límite, se devolverá solo el número de productos solicitados.
*/
productRouter.get("/", (req, res) => {
  let result = [];
  const limit = req.query.limit || 0;
  result = manager.getProducts();
  if (result) {
    if (limit > 0) {
      return res.status(200).send({ data: result.slice(0, limit) });
    }
    return res.status(200).send({ data: result });
  }

  return res.status(500).send();
});

/*
- La siguiente función debe recibir el parámetro "pid" (product ID) a través de "req.params".
- Luego, devolver el producto solicitado en lugar de todos los productos.
*/
productRouter.get("/:pid", (req, res) => {
  let result = [];
  const pid = req.params.pid || null;
  result = manager.getProductById(Number(pid));
  if (result) {
    return res.status(200).send(result);
  }
  return res.status(500).send("The was a problem with the request");
});

/*
  Esta función se encarga de manejar la creación de un nuevo producto a través de la ruta raíz POST /.
  Los campos requeridos para agregar un producto son:
  - id: Número/String (Generado automáticamente para evitar repeticiones)
  - title: Cadena de texto
  - description: Cadena de texto
  - code: Cadena de texto
  - price: Número
  - stock: Número
  - category: Cadena de texto
  - thumbnails: Array de rutas de imágenes (opcional)
  - status: Booleano (true por defecto)

  Para añadir un producto, se debe enviar un objeto en el cuerpo (body) de la solicitud con los campos mencionados.
  
  Esta función maneja la creación del producto y asegura que el ID sea único y que los demás campos obligatorios se proporcionen adecuadamente.
*/
productRouter.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status = true,
  } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send("Invalid body definition");
  }

  const product = new Product(
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
    thumbnails,
    status
  );
  const result = manager.addProduct(product);
  if (result) {
    return res.status(200).send("Product created");
  }

  return res.status(500).send("Product not created, try again later");
});

/*
-  La siguiente función gestiona la actualización de un producto a través de la ruta PUT /:pid. 
  - Se espera que los campos a actualizar sean proporcionados en el cuerpo de la solicitud (body).
  - El ID del producto (pid) debe permanecer inalterado y no puede ser actualizado ni eliminado.

  La función verifica que el producto con el ID proporcionado exista y luego actualiza los campos indicados en el cuerpo de la solicitud.

  En caso de que el ID no corresponda a ningún producto existente o si faltan campos requeridos en el cuerpo de la solicitud, se responderá con el código HTTP 404 (Not Found) o 400 (Bad Request) respectivamente, junto con un mensaje de error correspondiente.
*/
productRouter.put("/:pid", (req, res) => {
  const { pid } = req.params.pid || null;
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status,
  } = req.body;
  if (!pid) {
    return res.status(400).send("Invalid params definition");
  }

  const product = manager.getProductById(Number(pid));
  if (!product) {
    return res.status(404).send("No product for that ID");
  }

  // Update fields
  product.title = title || product.title;
  product.description = description || product.description;
  product.code = code || product.code;
  product.price = Number(price) || product.price;
  product.stock = Number(stock) || product.stock;
  product.category = category || product.category;
  product.thumbnails = [...thumbnails] || product.thumbnails;
  product.status = status === true || product.status;
  const result = manager.updateProduct(product);
  if (result) {
    return res.status(200).send("Product updated");
  }

  return res.status(500).send("Product not updated, try again later");
});

/*
- La siguiente función gestiona la eliminación de un producto a través de la ruta DELETE /:pid.
- Se espera que el ID del producto a eliminar (pid) sea proporcionado en la URL.
*/
productRouter.delete("/:pid", (req, res) => {
  const { pid } = req.params.pid || null;
  if (!pid) {
    return res.status(400).send("Invalid params definition");
  }

  const product = manager.getProductById(Number(pid));
  if (!product) {
    return res.status(404).send("No product for that ID");
  }

  const result = manager.deleteProductById(product.pid);
  if (result) {
    return res.status(200).send("Product deleted");
  }

  return res.status(500).send("Product not deleted, try again later");
});

module.exports = productRouter;
