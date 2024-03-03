const { Router } = require("express");

const ProductManager = require("../../classes/ProductManager");
const productManager = new ProductManager();
const productRouter = Router();

productRouter.get("/", (req, res) => {
  let { limit } = req.query;

  // Validate limit format
  if (!Number(limit)) limit = 0;

  const products = productManager.getAllProducts();
  return res
    .status(200)
    .json(limit > 0 ? products.slice(0, limit) : products || []);
});

productRouter.get("/:pid", (req, res) => {
  const { pid } = req.params;

  // Validate PID format
  if (!Number(pid)) return res.status(500).send("Invalid PID");

  // Respond to the user request
  const product = productManager.getProductById(pid);
  if (!product) return res.status(500).send("PID does not exists");
  return res.status(200).json(product);
});

productRouter.post("/", (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnail } =
    req.body;

  if (!title || !description || !code || !price || !stock || !category)
    return res.status(400).send(); // Product not created due to invalid data;

  if (!status) status = true; // Status true by default.
  if (!thumbnail) thumbnail = []; // Thumbnail is not mandatory, but it is array, empty by default

  const result = productManager.addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  });
  if (result) return res.status(200);
  if (result === undefined) return res.status(400).send();
  return res.status(500).send();
});

productRouter.put("/:pid", (req, res) => {
  let { pid } = req.params;
  if (!Number(pid)) return res.status(400).send(); // Product not created due to invalid data;

  // Delete all props that are not defined
  for (const key in req.body) {
    if (req.body[key] === undefined) {
      delete req.body[key];
    }
  }

  // Perform modification
  const result = productManager.updateProductById({
    pid,
    ...req.body,
  });
  if (result) return res.status(200).send();
  if (result === undefined) return res.status(400).send();
  return res.status(500).send();
});

productRouter.delete("/", (req, res) => {
  // Respond to the user request
  const product = productManager.deleteAllProducts();
  if (!product) return res.status(500).send();
  return res.status(200).send();
});

productRouter.delete("/:pid", (req, res) => {
  const { pid } = req.params;

  // Validate PID format
  if (!Number(pid)) return res.status(500).send("Invalid PID");

  // Respond to the user request
  const product = productManager.deleteProductById(pid);
  if (!product) return res.status(400).send("PID does not exists");
  return res.status(200).send();
});

module.exports = productRouter;
