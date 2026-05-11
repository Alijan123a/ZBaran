const form = document.querySelector('[data-checkout-form]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const summaryItems = document.querySelector('[data-summary-items]');
const emptyState = document.querySelector('[data-checkout-empty]');
const totalsNode = document.querySelector('[data-summary-totals]');
const subtotalNode = document.querySelector('[data-summary-subtotal]');
const deliveryNode = document.querySelector('[data-summary-delivery]');
const taxNode = document.querySelector('[data-summary-tax]');
const totalNode = document.querySelector('[data-summary-total]');
const addressField = document.querySelector('[data-delivery-address]');
const confirmation = document.querySelector('[data-order-confirmation]');
const orderTitle = document.querySelector('[data-order-title]');
const orderCopy = document.querySelector('[data-order-copy]');
const orderDetails = document.querySelector('[data-order-details]');
const copyOrderButton = document.querySelector('[data-copy-order]');
const cartCountNodes = document.querySelectorAll('[data-cart-count]');

let latestOrderText = '';

function selectedFulfillment() {
  return form.elements.fulfillment.value;
}

function summaryItemTemplate(item) {
  return `
    <article class="summary-line">
      <img src="${item.image}" alt="">
      <div>
        <h3>${item.name}</h3>
        <p>${item.quantity} x ${item.unit}</p>
      </div>
      <strong>${window.BaranStore.formatMoney(item.lineTotal)}</strong>
    </article>
  `;
}

function renderCount() {
  const count = window.BaranStore.cartCount();
  cartCountNodes.forEach((node) => {
    node.textContent = String(count);
    node.hidden = count === 0 && node.matches('.cart-badge');
  });
}

function renderSummary() {
  const items = window.BaranStore.cartItems();
  const useDelivery = selectedFulfillment() === 'delivery';
  const totals = window.BaranStore.cartTotals({ delivery: useDelivery });

  renderCount();
  summaryItems.innerHTML = items.map(summaryItemTemplate).join('');
  emptyState.hidden = items.length !== 0;
  totalsNode.hidden = items.length === 0;
  form.querySelector('.checkout-submit').disabled = items.length === 0;

  subtotalNode.textContent = window.BaranStore.formatMoney(totals.subtotal);
  deliveryNode.textContent = useDelivery && totals.delivery === 0 && totals.subtotal > 0
    ? 'Free'
    : window.BaranStore.formatMoney(totals.delivery);
  taxNode.textContent = window.BaranStore.formatMoney(totals.tax);
  totalNode.textContent = window.BaranStore.formatMoney(totals.total);
}

function updateFulfillmentFields() {
  const useDelivery = selectedFulfillment() === 'delivery';
  addressField.hidden = !useDelivery;
  addressField.querySelector('textarea').required = useDelivery;
  renderSummary();
}

function orderId() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replaceAll('-', '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BRN-${stamp}-${random}`;
}

function buildOrderText(order) {
  const lines = [
    `Order ${order.id}`,
    '',
    'Customer',
    `${order.customer.name}`,
    `${order.customer.email}`,
    `${order.customer.phone}`,
    '',
    'Fulfillment',
    order.fulfillment === 'delivery' ? `Local delivery: ${order.address}` : 'Pickup',
    '',
    'Payment',
    order.payment,
    '',
    'Items',
    ...order.items.map((item) => `${item.quantity} x ${item.name} (${item.unit}) - ${window.BaranStore.formatMoney(item.lineTotal)}`),
    '',
    `Subtotal: ${window.BaranStore.formatMoney(order.totals.subtotal)}`,
    `Delivery: ${order.fulfillment === 'delivery' && order.totals.delivery === 0 ? 'Free' : window.BaranStore.formatMoney(order.totals.delivery)}`,
    `Estimated tax: ${window.BaranStore.formatMoney(order.totals.tax)}`,
    `Total: ${window.BaranStore.formatMoney(order.totals.total)}`,
  ];

  if (order.notes) {
    lines.push('', 'Notes', order.notes);
  }

  return lines.join('\n');
}

form.addEventListener('change', (event) => {
  if (event.target.name === 'fulfillment') updateFulfillmentFields();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const items = window.BaranStore.cartItems();
  if (items.length === 0) return;

  const data = new FormData(form);
  const fulfillment = data.get('fulfillment');
  const order = {
    id: orderId(),
    createdAt: new Date().toISOString(),
    customer: {
      name: data.get('name').trim(),
      email: data.get('email').trim(),
      phone: data.get('phone').trim(),
    },
    fulfillment,
    address: fulfillment === 'delivery' ? data.get('address').trim() : '',
    payment: data.get('payment'),
    notes: data.get('notes').trim(),
    items,
    totals: window.BaranStore.cartTotals({ delivery: fulfillment === 'delivery' }),
  };

  latestOrderText = buildOrderText(order);
  localStorage.setItem('baran-last-order', JSON.stringify(order));
  window.BaranStore.clearCart();

  orderTitle.textContent = `Thank you, ${order.customer.name}.`;
  orderCopy.textContent = `Your order request ${order.id} has been created. Copy the details or call Baran to confirm fulfillment.`;
  orderDetails.textContent = latestOrderText;
  confirmation.hidden = false;
  form.closest('.checkout-shell').hidden = true;
  confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

copyOrderButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(latestOrderText);
    copyOrderButton.textContent = 'Copied';
    window.setTimeout(() => {
      copyOrderButton.textContent = 'Copy Order Details';
    }, 1400);
  } catch {
    orderDetails.focus();
  }
});

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

nav.addEventListener('click', () => {
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
});

window.addEventListener('baran:cart-change', renderSummary);

updateFulfillmentFields();
