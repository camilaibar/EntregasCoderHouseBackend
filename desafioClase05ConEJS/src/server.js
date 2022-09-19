const port = process.env.port || "8000";
const axios = require("axios");
const productApis = require("../routes/productsApis.js");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", productApis);

app.set("views", "./src/views");
app.set("views engine", "ejs");

app.listen(port, (req, res) => {
  console.log("listening port:", port);
});

app.get("/", (req, res) => {
  let productList;
  try {
    axios
      .get(`http://localhost:8000/api/productos`)
      // Print data
      .then((response) => {
        productList = response.data;
        console.log(`Response ${productList}`);
      })
      // Print error message if occur
      .catch((error) => console.log("Error to fetch data\n"));
  } catch (e) {
    console.error(e);
  }
  console.log(productList);
  res.render("index"), { productList };
});
