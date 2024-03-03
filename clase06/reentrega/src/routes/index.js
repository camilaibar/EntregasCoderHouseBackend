const { Router } = require("express");
const router = Router();

const productRouter = require("./v1/ProductRouter");
const cartRouter = require("./v1/CartRouter");

router.use("/products", productRouter);
router.use("/carts", cartRouter);

module.exports = router;
