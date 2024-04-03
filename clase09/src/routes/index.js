const { Router } = require("express");

const ProductRouter = require("./v1/ProductRouter");
const CartRouter = require("./v1/CartRouter");
const MessageRouter = require("./v1/MessagesRouter");

const productRouter = new ProductRouter();
const cartRouter = new CartRouter();
const messageRouter = new MessageRouter();

class BaseRouter {
  path = "/alive";
  router = Router();

  constructor() {
    this.initBaseRoutes();
  }

  initBaseRoutes = () => {
    this.router.get(`${this.path}`, (req, res) => {
      return res.status(200).json({ ok: true, message: "APP UP AND RUNNING" });
    });

    this.router.use(productRouter.path, productRouter.productRouter);
    this.router.use(cartRouter.path, cartRouter.cartRouter);
    this.router.use(messageRouter.path, messageRouter.messageRouter);
  };
}

module.exports = BaseRouter;
