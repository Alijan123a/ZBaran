const products = [
  {
    name: 'Rose Pistachio Turkish Delight',
    category: 'turkish-delight',
    label: 'Turkish Delight',
    image: 'assets/catalogue/image-123-816x1472.jpg',
    description: 'Soft rose-flavored cubes dusted with sugar and finished with pistachio.',
    tags: ['Rose', 'Pistachio'],
  },
  {
    name: 'Lemon Turkish Delight',
    category: 'turkish-delight',
    label: 'Turkish Delight',
    image: 'assets/catalogue/image-149-1200x1200.jpg',
    description: 'Bright citrus Turkish delight with a clean, refreshing finish.',
    tags: ['Lemon', 'Giftable'],
  },
  {
    name: 'Assorted Turkish Delight Rolls',
    category: 'turkish-delight',
    label: 'Turkish Delight',
    image: 'assets/catalogue/image-142-1200x800.jpg',
    description: 'Colorful rolled sweets with nut coatings and layered fillings.',
    tags: ['Assorted', 'Nuts'],
  },
  {
    name: 'Classic Pistachio Baklava',
    category: 'baklava',
    label: 'Baklava',
    image: 'assets/catalogue/image-120-736x736.jpg',
    description: 'Golden pastry layered with pistachio and syrup.',
    tags: ['Pistachio', 'Classic'],
  },
  {
    name: 'Cream Baklava Squares',
    category: 'baklava',
    label: 'Baklava',
    image: 'assets/catalogue/image-50-720x859.jpg',
    description: 'Flaky pastry with a smooth cream center and honeyed finish.',
    tags: ['Cream', 'Honey'],
  },
  {
    name: 'Pistachio Baklava Plate',
    category: 'baklava',
    label: 'Baklava',
    image: 'assets/catalogue/image-177-1200x1200.jpg',
    description: 'A rich pistachio-forward presentation for dessert trays.',
    tags: ['Tray', 'Premium'],
  },
  {
    name: 'Rolled Baklava',
    category: 'baklava',
    label: 'Baklava',
    image: 'assets/catalogue/image-180-626x626.jpg',
    description: 'Rolled pastry with nut filling and a glossy syrup drizzle.',
    tags: ['Rolled', 'Syrup'],
  },
  {
    name: 'Mediterranean Olive Selection',
    category: 'olives',
    label: 'Olives & Oil',
    image: 'assets/catalogue/image-129-1000x1500.jpg',
    description: 'A curated mix of Mediterranean olives in classic styles.',
    tags: ['Classic', 'Briny'],
  },
  {
    name: 'Marinated Olive Blend',
    category: 'olives',
    label: 'Olives & Oil',
    image: 'assets/catalogue/image-161-1200x1800.jpg',
    description: 'Olives prepared with herbs, spices, citrus, and a bold finish.',
    tags: ['Marinated', 'Herbs'],
  },
  {
    name: 'Green Olives & Olive Oil',
    category: 'olives',
    label: 'Olives & Oil',
    image: 'assets/catalogue/image-158-499x750.jpg',
    description: 'Premium green olives paired with the richness of olive oil.',
    tags: ['Green Olive', 'Oil'],
  },
  {
    name: 'Persian Premium Saffron',
    category: 'saffron',
    label: 'Saffron',
    image: 'assets/catalogue/image-126-780x495.jpg',
    description: 'Deep red saffron threads for tea, desserts, rice, and fine dishes.',
    tags: ['Premium', 'Persian'],
  },
  {
    name: 'Roasted Nuts & Dried Fruits',
    category: 'nuts',
    label: 'Nuts & Fruits',
    image: 'assets/catalogue/image-197-736x1308.jpg',
    description: 'Pistachios, almonds, cashews, walnuts, apricots, figs, and raisins.',
    tags: ['Roasted', 'Dried Fruit'],
  },
  {
    name: 'Dried Fruit Selection',
    category: 'nuts',
    label: 'Nuts & Fruits',
    image: 'assets/catalogue/image-56-1080x1350.png',
    description: 'Naturally sweet fruit slices with a colorful serving presentation.',
    tags: ['Fruit', 'Naturally Sweet'],
  },
];

const grid = document.querySelector('[data-product-grid]');
const filterButtons = document.querySelectorAll('[data-filter]');
const filterLinks = document.querySelectorAll('[data-filter-link]');
const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const inquiry = document.querySelector('[data-inquiry]');
const inquiryCount = document.querySelector('[data-inquiry-count]');
const inquiryItems = document.querySelector('[data-inquiry-items]');
const copyButton = document.querySelector('[data-copy-inquiry]');
const selected = new Set();

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
        <button class="button" type="button" data-product="${product.name}">Add to Inquiry</button>
      </div>
    </article>
  `;
}

function renderProducts(filter = 'all') {
  const visible = filter === 'all' ? products : products.filter((product) => product.category === filter);
  grid.innerHTML = visible.map(productCard).join('');
  syncSelectedButtons();
}

function setFilter(filter) {
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  renderProducts(filter);
}

function syncSelectedButtons() {
  document.querySelectorAll('[data-product]').forEach((button) => {
    const isSelected = selected.has(button.dataset.product);
    button.classList.toggle('is-selected', isSelected);
    button.textContent = isSelected ? 'Added' : 'Add to Inquiry';
  });
}

function updateInquiry() {
  const items = [...selected];
  inquiry.hidden = items.length === 0;
  inquiryCount.textContent = `${items.length} item${items.length === 1 ? '' : 's'} selected`;
  inquiryItems.textContent = items.slice(0, 3).join(', ') + (items.length > 3 ? `, +${items.length - 3} more` : '');
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
  const button = event.target.closest('[data-product]');
  if (!button) return;
  const name = button.dataset.product;
  if (selected.has(name)) selected.delete(name);
  else selected.add(name);
  syncSelectedButtons();
  updateInquiry();
});

copyButton.addEventListener('click', async () => {
  const text = `Baran inquiry: ${[...selected].join(', ')}`;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = 'Copied';
    window.setTimeout(() => {
      copyButton.textContent = 'Copy Inquiry';
    }, 1400);
  } catch {
    window.location.href = `tel:+16479067408`;
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

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
});

renderProducts();
updateInquiry();
