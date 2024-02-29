/* Entrega clase 3 - Manejo de archivos en JavaScript & Administrador de paquetes NPM

Manejo de archivos en Javascript

Consigna
- Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).
- La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
- Debe guardar objetos con el siguiente formato:
    - id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
    - title (nombre del producto)
    - description (descripción del producto)
    - price (precio)
    - thumbnail (ruta de imagen)
    - code (código identificador)
    - stock (número de piezas disponibles)
- Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
- Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
- Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto
- Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 
- Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.
*/

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "products.txt");

const getFileData = () => {
  if (fs.existsSync(filePath)) {
    let data = fs.readFileSync(filePath, "utf-8");
    if (data.trim() === "" || JSON.parse(data)?.length === 0) return false; // File exist but does not have an array inside

    // File exists with a non empty array inside
    data = JSON.parse(data);

    // update ID for new product generation
    let greaterID = data.reduce(
      (greaterID, current) => (current.id > greaterID.id ? current : greaterID),
      data[0]
    ).id;

    return { list: data, id: greaterID };
  }
  return false; // File does not exist or can not be read
};

const updateFileData = () => {
  return (
    fs.writeFileSync(filePath, JSON.stringify(ProductManager.productList)) ===
    undefined
  );
};

const deleteFileData = () => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false; // File does not exist or can not be read
};

class ProductManager {
  static productList = getFileData().list || [];
  static id = getFileData().id || 0;
  constructor(title, description, price, thumbnail, code, stock) {
    this.id = ProductManager.id++;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }

  addProduct = (title, description, price, thumbnail, code, stock) => {
    // Code must be different from others
    if (
      ProductManager.productList.filter((item) => item.code === code).length ===
      0
    ) {
      ProductManager.productList.push(
        new ProductManager(title, description, price, thumbnail, code, stock)
      );

      return updateFileData(); // true if product created, false if errored transaction
    }
    return false; // Product not created due to repeated code
  };

  getAllProducts = () => {
    return ProductManager.productList;
  };

  getProductById = (id) => {
    const result = ProductManager.productList.filter(
      (item) => item.id === Number(id)
    );
    return result.length !== 0 ? result : "Not found";
  };

  updateProductById = (item) => {
    const { id, ...updatedFields } = item;
    const result = ProductManager.productList.filter(
      (item) => item.id === Number(id)
    );
    if (result.length !== 0) {
      ProductManager.productList = ProductManager.productList.map((item) =>
        item.id === Number(id) ? { ...item, ...updatedFields } : item
      );
      return updateFileData(); // true if product updated, false if errored transaction
    }
    return false; // Product not updated due to non existing id
  };

  deleteAllProducts = () => {
    ProductManager.productList = [];
    ProductManager.id = 0;
    return deleteFileData(); // true if products deleted, false if errored transaction
  };

  deleteProductById = (id) => {
    const filteredProducts = ProductManager.productList.filter(
      (item) => item.id !== Number(id)
    );
    // Code must be different from others
    if (filteredProducts.length !== ProductManager.productList.length) {
      ProductManager.productList = filteredProducts;
      return updateFileData(); // true if product deleted, false if errored transaction
    }
    return false; // Product not deleted due to non existing id
  };
}

/*-------------------------------------
--------------TESTING------------------
-------------------------------------*/
const productsManager = new ProductManager();

// Test addProduct
console.log(
  "No products added: " + JSON.stringify(productsManager.getAllProducts())
);
productsManager.addProduct(
  "Product 001",
  "Product 001 Description",
  100,
  "",
  "C001",
  10
);
productsManager.addProduct(
  "Product 002",
  "Product 002 Description",
  1,
  "",
  "C001",
  10
);
productsManager.addProduct(
  "Product 002",
  "Product 002 Description",
  1,
  "",
  "C002",
  10
);
productsManager.addProduct(
  "Product 003",
  "Product 003 Description",
  16,
  "",
  "C003",
  190
);
console.log(
  "Three products added, one duplicated: " +
    JSON.stringify(productsManager.getAllProducts())
);

// Test getProductById
console.log(
  "Get valid product id: " + JSON.stringify(productsManager.getProductById(1))
);
console.log(
  "Get invalid product id: " +
    JSON.stringify(productsManager.getProductById(999))
);

// Test updateProductById
console.log(
  "Product before change: " + JSON.stringify(productsManager.getProductById(1))
);
productsManager.updateProductById({ id: 1, title: "Edited title product 001" });
console.log(
  "Product after change: " + JSON.stringify(productsManager.getProductById(1))
);
console.log(
  "Update invalid product id: " +
    JSON.stringify(
      productsManager.updateProductById({
        id: 999,
        title: "Edited title product 999",
      })
    )
);

// Test deleteProductById
console.log(
  "Delete valid product id: " +
    JSON.stringify(productsManager.deleteProductById(1))
);
console.log(
  "Delete invalid product id: " +
    JSON.stringify(productsManager.deleteProductById(999))
);

// Test deleteAllProducts
console.log(
  "Delete all products: " + JSON.stringify(productsManager.deleteAllProducts())
);
