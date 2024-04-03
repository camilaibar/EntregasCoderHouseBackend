const { Router } = require("express");

const ProductManager = require("../../dao/mongoManagers/ProductManager");
const CartManager = require("../../dao/mongoManagers/CartManager");

class CartRouter {
  path = "/carts";
  cartRouter = Router();
  cartManager = new CartManager();
  productManager = new ProductManager();

  constructor() {
    this.initProductRouter();
  }

  initProductRouter = () => {
    this.cartRouter.get("/", async (req, res) => {
      let { limit } = req.query;

      // Validate limit format
      if (!Number(limit)) limit = 0;

      const carts = await this.cartManager.getAllCarts();
      return res
        .status(200)
        .json(limit > 0 ? carts.slice(0, limit) : carts || []);
    });

    this.cartRouter.get("/:cid", async (req, res) => {
      const { cid } = req.params;

      // Validate CID
      if (cid === "") return res.status(400).send();

      const cart = await this.cartManager.getCartById(cid);
      return res.status(200).json(cart || []);
    });

    this.cartRouter.post("/", async (req, res) => {
      const cart = await this.cartManager.addCart();
      return res.status(200).json(cart);
    });

    this.cartRouter.post("/:cid/product/:pid", async (req, res) => {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if (cid === "" || pid === "" || !Number(quantity) || quantity <= 0)
        return res.status(400).send();

      // See if product exist
      const product = await this.productManager.getProductById(pid);
      if (product === null) return res.status(400).send();

      // Add it to cart
      const result = await this.cartManager.addProductToCart(
        cid,
        pid,
        quantity
      );
      if (!result) return res.status(400).send();
      return res.status(200).json(result || []);
    });

    this.cartRouter.put("/:cid", async (req, res) => {
      const { cid } = req.params;
      const { productsList } = req.body;

      if (cid === "") return res.status(400).send();

      // Update cart
      const result = await this.cartManager.updateCartById({
        _id: cid,
        products: productsList,
      });
      if (!result) return res.status(400).send();
      return res.status(200).json(result || []);
    });

    this.cartRouter.put("/:cid/products/:pid", async (req, res) => {
      const { cid, pid } = req.params;
      const { productQuantity } = req.body;

      if (cid === "" || pid === "") return res.status(400).send();

      // Update cart
      const result = await this.cartManager.updateProductByIdFromCart(
        cid,
        pid,
        productQuantity
      );
      if (!result) return res.status(400).send();
      return res.status(200).json(result || []);
    });

    this.cartRouter.delete("/:cid/products/:pid", async (req, res) => {
      const { cid } = req.params;

      if (cid === "" || pid === "") return res.status(400).send();

      // Update cart
      const result = await this.cartManager.deleteProductByIdFromCart(cid, pid);
      if (!result) return res.status(400).send();
      return res.status(200).json(result || []);
    });

    this.cartRouter.delete("/:cid", async (req, res) => {
      const { cid } = req.params;

      if (cid === "") return res.status(400).send();

      // Update cart
      const result = await this.cartManager.deleteAllProductsFromCart(cid);
      if (!result) return res.status(400).send();
      return res.status(200).json(result || []);
    });
  };
}

module.exports = CartRouter;

// NOTE: PENDING ENDPOINTS
// updateCartById = (cart) => {};
// deleteAllCarts = () => {};
// deleteCartById = (cid) => {};

// getAllProductsFromCart = (cid) => {};
// getProductByIdFromCart = (cid, pid) => {};
// updateProductByIdFromCart = (cid, item) => {};
