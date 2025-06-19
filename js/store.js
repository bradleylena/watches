const allProducts = JSON.parse(localStorage.getItem("products")) || [];
const gallery = document.getElementById("productGallery");

// Render products in the gallery
function renderProducts(products) {
  gallery.innerHTML = "";

  if (products.length === 0) {
    gallery.innerHTML = "<p>No products available.</p>";
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>KES ${product.price}</p>
      <button onclick="viewProduct('${product.id}')">View Details</button>
    `;

    gallery.appendChild(productCard);
  });
}

// Filter products by category
function filterProducts(category) {
  const filtered =
    category === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === category);
  renderProducts(filtered);
}

// Store selected product in localStorage
function viewProduct(productId) {
  const selected = allProducts.find((p) => p.id == productId);

  if (selected) {
    localStorage.setItem("selectedProduct", JSON.stringify(selected));
    window.location.href = "product.html";
  } else {
    alert("Product not found.");
  }
}

// Initial load
renderProducts(allProducts);

function renderStore() {
  const category = document.getElementById("categoryFilter").value;
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  const container = document.getElementById("storeProductList");
  container.innerHTML = "";

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>KES ${product.price}</p>
    `;
    card.addEventListener("click", () => showProductDetails(product.id)); // ✅ Key line
    container.appendChild(card);
  });
}

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
  alert("Added to cart!");
}
function showSection(sectionId) {
  document.querySelectorAll(".content-section").forEach((sec) => {
    sec.style.display = "none";
  });

  document.getElementById(sectionId).style.display = "block";

  if (sectionId === "manage") renderAdminProducts();
  if (sectionId === "orders") renderOrders();
  if (sectionId === "store") renderStore(); // <--- Add this line
}
function showProductDetails(productId) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const images = product.images || (product.image ? [product.image] : []);

  const container = document.getElementById("singleProductView");
  container.innerHTML = `
    <div style="display: flex; flex-wrap: wrap; gap: 30px; align-items: flex-start;">
      <div style="flex: 1; min-width: 300px;">
        ${images
          .map(
            (img) => `
            <img src="${img}" alt="${product.name}" style="width: 100%; max-width: 400px; margin-bottom: 10px;" />
          `
          )
          .join("")}
      </div>
      <div style="flex: 1; min-width: 300px;">
        <h2 style="font-size: 24px; margin-bottom: 10px;">${product.name}</h2>
        <p><strong>Price:</strong> KES ${product.price}</p>
        <p><strong>Description:</strong> ${product.description}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <button 
          onclick="addToCart('${product.id}')"
          style="padding: 10px 20px; background-color: black; color: white; border: none; cursor: pointer; border-radius: 5px; margin-top: 10px;"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  `;

  // Show productDetails section
  document.getElementById("store").style.display = "none";
  document.getElementById("productDetails").style.display = "block";
}

function goBackToStore() {
  document.getElementById("productDetails").style.display = "none";
  document.getElementById("store").style.display = "block";
}
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const imageFiles = document.getElementById("productImages").files;
  const videoFile = document.getElementById("productVideo").files[0];
  const description = document
    .getElementById("productDescription")
    .value.trim();
  const category = document.getElementById("productCategory").value;

  if (imageFiles.length === 0) {
    alert("Please upload at least one image.");
    return;
  }

  const images = [];
  let imagesLoaded = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const reader = new FileReader();
    reader.onload = function (e) {
      images.push(e.target.result);
      imagesLoaded++;

      // Wait until all images are loaded
      if (imagesLoaded === imageFiles.length) {
        const newProduct = {
          id: Date.now(),
          name,
          price,
          description,
          category,
          images,
        };

        if (videoFile) {
          const videoReader = new FileReader();
          videoReader.onload = function (ev) {
            newProduct.video = ev.target.result;
            saveProduct(newProduct);
          };
          videoReader.readAsDataURL(videoFile);
        } else {
          saveProduct(newProduct);
        }
      }
    };
    reader.readAsDataURL(imageFiles[i]);
  }
});

function saveProduct(product) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
  alert("✅ Product added!");

  // Clear the form
  document.getElementById("productForm").reset();
}
