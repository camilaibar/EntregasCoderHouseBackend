console.log("Running chat javascript file with sockets");

const socket = io();
const BACKEND_URL = "http://localhost:8080/api/v1";

// HTML Tags
const form = document.getElementById("loadForm");
const formSubmitButtonClick = document.getElementById("loadFormSubmitButton");
const deleteAllButton = document.getElementById("deleteAllButton");
const tbody = document.querySelector("#product-table tbody");
const emptyState = document.querySelector("#empty-state");

// Handlers
const loadTable = () => {
  // Fetch data from the API
  fetch(BACKEND_URL + "/messages")
    .then((response) => response.json())
    .then((data) => {
      //data = data.payload;

      if (data.length === 0) {
        emptyState.style.display = "block";
      } else {
        emptyState.style.display = "none";
        emptyState.style["text-align"] = "center";
        data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                  <td>${item._id}</td>
                  <td>${item.user}</td>
                  <td>${item.message}</td>
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
formSubmitButtonClick.onclick = async (e) => {
  e.preventDefault(); // Evita la acción predeterminada del formulario

  const user = document.getElementById("user").value;
  const message = document.getElementById("message").value;

  if (!user || !message) {
    return;
  }

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, message }),
    });

    if (response.ok) {
      socket.emit("postedMessage", { message: `New message` });
    } else {
      document.getElementById("user").value = "";
      document.getElementById("message").value = "";
    }
  } catch (error) {
    document.getElementById("user").value = "";
    document.getElementById("message").value = "";
  }
};

deleteAllButton.onclick = async (e) => {
  try {
    const response = await fetch("/api/messages", {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Delete issue:", error);
  }
  tbody.innerHTML = "";
  loadTable();
};

// Listeners
socket.on("newMessage", (data) => {
  console.log(data.message);

  // Empty table
  tbody.innerHTML = "";

  // Reload table
  loadTable();
});
