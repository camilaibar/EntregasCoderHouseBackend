// Clase 02 - Fnpm init -yile systems
const fs = require("fs");

class Product {
  static id = 0;
  constructor(productName, productDescription) {
    this.productID = Product.id++;
    this.productName = productName;
    this.productDescription = productDescription;
  }

  getProductID() {
    return this.productID;
  }
  getProductName() {
    return this.productName;
  }
  getProductDescription() {
    return this.productDescription;
  }
  getTotalProductsCounter() {
    return this.id;
  }
  setGlobalCounter(value) {
    this.id = value;
  }
}

function saveProduct(name, description) {
  try {
    const file = fs.readFile("./productList.txt", "utf-8", (error, content) => {
      if (error) {
        console.error(error);
      }
      let data = JSON.parse(content);
      data.productList.push(new Product(name, description));
      fs.writeFile("./productList.txt", JSON.stringify(data), (error) => {
        if (error) {
          console.error(error);
        } else {
          console.log("File changed");
        }
      });
    });
    return data.productList[data.productList.lenght - 1];
  } catch (error) {
    console.error(error);
  }
}

function getByID(id) {
  try {
    const file = fs.readFile("./productList.txt", "utf-8", (error, content) => {
      if (error) {
        console.error(error);
      }
      let data = JSON.parse(content);
      return data.productList.find((element) => (element.productID = id));
    });
  } catch (error) {
    console.error(error);
  }
}

function deleteByID(id) {
  try {
    const file = fs.readFile("./productList.txt", "utf-8", (error, content) => {
      if (error) {
        console.error(error);
      }
      let data = JSON.parse(content);
      data.productList = data.productList.filter(
        (element) => element.productID != id
      );
      fs.writeFile("./productList.txt", JSON.stringify(data), (error) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Product deleted");
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

function deleteAll() {
  try {
    const file = fs.readFile("./productList.txt", "utf-8", (error, content) => {
      if (error) {
        console.error(error);
      }
      let data = JSON.parse(content);
      data.productList[0]?.setGlobalCounter(0); //Reset class static counter
    });

    fs.unlink("./pruebaFS.txt", (error) => {
      if (error) {
        console.error(error);
      }
      console.log("Products deleted");
    });
  } catch (error) {
    console.error(error);
  }
}

function printAll() {
  try {
    const file = fs.readFile("./productList.txt", "utf-8", (error, content) => {
      if (error) {
        console.error(error);
      }
      let data = JSON.parse(content);
      if (data.productList.length === 0) {
        console.log([]);
        return;
      }
      data.productList.forEach((element) => {
        console.log(
          "Product:",
          element.productID,
          "Name:",
          element.productName,
          "Description:",
          element.productName
        );
      });
    });
  } catch (error) {
    console.error(error);
  }
}

try {
  fs.writeFile("./productList.txt", `{ "productList": [] }`, (error) => {
    if (error) {
      console.error(error);
    }
    console.log("File created");
    console.log("Load Product list");
    saveProduct("producto01", "descripcion01");
    saveProduct("producto02", "descripcion02");
    saveProduct("producto03", "descripcion03");
    printAll();
    deleteByID(1);
    console.log("Product list after delete of product 1:");
    printAll();
    deleteAll();
    console.log("Product list after full delete:");
    printAll();
  });
} catch (error) {
  console.error(error);
}
