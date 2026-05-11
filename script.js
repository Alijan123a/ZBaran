const products = window.BaranStore.products;
const grid = document.querySelector('[data-product-grid]');
const filterButtons = document.querySelectorAll('[data-filter]');
const filterLinks = document.querySelectorAll('[data-filter-link]');
const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const cartDrawer = document.querySelector('[data-cart-drawer]');
const cartOverlay = document.querySelector('[data-cart-overlay]');
const cartOpenButtons = document.querySelectorAll('[data-cart-open]');
const cartCloseButtons = document.querySelectorAll('[data-cart-close]');
const cartItemsNode = document.querySelector('[data-cart-items]');
const cartEmptyNode = document.querySelector('[data-cart-empty]');
const cartSummaryNode = document.querySelector('[data-cart-summary]');
const cartSubtotalNode = document.querySelector('[data-cart-subtotal]');
const cartCountNodes = document.querySelectorAll('[data-cart-count]');

function productCard(product) {
  return `
    <article class="product-card" data-category="${product.category}">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-card-body">
        <div class="product-meta">
          <span class="tag">${product.label}</span>
          ${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-purchase">
          <span>${window.BaranStore.formatMoney(product.price)}</span>
          <small>${product.unit}</small>
        </div>
        <button class="button" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
      </div>
    </article>
  `;
}

function renderProducts(filter = 'all') {
  const visible = filter === 'all' ? products : products.filter((product) => product.category === filter);
  grid.innerHTML = visible.map(productCard).join('');
}

function setFilter(filter) {
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  renderProducts(filter);
}

function cartItemTemplate(item) {
  return `
    <article class="cart-line" data-cart-line="${item.id}">
      <img src="${item.image}" alt="">
      <div class="cart-line-info">
        <h3>${item.name}</h3>
        <p>${item.unit} - ${window.BaranStore.formatMoney(item.price)}</p>
        <div class="cart-line-actions">
          <div class="quantity-control" aria-label="Quantity for ${item.name}">
            <button type="button" data-cart-decrease="${item.id}" aria-label="Decrease ${item.name}">-</button>
            <input type="number" min="1" max="99" value="${item.quantity}" data-cart-quantity="${item.id}" aria-label="${item.name} quantity">
            <button type="button" data-cart-increase="${item.id}" aria-label="Increase ${item.name}">+</button>
          </div>
          <strong>${window.BaranStore.formatMoney(item.lineTotal)}</strong>
        </div>
      </div>
      <button class="cart-remove" type="button" data-cart-remove="${item.id}">Remove</button>
    </article>
  `;
}

function renderCart() {
  const items = window.BaranStore.cartItems();
  const subtotal = window.BaranStore.cartTotals().subtotal;
  const count = window.BaranStore.cartCount();

  cartCountNodes.forEach((node) => {
    node.textContent = String(count);
    node.hidden = count === 0 && node.matches('.cart-badge');
  });

  cartItemsNode.innerHTML = items.map(cartItemTemplate).join('');
  cartEmptyNode.hidden = items.length !== 0;
  cartSummaryNode.hidden = items.length === 0;
  cartSubtotalNode.textContent = window.BaranStore.formatMoney(subtotal);
}

function openCart() {
  renderCart();
  cartDrawer.hidden = false;
  cartOverlay.hidden = false;
  document.body.classList.add('cart-open');
}

function closeCart() {
  cartDrawer.hidden = true;
  cartOverlay.hidden = true;
  document.body.classList.remove('cart-open');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

filterLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const filter = link.dataset.filterLink;
    window.setTimeout(() => setFilter(filter), 0);
  });
});

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add-to-cart]');
  if (!button) return;
  window.BaranStore.addToCart(button.dataset.addToCart, 1);
  button.textContent = 'Added';
  window.setTimeout(() => {
    button.textContent = 'Add to Cart';
  }, 900);
  openCart();
});

cartItemsNode.addEventListener('click', (event) => {
  const increase = event.target.closest('[data-cart-increase]');
  const decrease = event.target.closest('[data-cart-decrease]');
  const remove = event.target.closest('[data-cart-remove]');

  if (increase) window.BaranStore.addToCart(increase.dataset.cartIncrease, 1);
  if (decrease) {
    const item = window.BaranStore.cartItems().find((cartItem) => cartItem.id === decrease.dataset.cartDecrease);
    if (item) window.BaranStore.setQuantity(item.id, item.quantity - 1);
  }
  if (remove) window.BaranStore.removeFromCart(remove.dataset.cartRemove);
});

cartItemsNode.addEventListener('change', (event) => {
  const input = event.target.closest('[data-cart-quantity]');
  if (!input) return;
  window.BaranStore.setQuantity(input.dataset.cartQuantity, input.value);
});

cartOpenButtons.forEach((button) => {
  button.addEventListener('click', openCart);
});

cartCloseButtons.forEach((button) => {
  button.addEventListener('click', closeCart);
});

cartOverlay.addEventListener('click', closeCart);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !cartDrawer.hidden) closeCart();
});

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('[data-cart-open]')) return;
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
});

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
});

window.addEventListener('baran:cart-change', renderCart);

renderProducts();
renderCart();
