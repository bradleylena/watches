// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Get all products from localStorage
const allProducts = JSON.parse(localStorage.getItem("products")) || [];
const product = allProducts.find((p) => p.id === productId);

// Target the container in HTML
const container = document.getElementById("productDetails");

if (product) {
  container.innerHTML = `
    <!-- Image Section -->
    <div class="w-full md:w-1/2">
      <img src="${product.image}" alt="${
    product.name
  }" class="rounded-xl w-full shadow-md">
      ${
        product.video
          ? `<video controls class="mt-4 w-full rounded-xl shadow-md"><source src="${product.video}" /></video>`
          : ""
      }
    </div>

    <!-- Info Section -->
    <div class="w-full md:w-1/2 flex flex-col justify-start space-y-4">
      <div>
        <h1 class="text-3xl font-bold">${product.name}</h1>
        <p class="text-xl text-yellow-400 font-semibold mt-1">KES ${
          product.price
        }</p>
      </div>

      <div class="text-gray-300">
        <h3 class="text-lg font-semibold mb-1">Description</h3>
        <p>${product.description}</p>
      </div>

      <div class="text-sm text-gray-400">
        <span>Category:</span> ${product.category}
      </div>

      <button onclick="addToCart('${
        product.id
      }')" class="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold shadow-md transition">Add to Cart</button>
    </div>
  `;
} else {
  container.innerHTML = `<p class="text-red-500">❌ Product not found.</p>`;
}

// Add to Cart Function
function addToCart(productId) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("🛒 Added to cart!");
}
window.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  renderSingleProduct(productId);
});

function renderSingleProduct(productId) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.id == productId);
  if (!product) return;

  const container = document.getElementById("singleProductView");

  const imagesHTML = (product.images || [])
    .map((img) => `<img src="${img}" class="product-image" />`)
    .join("");

  container.innerHTML = `
    <div class="product-container">
      <div class="image-gallery">
        ${imagesHTML}
      </div>
      <div class="product-info">
        <h2>${product.name}</h2>
        <p><strong>Price:</strong> KES ${product.price}</p>
        <p><strong>Description:</strong> ${product.description}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <br /><br />
        <a href="store.html" class="back-link">← Back to Products</a>
      </div>
    </div>
  `;
}

function addToCart(productId) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.id == productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Added to cart!");
}
