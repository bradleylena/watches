// --- Authentication Check ---
if (
  localStorage.getItem("loggedIn") !== "true" &&
  sessionStorage.getItem("loggedIn") !== "true"
) {
  window.location.href = "login.html";
}

let editIndex = null;

function showSection(sectionId) {
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.display = "none";
  });

  const section = document.getElementById(sectionId);
  if (section) section.style.display = "block";

  if (sectionId === "orders") {
    renderOrders();
  } else if (sectionId === "overview") {
    updateDashboardOverview();
  } else if (sectionId === "viewOrders") {
    loadOrders();
  }
}

// --- Add Product ---
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const imageFile = document.getElementById("productImage").files[0];
  const videoFile = document.getElementById("productVideo").files[0];
  const description = document
    .getElementById("productDescription")
    .value.trim();
  const category = document.getElementById("productCategory").value;

  if (!imageFile) {
    alert("Please upload at least one image.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const imageData = e.target.result;

    const newProduct = {
      id: Date.now(),
      name,
      price,
      description,
      category,
      image: imageData,
    };

    if (videoFile) {
      const videoReader = new FileReader();
      videoReader.onload = function (e) {
        newProduct.video = e.target.result;
        saveProduct(newProduct);
      };
      videoReader.readAsDataURL(videoFile);
    } else {
      saveProduct(newProduct);
    }
  };

  reader.readAsDataURL(imageFile);
});

function saveProduct(product) {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  if (!product.id) {
    product.id = Date.now();
  }

  if (editIndex !== null) {
    products[editIndex] = product;
    editIndex = null;
    alert("✏️ Product updated!");
  } else {
    products.push(product);
    alert("✅ Product added!");
  }

  localStorage.setItem("products", JSON.stringify(products));
  renderAdminProducts();
}

// --- Render Admin Products ---
function renderAdminProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const list = document.getElementById("adminProductList");
  list.innerHTML = "";

  if (products.length === 0) {
    list.innerHTML = "<p>No products uploaded yet.</p>";
    return;
  }

  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p><strong>KES ${p.price}</strong></p>
      <p>${p.description}</p>
      <small>Category: ${p.category}</small><br><br>
      ${p.video ? `<video controls src="${p.video}"></video>` : ""}
      <div style="margin-top:10px;">
        <button onclick="openEditModal(${i})">✏️ Edit</button>
        <button onclick="deleteProduct(${i})">🗑️ Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function openEditModal(index) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products[index];

  document.getElementById("editProductId").value = index;
  document.getElementById("editProductName").value = product.name;
  document.getElementById("editProductPrice").value = product.price;
  document.getElementById("editProductDescription").value = product.description;
  document.getElementById("editProductCategory").value = product.category;

  document.getElementById("editProductModal").style.display = "block";
}

function closeEditModal() {
  const modal = document.getElementById("editProductModal");
  const content = modal.querySelector(".modal-content");

  content.style.animation = "slideOut 0.3s ease forwards";
  modal.style.animation = "fadeOut 0.3s ease forwards";

  setTimeout(() => {
    modal.style.display = "none";
    content.style.animation = "slideIn 0.4s ease forwards";
    modal.style.animation = "fadeIn 0.3s ease forwards";
  }, 300);
}

function deleteProduct(index) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  if (confirm("Delete this product?")) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderAdminProducts();
  }
}

// --- Logout ---
function logout() {
  localStorage.removeItem("loggedIn");
  sessionStorage.removeItem("loggedIn");
  alert("You have been logged out.");
  window.location.href = "/html/login.html";
}

// --- Edit Product Submit ---
document
  .getElementById("editProductForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const index = document.getElementById("editProductId").value;

    products[index].name = document
      .getElementById("editProductName")
      .value.trim();
    products[index].price = document
      .getElementById("editProductPrice")
      .value.trim();
    products[index].description = document
      .getElementById("editProductDescription")
      .value.trim();
    products[index].category = document.getElementById(
      "editProductCategory"
    ).value;

    localStorage.setItem("products", JSON.stringify(products));
    alert("✅ Product updated!");
    renderAdminProducts();
    closeEditModal();
  });

// --- Dashboard Overview ---
function updateDashboardOverview() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const messages = JSON.parse(localStorage.getItem("contactMessages")) || [];

  const totalProducts = products.length;
  const productsSold = products.filter((p) => p.sold).length;
  const unreadMessages = messages.filter((m) => !m.read).length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("productsSold").textContent = productsSold;
  document.getElementById("unreadMessages").textContent = unreadMessages;
  document.getElementById("totalRevenue").textContent = "KES " + totalRevenue;
  document.getElementById("messageCount").textContent = unreadMessages;
}

// --- Orders ---
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const container = document.getElementById("ordersContainer");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  orders.forEach((order, index) => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-card";

    orderDiv.innerHTML = `
      <h4>Order ID: ${order.id}</h4>
      <p><strong>Name:</strong> ${order.customer?.name || "N/A"}</p>
<p><strong>Email:</strong> ${order.customer?.email || "N/A"}</p>
<p><strong>Phone:</strong> ${order.customer?.phone || "N/A"}</p>
<p><strong>Address:</strong> ${order.customer?.address || "N/A"}</p>

      <p><strong>Date:</strong> ${order.date}</p>
      <ul>
        ${order.items
          .map(
            (item) =>
              `<li>${item.name} - KES ${item.price} × ${item.quantity}</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total:</strong> KES ${order.total}</p>
      <p><strong>Status:</strong> <span id="status-${index}">${
      order.status
    }</span></p>
      <div class="order-actions">
        <button onclick="markOrderAsRead(${index})">✅ Mark as Read</button>
        <button onclick="deleteOrder(${index})">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(orderDiv);
  });
}

