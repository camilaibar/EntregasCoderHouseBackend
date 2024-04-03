const { Router } = require("express");

class HandlebarsViewsRouter {
  path = "/alive";
  router = Router();

  constructor() {
    this.initBaseRoutes();
  }

  initBaseRoutes = () => {
    this.router.get("/home", (req, res) => {
      const viewData = {
        title: "Title",
        tableHeader: [
          "Product ID",
          "Title",
          "Description",
          "Code",
          "Category",
          "Price",
          "Thumbnail",
          "Stock",
          "Status",
        ],
      };
      res.render("home", { ...viewData });
    });

    this.router.get("/realtimeProducts", (req, res) => {
      const viewData = {
        title: "Title",
        tableHeader: [
          "Product ID",
          "Title",
          "Description",
          "Code",
          "Price",
          "Status",
          "Stock",
          "Category",
          "Thumbnail",
        ],
      };
      res.render("realTimeProducts", { ...viewData });
    });

    this.router.get("/chat", (req, res) => {
      res.render("chat");
    });
  };
}

module.exports = HandlebarsViewsRouter;

/* TODO
- Crear una vista en el router de views ‘/products’ para visualizar todos los productos con su respectiva paginación. Cada producto mostrado puede resolverse de dos formas:
  - Llevar a una nueva vista con el producto seleccionado con su descripción completa, detalles de precio, categoría, etc. Además de un botón para agregar al carrito.
  - Contar con el botón de “agregar al carrito” directamente, sin necesidad de abrir una página adicional con los detalles del producto.
- Además, agregar una vista en ‘/carts/:cid (cartId) para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito.
*/
