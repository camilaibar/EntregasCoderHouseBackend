// Clase 02 - Functions
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

let productList = [];

function saveProduct(name, description) {
  productList.push(new Product(name, description));
  return productList[productList.lenght - 1];
}

function getByID(id) {
  return productList.find((element) => (element.productID = id));
}

function deleteByID(id) {
  productList = productList.filter((element) => element.productID != id);
}

function deleteAll() {
  productList[0]?.setGlobalCounter(0); //Reset class static counter
  productList.length = 0; // Empty array
}

function printAll() {
  if (productList.length === 0) {
    console.log([]);
    return;
  }
  productList.forEach((element) => {
    console.log(
      "Product:",
      element.productID,
      "Name:",
      element.productName,
      "Description:",
      element.productName
    );
  });
}

console.log("Product list:", productList);
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
