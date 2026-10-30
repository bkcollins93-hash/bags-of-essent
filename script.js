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

// Shopping cart
const products = [
  { code: "BOE-001", name: "Chanel Double Flap", price: 35000 },
  { code: "BOE-002", name: "Chris Bella", price: 150000 },
  { code: "BOE-003", name: "Chris Bella", price: 130000 },
  { code: "BOE-004", name: "Chris Bella", price: 150000 },
  { code: "BOE-005", name: "Lux", price: 35000 },
  { code: "BOE-006", name: "Lux", price: 35000 }
];

let cart = [];

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

    alert(product.name + " added to cart!");
    console.log("Shopping cart:", cart);
  });
});
