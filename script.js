
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

function displayCart() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty. Browse our collection to add handbags.</p>";
    cartSubtotal.textContent = "UGX 0";
    cartTotal.textContent = "UGX 0 + delivery";
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
      <h3>${item.name}</h3>
      <p>Price: ${formatPrice(item.price)}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Subtotal: <strong>${formatPrice(itemTotal)}</strong></p>
      <button class="remove-from-cart" data-code="${item.code}">Remove</button>
    `;

    cartItemsContainer.appendChild(itemElement);
  });

  cartSubtotal.textContent = formatPrice(subtotal);
  cartTotal.textContent = formatPrice(subtotal) + " + delivery";

  document.querySelectorAll(".remove-from-cart").forEach(button => {
    button.addEventListener("click", () => {
      cart = cart.filter(item => item.code !== button.dataset.code);
      saveCart();
      displayCart();
    });
  });
}

displayCart();
