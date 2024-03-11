const { Router } = require("express");
const router = Router();

const productRouter = require("./v1/ProductRouter");
const cartRouter = require("./v1/CartRouter");
const messageRouter = require("./v1/MessagesRouter");

router.use("/products", productRouter);
router.use("/carts", cartRouter);
router.use("/messages", messageRouter);

module.exports = router;
