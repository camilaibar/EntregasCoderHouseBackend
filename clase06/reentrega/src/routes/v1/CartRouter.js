const { Router } = require("express");

const CartManager = require("../../classes/CartManager");
const cartManager = new CartManager();
const cartRouter = Router();

cartRouter.get("/", (req, res) => {
  let { limit } = req.query;

  // Validate limit format
  if (!Number(limit)) limit = 0;

  const carts = cartManager.getAllCarts();
  return res.status(200).json(limit > 0 ? carts.slice(0, limit) : carts || []);
});

cartRouter.get("/:cid", (req, res) => {
  const { cid } = req.params;

  // Validate CID format
  if (!Number(cid)) return res.status(400).send("Invalid PID");

  const cart = cartManager.getCartById(cid);
  return res.status(200).json(cart || []);
});

cartRouter.post("/", (req, res) => {
  const cart = cartManager.addCart();
  return res.status(200).json(cart);
});

cartRouter.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  // Validate CID format
  if (!Number(cid) || !Number(pid))
    return res.status(400).send("Invalid param");

  if (!Number(quantity) || quantity <= 0)
    return res.status(400).send("Invalid quantity");

  const result = cartManager.addProductToCart(cid, pid, quantity);
  if (!result) return res.status(400).send();
  return res.status(200).json(result || []);
});

module.exports = cartRouter;

// NOTE: PENDING ENDPOINTS
// updateCartById = (cart) => {};
// deleteAllCarts = () => {};
// deleteCartById = (cid) => {};

// getAllProductsFromCart = (cid) => {};
// getProductByIdFromCart = (cid, pid) => {};
// updateProductByIdFromCart = (cid, item) => {};
// deleteAllProductsFromCart = (cid) => {};
// deleteProductByIdFromCart = (cid, pid) => {};