function markOrderAsRead(index) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders[index].status = "Read";
  localStorage.setItem("orders", JSON.stringify(orders));
  document.getElementById(`status-${index}`).innerText = "Read";
}

function deleteOrder(index) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (confirm("Are you sure you want to delete this order?")) {
    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
  }
}

function loadOrders() {
  const orderList = document.getElementById("orderList");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (!orderList) return;

  if (orders.length === 0) {
    orderList.innerHTML = "<p>No orders found.</p>";
    return;
  }

  orderList.innerHTML = orders
    .map((order) => {
      return `
        <div class="order-card" style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
          <h4>Order #${order.id}</h4>
          <p><strong>Date:</strong> ${order.date}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <ul>
            ${order.items
              .map(
                (item) =>
                  `<li>${item.name} x ${item.quantity} - KES ${
                    item.price * item.quantity
                  }</li>`
              )
              .join("")}
          </ul>
          <p><strong>Total:</strong> KES ${order.total}</p>
        </div>
      `;
    })
    .join("");
}

// --- Media Preview ---
document.getElementById("productImage").addEventListener("change", function () {
  const previewContainer = document.getElementById("previewContainer");
  previewContainer.innerHTML = "";

  const files = Array.from(this.files);
  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const wrapper = document.createElement("div");
        wrapper.className = "preview-wrapper";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "preview-thumb";

        const removeBtn = document.createElement("span");
        removeBtn.textContent = "❌";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = () => wrapper.remove();

        wrapper.appendChild(removeBtn);
        wrapper.appendChild(img);
        previewContainer.appendChild(wrapper);
      };
      reader.readAsDataURL(file);
    }
  });
});

document.getElementById("productVideo").addEventListener("change", function () {
  const preview = document.getElementById("videoPreview");
  preview.innerHTML = "";
  const file = this.files[0];
  if (file) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.controls = true;
    video.style.maxWidth = "100%";
    video.style.borderRadius = "10px";
    preview.appendChild(video);
  }
});

// --- Lightbox ---
function openLightbox(mediaSrc, type = "image") {
  const container = document.getElementById("lightboxMedia");
  container.innerHTML = "";

  let media;
  if (type === "image") {
    media = document.createElement("img");
  } else {
    media = document.createElement("video");
    media.controls = true;
  }

  media.src = mediaSrc;
  container.appendChild(media);
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

window.onclick = function (event) {
  const modal = document.getElementById("editProductModal");
  if (event.target === modal) {
    closeEditModal();
  }
};

// --- Initial Load ---
document.addEventListener("DOMContentLoaded", () => {
  renderAdminProducts();
  renderOrders();
  loadOrders();
  updateDashboardOverview();
});
// STEP 1: Wait for page to load
document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("ordersContainer");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    ordersContainer.innerHTML = "<p>No orders found.</p>";
    return;
  }

  orders.forEach((order, index) => {
    const orderBox = document.createElement("div");
    orderBox.className = `order-box ${order.status.toLowerCase()}`;
    orderBox.style.color = "#111";

    const itemsList = order.items
      .map(
        (item) =>
          `<li>${item.name} x ${item.quantity} — KES ${
            item.price * item.quantity
          }</li>`
      )
      .join("");

    const customer = order.customer || {};

    orderBox.innerHTML = `
      <h3>🧾 Order ID: ${order.id}</h3>
      <p><strong>Date:</strong> ${order.date}</p>
      <p><strong>Status:</strong> 
        <span class="status-badge ${order.status.toLowerCase()}">${
      order.status
    }</span>
      </p>
      <p><strong>Total:</strong> KES ${order.total}</p>
      <hr/>
      <h4>🧍 Customer Details</h4>
      <p><strong>Name:</strong> ${customer.name || "N/A"}</p>
      <p><strong>Email:</strong> ${customer.email || "N/A"}</p>
      <p><strong>Phone:</strong> ${customer.phone || "N/A"}</p>
      <p><strong>Address:</strong> ${customer.address || "N/A"}</p>
      <hr/>
      <h4>🛒 Items</h4>
      <ul>${itemsList}</ul>

      <button class="toggle-status" data-index="${index}">
        ${
          order.status === "Unread"
            ? "✅ Mark as Delivered"
            : "↩️ Mark as Undelivered"
        }
      </button>
      <button class="delete-order" data-index="${index}">🗑️ Delete</button>
    `;

    ordersContainer.appendChild(orderBox);
  });
});

// STEP 2: Place this **outside** the DOMContentLoaded block
document.addEventListener("click", (e) => {
  // Handle mark as read/unread toggle
  if (e.target.classList.contains("toggle-status")) {
    const index = e.target.getAttribute("data-index");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders[index].status = orders[index].status === "Read" ? "Unread" : "Read";
    localStorage.setItem("orders", JSON.stringify(orders));
    location.reload(); // update UI
  }

  // Handle delete
  if (e.target.classList.contains("delete-order")) {
    const index = e.target.getAttribute("data-index");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    location.reload(); // refresh
  }
});
