// Mobile navigation menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'CLOSE ×' : 'MENU ☰';
  });
}

// Product list
const products = [
  { code: "BOE-001", name: "Chanel Double Flap", price: 35000 },
  { code: "BOE-002", name: "Chris Bella", price: 150000 },
  { code: "BOE-003", name: "Chris Bella", price: 130000 },
  { code: "BOE-004", name: "Chris Bella", price: 150000 },
  { code: "BOE-005", name: "Lux", price: 35000 },
  { code: "BOE-006", name: "Lux", price: 35000 }
];

// Load saved cart
let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("bagsOfEssentCart")) || [];
} catch (error) {
  cart = [];
}

// Save cart
function saveCart() {
  localStorage.setItem("bagsOfEssentCart", JSON.stringify(cart));
}

// Format Ugandan shillings
function formatPrice(amount) {
  return "UGX " + amount.toLocaleString("en-UG");
}

// Add products to cart
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const product = products.find(item => item.code === button.dataset.code);

    if (!product) return;

    const existingItem = cart.find(item => item.code === product.code);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    alert(product.name + " added to cart!");
  });
});

// Display cart page
const cartItemsContainer = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");

const productImages = {
  "BOE-001": "images/IMG-20261029-WA0006.jpg",
  "BOE-002": "images/IMG-20261029-WA0007.jpg",
  "BOE-003": "images/IMG-20261029-WA0008.jpg",
  "BOE-004": "images/IMG-20261029-WA0014.jpg",
  "BOE-005": "images/IMG-20261029-WA0017.jpg",
  "BOE-006": "images/IMG-20261029-WA0020.jpg"
};

function displayCart() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      "<p>Your cart is empty. Browse our collection to add handbags.</p>";
    cartSubtotal.textContent = "UGX 0";
    cartTotal.textContent = "UGX 0 + delivery";
    updateFloatingCartCount();
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "panel";
    itemElement.style.marginBottom = "15px";

    itemElement.innerHTML = `
      <div class="cart-product">
        <img src="${productImages[item.code]}" alt="${item.name}">
        <div class="cart-product-details">
          <h3>${item.name}</h3>
          <p>Unit price: ${formatPrice(item.price)}</p>
          <p>Subtotal: <strong>${formatPrice(itemTotal)}</strong></p>
          <div class="quantity-controls">
            <button class="quantity-minus" data-code="${item.code}">−</button>
            <span>${item.quantity}</span>
            <button class="quantity-plus" data-code="${item.code}">+</button>
          </div>
          <button class="remove-from-cart" data-code="${item.code}">
            Remove
          </button>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(itemElement);
  });

  cartSubtotal.textContent = formatPrice(subtotal);
  cartTotal.textContent = formatPrice(subtotal) + " + delivery";

  document.querySelectorAll(".quantity-plus").forEach(button => {
    button.addEventListener("click", () => {
      const item = cart.find(item => item.code === button.dataset.code);
      if (item) {
        item.quantity++;
        saveCart();
        displayCart();
        updateFloatingCartCount();
      }
    });
  });

  document.querySelectorAll(".quantity-minus").forEach(button => {
    button.addEventListener("click", () => {
      const item = cart.find(item => item.code === button.dataset.code);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
          cart = cart.filter(cartItem => cartItem.code !== item.code);
        }
        saveCart();
        displayCart();
        updateFloatingCartCount();
      }
    });
  });

  document.querySelectorAll(".remove-from-cart").forEach(button => {
    button.addEventListener("click", () => {
      cart = cart.filter(item => item.code !== button.dataset.code);
      saveCart();
      displayCart();
      updateFloatingCartCount();
    });
  });

  updateFloatingCartCount();
}

displayCart();
// Floating shopping cart icon
const floatingCart = document.createElement("a");
floatingCart.href = "cart.html";
floatingCart.className = "floating-cart";
floatingCart.setAttribute("aria-label", "Open shopping cart");

floatingCart.innerHTML = `
  <span class="cart-symbol">🛒👜</span>
  <span class="cart-count" id="floating-cart-count">0</span>
`;

document.body.appendChild(floatingCart);

// Update cart item count
function updateFloatingCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const countElement = document.getElementById("floating-cart-count");

  if (countElement) {
    countElement.textContent = count;
  }
}

updateFloatingCartCount();
// Show shopping cart items on the checkout page
const checkoutItems = document.getElementById("checkout-cart-items");

if (checkoutItems) {
  const checkoutSubtotal = document.getElementById("checkout-subtotal");

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>Your shopping cart is empty.</p>";
  } else {
    checkoutItems.innerHTML = cart.map(item => `
      <div class="checkout-item">
        <span>${item.name} × ${item.quantity}</span>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
      </div>
    `).join("");

    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    checkoutSubtotal.textContent = formatPrice(subtotal);
  }
}
// Product image enlarged view
const imageViewer = document.createElement("div");
imageViewer.id = "image-viewer";
imageViewer.innerHTML = `
  <button id="close-image-viewer" aria-label="Close">&times;</button>
  <img id="large-product-image" src="" alt="Enlarged handbag">
`;
document.body.appendChild(imageViewer);

document.querySelectorAll(".product-card img").forEach(img => {
  img.style.cursor = "zoom-in";

  img.addEventListener("click", () => {
    document.getElementById("large-product-image").src = img.src;
    imageViewer.classList.add("active");
  });
});

document.getElementById("close-image-viewer").addEventListener("click", () => {
  imageViewer.classList.remove("active");
});

imageViewer.addEventListener("click", event => {
  if (event.target === imageViewer) {
    imageViewer.classList.remove("active");
  }
});
