console.log("Running realtimeProducts javascript file with sockets");

const socket = io();
const BACKEND_URL = "http://localhost:8080/api";

// HTML Tags
const form = document.getElementById("loadForm");
const formSubmitButtonClick = document.getElementById("loadFormSubmitButton");
const tbody = document.querySelector("#product-table tbody");
const emptyState = document.querySelector("#empty-state");

// Handlers
const loadTable = () => {
  // Fetch data from the API
  fetch(BACKEND_URL + "/products")
    .then((response) => response.json())
    .then((data) => {
      //data = data.payload;

      if (data.length === 0) {
        emptyState.style.display = "block";
      } else {
        data.forEach((product) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                  <td>${product.id}</td>
                  <td>${product.title}</td>
                  <td>${product.description}</td>
                  <td>${product.code}</td>
                  <td>${product.price}</td>
                  <td>${product.status}</td>
                  <td>${product.stock}</td>
                  <td>${product.category}</td>
                  <td>${product.thumbnail}</td>
                `;
          tbody.appendChild(row);
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      emptyState.style.display = "block";
      emptyState.style["text-align"] = "center";
    });
};

// Events
// Start
loadTable();

// New product added
formSubmitButtonClick.onclick = (e) => {
  socket.emit("newProduct", { message: `New product` });
};

// Listeners
socket.on("productListChange", (data) => {
  console.log(data.message);

  // Empty table
  tbody.innerHTML = "";

  // Reload table
  loadTable();
});
