const { Router } = require("express");
const router = Router();

let productList = [];

router.get("/", (req, res) => {
  res.status(200).send(productList);
});

router.get("/:id", (req, res) => {
  let { id } = req.params;
  let result = productList.filter((e) => e.id == id);
  result
    ? res.status(200).send(result)
    : res.status(400).send("Product with ID '" + id + "' not found");
});

router.post("/", (req, res) => {
  try {
    let { product } = req.body;
    let newProductID = product.id;
    productList.push(req.body.product);
    res.status(200).json({ id: newProductID, newProductList: productList });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/:id", (req, res) => {
  let { id } = req.params;
  let { product } = req.body;
  let found = false;
  productList = productList.map((e) => {
    if (e.id == id) {
      found = true;
      e = product;
    }
    return e;
  });
  found
    ? res.status(200).json({
        result: "Product with ID '" + id + "' updated",
        newProductList: productList,
      })
    : res.status(400).json({
        result: "Product with ID '" + id + "' not found",
        newProductList: productList,
      });
});

router.delete("/:id", (req, res) => {
  let { id } = req.params;
  let result = productList.filter((e) => e.id != id);
  if (result.length < productList.length) {
    productList = result;
    res.status(200).json({
      result: "Product with ID '" + id + "' deleted",
      newProductList: productList,
    });
  } else {
    res.status(400).json({
      result: "Product with ID '" + id + "' not found",
      newProductList: productList,
    });
  }
});

module.exports = router;
