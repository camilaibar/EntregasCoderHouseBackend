console.log("Welcome to my realTimeProducts backend with socket");

const socket = io();

// HTML Elements
const formSubmitButton = document.getElementById("loadFormSubmitButton");

// Events
formSubmitButton.onclick = () => {
  // New product added
  socket.emit("newProduct", { message: `New product` });
};

// Listeners
socket.on("welcome", (data) => console.log(data.message));
socket.on("welcomeNewConnection", (data) => console.log(data.message));
socket.on("productListChange", (data) => {
  console.log(data.message);
  // Reload table
  // Refresh the page
  location.href = location.href;
});
