const { Router } = require("express");

const router = Router();
const ProductRouter = require("./v1/ProductRouter");
const CartRouter = require("./v1/CartRouter");

router.use("/v1/products/", ProductRouter);
router.use("/v1/carts/", CartRouter);

module.exports = router;
