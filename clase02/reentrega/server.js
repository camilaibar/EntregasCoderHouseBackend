/* Entrega clase 02 - Nuevas funcionalidades de los lenguajes ECMAScritpt & Programación sincrónica y asincrónica

Clases con ECMAScript y ECMAScript avanzado

- Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío
- Cada producto que gestione debe contar con las propiedades:
    - title (nombre del producto)
    - description (descripción del producto)
    - price (precio)
    - thumbnail (ruta de imagen)
    - code (código identificador)
    - stock (número de piezas disponibles)
- Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial.
    - Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    - Al agregarlo, debe crearse con un id autoincrementable
- Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos los productos creados hasta ese momento
- Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida con el id
    - En caso de no coincidir ningún id, mostrar en consola un error “Not found”
*/

class Product {
  static productList = [];
  static id = 0;
  constructor(title, description, price, thumbnail, code, stock) {
    this.id = Product.id++;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }

  addProduct = (title, description, price, thumbnail, code, stock) => {
    // Code must be different from others
    if (Product.productList.filter((item) => item.code === code).length === 0) {
      Product.productList.push(
        new Product(title, description, price, thumbnail, code, stock)
      );
      return true; // Product created
    }
    return false; // Product not created due to repeated code
  };

  getProducts = () => {
    return Product.productList;
  };

  getProductById = (id) => {
    const result = Product.productList.filter((item) => item.id === Number(id));
    return result.length !== 0 ? result : "Not found";
  };
}

/*-------------------------------------
--------------TESTING------------------
-------------------------------------*/
const productsManager = new Product();
console.log("Start: " + JSON.stringify(productsManager.getProducts()));
// Create product
productsManager.addProduct(
  "Product 001",
  "Product 001 Description",
  100,
  "",
  "C001",
  10
);
// Not create duplicated code
productsManager.addProduct(
  "Product 002",
  "Product 002 Description",
  1,
  "",
  "C001",
  10
);
// Second product
productsManager.addProduct(
  "Product 002",
  "Product 002 Description",
  1,
  "",
  "C002",
  10
);
// Validation
console.log(
  "Two different products and one repeated code result: " +
    JSON.stringify(productsManager.getProducts())
);

console.log(
  "Get product with existing id: " +
    JSON.stringify(productsManager.getProductById(1))
);
console.log(
  "Get product with non existing id: " +
    JSON.stringify(productsManager.getProductById(9))
);
