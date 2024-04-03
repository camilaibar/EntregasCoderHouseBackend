const { Router } = require("express");

const ProductManager = require("../../dao/mongoManagers/ProductManager");

class ProductRouter {
  path = "/products";
  productRouter = Router();
  productManager = new ProductManager();

  constructor() {
    this.initProductRouter();
  }

  initProductRouter = () => {
    this.productRouter.get("/", async (req, res) => {
      let { limit, page, sort, query } = req.query;

      // Validate limit format
      if (!Number(limit)) limit = 10;
      if (!Number(page)) page = 1;
      if (!sort) sort = undefined;
      if (!query) query = undefined; // TODO: Not working, http://localhost:8080/api/v1/products?query=code:00001 sends nothing

      const products = await this.productManager.getAllProducts(
        limit,
        page,
        sort,
        query
      );
      if (!products)
        return res.status(500).send({
          status: "error",
          payload: [],
        });
      return res.status(200).json({
        status: "success",
        payload: products.docs || [],
        totalPages: products.totalDocs,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: null,
        nextLink: null,
      });
    });

    this.productRouter.get("/:pid", async (req, res) => {
      const { pid } = req.params;

      // Validate PID format
      if (pid === "")
        return res.status(400).send({
          status: "error",
          payload: [],
        });

      // Respond to the user request
      const product = await this.productManager.getProductById(pid);
      if (!product)
        return res.status(400).send({
          status: "error",
          payload: [],
        });
      return res.status(200).json(product);
    });

    this.productRouter.post("/", async (req, res) => {
      let {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      } = req.body;

      if (!title || !description || !code || !price || !stock || !category)
        return res.status(400).send(); // Product not created due to invalid data;

      if (!status) status = true; // Status true by default.
      if (!thumbnail) thumbnail = []; // Thumbnail is not mandatory, but it is array, empty by default

      const result = await this.productManager.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });
      if (result === null) return res.status(500).send();
      return res.status(200).send();
    });

    this.productRouter.put("/:pid", async (req, res) => {
      let { pid } = req.params;
      if (pid === "") return res.status(400).send(); // Product not created due to invalid data;

      // Delete all props that are not defined
      for (const key in req.body) {
        if (req.body[key] === undefined) {
          delete req.body[key];
        }
      }

      // Perform modification
      const result = await this.productManager.updateProductById({
        pid,
        ...req.body,
      });
      if (result) return res.status(200).send();
      if (result === undefined) return res.status(400).send();
      return res.status(500).send();
    });

    this.productRouter.delete("/", async (req, res) => {
      // Respond to the user request
      const product = await this.productManager.deleteAllProducts();
      if (!product) return res.status(500).send();
      return res.status(200).send();
    });

    this.productRouter.delete("/:pid", async (req, res) => {
      const { pid } = req.params;

      // Validate PID format
      if (pid === "") return res.status(400).send();

      // Respond to the user request
      const product = await this.productManager.deleteProductById(pid);
      if (!product) return res.status(400).send();
      return res.status(200).send();
    });
  };
}

module.exports = ProductRouter;

/* TODO
- Se necesita un endpoint aparte? O es con el query del get "/" ?
- Se deberá poder buscar productos por categoría o por disponibilidad, y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio.
*/
