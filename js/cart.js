const cartItemsContainer = document.getElementById("cartItems");
const totalPriceDisplay = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceDisplay.textContent = "Total: KES 0";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>Price: KES ${item.price}</p>
        <div class="quantity-controls">
          <button onclick="changeQuantity(${index}, -1)">−</button>
          <span>${item.quantity || 1}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);

    const quantity = item.quantity || 1;
    total += Number(item.price) * quantity;
  });

  totalPriceDisplay.textContent = `Total: KES ${total}`;
}

function changeQuantity(index, delta) {
  if (!cart[index].quantity) cart[index].quantity = 1;
  cart[index].quantity += delta;

  if (cart[index].quantity < 1) {
    cart[index].quantity = 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function checkout() {
  alert("Proceeding to checkout...");
}

renderCart();
function checkout() {
  window.location.href = "checkout.html";
}
// Sample code to add item to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
}
