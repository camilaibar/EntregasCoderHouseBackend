const { Router } = require("express");

const ProductManager = require("../../../dao/mongoManagers/ProductManager");
const productManager = new ProductManager();
const productRouter = Router();

productRouter.get("/", async (req, res) => {
  let { limit } = req.query;

  // Validate limit format
  if (!Number(limit)) limit = 0;

  const products = await productManager.getAllProducts();
  return res
    .status(200)
    .json(limit > 0 ? products.slice(0, limit) : products || []);
});

productRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  // Validate PID format
  if (pid === "") return res.status(400).send();

  // Respond to the user request
  const product = await productManager.getProductById(pid);
  if (!product) return res.status(400).send();
  return res.status(200).json(product);
});

productRouter.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnail } =
    req.body;

  if (!title || !description || !code || !price || !stock || !category)
    return res.status(400).send(); // Product not created due to invalid data;

  if (!status) status = true; // Status true by default.
  if (!thumbnail) thumbnail = []; // Thumbnail is not mandatory, but it is array, empty by default

  const result = await productManager.addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  });
  if (result === null) return res.status(500).send();
  return res.status(200).send();
});

productRouter.put("/:pid", async (req, res) => {
  let { pid } = req.params;
  if (pid === "") return res.status(400).send(); // Product not created due to invalid data;

  // Delete all props that are not defined
  for (const key in req.body) {
    if (req.body[key] === undefined) {
      delete req.body[key];
    }
  }

  // Perform modification
  const result = await productManager.updateProductById({
    pid,
    ...req.body,
  });
  if (result) return res.status(200).send();
  if (result === undefined) return res.status(400).send();
  return res.status(500).send();
});

productRouter.delete("/", async (req, res) => {
  // Respond to the user request
  const product = await productManager.deleteAllProducts();
  if (!product) return res.status(500).send();
  return res.status(200).send();
});

productRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  // Validate PID format
  if (pid === "") return res.status(400).send();

  // Respond to the user request
  const product = await productManager.deleteProductById(pid);
  if (!product) return res.status(400).send();
  return res.status(200).send();
});

module.exports = productRouter;
