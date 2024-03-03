const { Router } = require("express");
const viewsHandlebarsRouter = Router();

viewsHandlebarsRouter.get("/home", (req, res) => {
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

viewsHandlebarsRouter.get("/realtimeProducts", (req, res) => {
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

module.exports = viewsHandlebarsRouter;
