const slides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("dots");
let current = 0;
let startX = 0;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.dataset.index = i;
  dot.addEventListener("click", () => {
    current = i;
    showSlide(current);
    resetAutoSlide();
  });
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll("span");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    dots[i].classList.toggle("active", i === index);
  });
}

document.getElementById("nextBtn").addEventListener("click", () => {
  current = (current + 1) % slides.length;
  showSlide(current);
  resetAutoSlide();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
  resetAutoSlide();
});

// Auto-slide
let autoSlide = setInterval(() => {
  current = (current + 1) % slides.length;
  showSlide(current);
}, 5000);

function resetAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000);
}

// Touch/swipe support
const slider = document.getElementById("slider");

slider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

slider.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  if (diff > 50) {
    // swipe left
    current = (current + 1) % slides.length;
    showSlide(current);
    resetAutoSlide();
  } else if (diff < -50) {
    // swipe right
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
    resetAutoSlide();
  }
});

// Initial display
showSlide(current);
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const status = document.getElementById("contactStatus");
  status.textContent = "Sending...";

  // Fake delay simulation
  setTimeout(() => {
    status.textContent = "Thanks! Your message has been sent.";
    this.reset(); // Clear the form
  }, 1500);
});

const products = JSON.parse(localStorage.getItem("products")) || [];
const gallery = document.getElementById("productGallery");

function showProducts() {
  if (!gallery) return;

  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>KES ${p.price}</p>
        <button onclick="addToCart(${i})">Add to Cart</button>
      `;
    gallery.appendChild(div);
  });
}

function addToCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(products[index]);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}

showProducts();

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    contactStatus.textContent = "❗ Please fill in all fields.";
    return;
  }

  const entry = {
    name,
    email,
    message,
    timestamp: new Date().toLocaleString(),
  };

  // Save to localStorage
  const messages = JSON.parse(localStorage.getItem("contactMessages")) || [];
  messages.push(entry);
  localStorage.setItem("contactMessages", JSON.stringify(messages));

  contactStatus.textContent = "✅ Message sent successfully!";
  contactForm.reset();
});
