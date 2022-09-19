const port = process.env.port || "8000";
const express = require("express");
const productApis = require("./routes/productApis.js.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", productApis);

app.set("views", "./src/views");
app.set("views engine", "ejs");

app.listen(port, (req, res) => {
  console.log("listening port:", port);
});
