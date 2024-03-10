const { Router } = require("express");

const CartManager = require("../../../dao/mongoManagers/CartManager");
const cartManager = new CartManager();
const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  let { limit } = req.query;

  // Validate limit format
  if (!Number(limit)) limit = 0;

  const carts = await cartManager.getAllCarts();
  return res.status(200).json(limit > 0 ? carts.slice(0, limit) : carts || []);
});

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  // Validate CID format
  if (cid === "") return res.status(400).send();

  const cart = await cartManager.getCartById(cid);
  return res.status(200).json(cart || []);
});

cartRouter.post("/", async (req, res) => {
  const cart = await cartManager.addCart();
  return res.status(200).json(cart);
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (cid === "" || pid === "" || !Number(quantity) || quantity <= 0)
    return res.status(400).send();

  const result = await cartManager.addProductToCart(cid, pid, quantity);
  if (!result) return res.status(400).send();
  return res.status(200).json(result || []);
});

module.exports = cartRouter;

// TODO: PENDING ENDPOINTS
// updateCartById = (cart) => {};
// deleteAllCarts = () => {};
// deleteCartById = (cid) => {};

// getAllProductsFromCart = (cid) => {};
// getProductByIdFromCart = (cid, pid) => {};
// updateProductByIdFromCart = (cid, item) => {};
// deleteAllProductsFromCart = (cid) => {};
// deleteProductByIdFromCart = (cid, pid) => {};
