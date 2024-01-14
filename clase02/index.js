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
  static id = 1;
  constructor(title, description, price, thumbnail, code, stock) {
    this.id = Product.id++;
    this.title = title; //nombre del producto
    this.description = description; //descripción del producto
    this.price = price; //precio
    this.thumbnail = thumbnail; // ruta de imagen
    this.code = code; //código identificador
    this.stock = stock; //número de piezas disponibles
  }
}

class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct = (product) => {
    let avoidDuplicate = this.products.find(
      (item) => item.code === product.code
    );

    if (!avoidDuplicate) this.products.push(product);
  };

  getProducts = () => this.products;
  getProductById = (id) => {
    let item = this.products.find((item) => item.id === id);

    if (item) return item;
    return "Not found";
  };
}

const productManager = new ProductManager();
productManager.addProduct(
  new Product("Producto 001", "Description Producto 001", 10, "", "00001", 100)
);
productManager.addProduct(
  new Product("Producto 002", "Description Producto 002", 10, "", "00002", 100)
);
productManager.addProduct(
  new Product("Producto 003", "Description Producto 003", 10, "", "00003", 100)
);

// Tests
console.log(
  "This are my products:",
  JSON.stringify(productManager.getProducts())
);
console.log(
  "Get first product:",
  JSON.stringify(productManager.getProductById(1))
);
console.log(
  "Get second product:",
  JSON.stringify(productManager.getProductById(2))
);
console.log(
  "Get third product:",
  JSON.stringify(productManager.getProductById(3))
);
