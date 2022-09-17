// Clase 04 - Express Avanzado
const port = process.env.port || "8082";
let productList = [];

// Method Express
const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (req, res) => {
  console.log("listening port:", port);
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my backend");
});

app.get("/api/productos", (req, res) => {
  res.status(200).send(productList);
});

app.get("/api/productos/:id", (req, res) => {
  let { id } = req.params;
  let result = productList.filter((e) => e.id == id);
  result
    ? res.status(200).send(result)
    : res.status(400).send("Product with ID '" + id + "' not found");
});

app.post("/api/productos", (req, res) => {
  try {
    let { product } = req.body;
    let newProductID = product.id;
    productList.push(req.body.product);
    res.status(200).json({ id: newProductID, newProductList: productList });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.put("/api/productos/:id", (req, res) => {
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

app.delete("/api/productos/:id", (req, res) => {
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
