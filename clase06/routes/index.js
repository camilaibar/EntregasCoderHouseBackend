const { Router } = require("express");

const router = Router();
const ProductRouter = require("./v1/ProductRouter");

router.use("/v1/products/", ProductRouter);

module.exports = router;
