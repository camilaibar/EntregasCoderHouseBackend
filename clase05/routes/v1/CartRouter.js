const express = require("express");
const CarttManager = require("../../classes/CartManager");
const ProductManager = require("../../classes/ProductManager");

const cartRouter = express.Router();
const productManager = new ProductManager();
const manager = new CarttManager();

/* 
La siguiente funcion obtiene todos los carritos existentes
*/
cartRouter.get("/", (req, res) => {
  let result = [];
  result = manager.getCarts();
  if (result) {
    return res.status(200).send(result);
  }

  return res.status(500).send("The was a problem with the request");
});

/*
La siguiente funcion obtiene un carrito especifico y lista los productos que pertenezcan al carrito con el parámetro cid proporcionados.
*/
cartRouter.get("/:cid", (req, res) => {
  let result = [];
  const cid = req.params.cid || null;
  result = manager.getProductsFromCart(Number(cid));
  if (result) {
    return res.status(200).send(result || []);
  }
  return res.status(500).send("The was a problem with the request");
});

/*
La siguiente funcion crea un nuevo carrito con la siguiente estructura:
  - cid:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
  - products: Array que contendrá ids que representen cada producto
*/
cartRouter.post("/", (req, res) => {
  const result = manager.addCart();
  if (result) {
    return res.status(200).send(`Cart created with ID: ${result.cid}`);
  }
  return res.status(500).send("Cart not created, please try again later");
});

/* 
Agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
  - product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
  - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
*/
cartRouter.post("/:cid/product/:pid", (req, res) => {
  const cid = req.params.cid || null;
  const pid = req.params.pid || null;
  const { quantity = 1 } = req.body;

  const product = productManager.getProductById(Number(pid));
  if (!product) {
    return res.status(400).send("Invalid pid");
  }

  const result = manager.addProductToCart(pid, quantity, Number(cid));
  if (result) {
    return res.status(200).send("Product added to cart");
  }

  return res.status(500).send("Product not added to cart, try again later");
});

module.exports = cartRouter;
