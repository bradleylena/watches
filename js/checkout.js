const summary = document.getElementById("orderSummary");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;

if (cart.length === 0) {
  summary.innerHTML = "<p>Your cart is empty.</p>";
} else {
  cart.forEach((item) => {
    const quantity = item.quantity || 1;
    const subtotal = quantity * item.price;
    total += subtotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.innerHTML = `
      <span>${item.name} x ${quantity}</span>
      <span>KES ${subtotal}</span>
    `;
    summary.appendChild(itemDiv);
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "item";
  totalDiv.innerHTML = `<strong>Total</strong><strong>KES ${total}</strong>`;
  summary.appendChild(totalDiv);
}

document
  .getElementById("checkoutForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const order = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      location: document.getElementById("location").value.trim(),
      items: cart,
      total,
    };

    console.log("Order Placed:", order);
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    window.location.href = "order-success.html";
  });
function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const newOrder = {
    id: Date.now(),
    items: cart,
    total,
    status: "Pending",
    date: new Date().toLocaleString(),
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");

  alert("✅ Order placed successfully!");
  window.location.href = "index.html";
}
