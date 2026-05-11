(function () {
  const storageKey = 'baran-cart-v1';
  const taxRate = 0.13;
  const deliveryFee = 12;
  const freeDeliveryThreshold = 100;

  const products = [
    {
      id: 'rose-pistachio-delight',
      name: 'Rose Pistachio Turkish Delight',
      category: 'turkish-delight',
      label: 'Turkish Delight',
      image: 'assets/catalogue/image-123-816x1472.jpg',
      description: 'Soft rose-flavored cubes dusted with sugar and finished with pistachio.',
      tags: ['Rose', 'Pistachio'],
      unit: '250g box',
      price: 14.99,
    },
    {
      id: 'lemon-turkish-delight',
      name: 'Lemon Turkish Delight',
      category: 'turkish-delight',
      label: 'Turkish Delight',
      image: 'assets/catalogue/image-149-1200x1200.jpg',
      description: 'Bright citrus Turkish delight with a clean, refreshing finish.',
      tags: ['Lemon', 'Giftable'],
      unit: '250g box',
      price: 13.99,
    },
    {
      id: 'assorted-delight-rolls',
      name: 'Assorted Turkish Delight Rolls',
      category: 'turkish-delight',
      label: 'Turkish Delight',
      image: 'assets/catalogue/image-142-1200x800.jpg',
      description: 'Colorful rolled sweets with nut coatings and layered fillings.',
      tags: ['Assorted', 'Nuts'],
      unit: '400g tray',
      price: 22.99,
    },
    {
      id: 'classic-pistachio-baklava',
      name: 'Classic Pistachio Baklava',
      category: 'baklava',
      label: 'Baklava',
      image: 'assets/catalogue/image-120-736x736.jpg',
      description: 'Golden pastry layered with pistachio and syrup.',
      tags: ['Pistachio', 'Classic'],
      unit: '6 pieces',
      price: 18.99,
    },
    {
      id: 'cream-baklava-squares',
      name: 'Cream Baklava Squares',
      category: 'baklava',
      label: 'Baklava',
      image: 'assets/catalogue/image-50-720x859.jpg',
      description: 'Flaky pastry with a smooth cream center and honeyed finish.',
      tags: ['Cream', 'Honey'],
      unit: '6 pieces',
      price: 19.99,
    },
    {
      id: 'pistachio-baklava-plate',
      name: 'Pistachio Baklava Plate',
      category: 'baklava',
      label: 'Baklava',
      image: 'assets/catalogue/image-177-1200x1200.jpg',
      description: 'A rich pistachio-forward presentation for dessert trays.',
      tags: ['Tray', 'Premium'],
      unit: '12 pieces',
      price: 34.99,
    },
    {
      id: 'rolled-baklava',
      name: 'Rolled Baklava',
      category: 'baklava',
      label: 'Baklava',
      image: 'assets/catalogue/image-180-626x626.jpg',
      description: 'Rolled pastry with nut filling and a glossy syrup drizzle.',
      tags: ['Rolled', 'Syrup'],
      unit: '8 pieces',
      price: 24.99,
    },
    {
      id: 'mediterranean-olive-selection',
      name: 'Mediterranean Olive Selection',
      category: 'olives',
      label: 'Olives & Oil',
      image: 'assets/catalogue/image-129-1000x1500.jpg',
      description: 'A curated mix of Mediterranean olives in classic styles.',
      tags: ['Classic', 'Briny'],
      unit: '500g jar',
      price: 12.99,
    },
    {
      id: 'marinated-olive-blend',
      name: 'Marinated Olive Blend',
      category: 'olives',
      label: 'Olives & Oil',
      image: 'assets/catalogue/image-161-1200x1800.jpg',
      description: 'Olives prepared with herbs, spices, citrus, and a bold finish.',
      tags: ['Marinated', 'Herbs'],
      unit: '500g jar',
      price: 13.99,
    },
    {
      id: 'green-olives-olive-oil',
      name: 'Green Olives & Olive Oil',
      category: 'olives',
      label: 'Olives & Oil',
      image: 'assets/catalogue/image-158-499x750.jpg',
      description: 'Premium green olives paired with the richness of olive oil.',
      tags: ['Green Olive', 'Oil'],
      unit: '500ml bottle',
      price: 21.99,
    },
    {
      id: 'persian-premium-saffron',
      name: 'Persian Premium Saffron',
      category: 'saffron',
      label: 'Saffron',
      image: 'assets/catalogue/image-126-780x495.jpg',
      description: 'Deep red saffron threads for tea, desserts, rice, and fine dishes.',
      tags: ['Premium', 'Persian'],
      unit: '2g pack',
      price: 29.99,
    },
    {
      id: 'roasted-nuts-dried-fruits',
      name: 'Roasted Nuts & Dried Fruits',
      category: 'nuts',
      label: 'Nuts & Fruits',
      image: 'assets/catalogue/image-197-736x1308.jpg',
      description: 'Pistachios, almonds, cashews, walnuts, apricots, figs, and raisins.',
      tags: ['Roasted', 'Dried Fruit'],
      unit: '500g pouch',
      price: 17.99,
    },
    {
      id: 'dried-fruit-selection',
      name: 'Dried Fruit Selection',
      category: 'nuts',
      label: 'Nuts & Fruits',
      image: 'assets/catalogue/image-56-1080x1350.png',
      description: 'Naturally sweet fruit slices with a colorful serving presentation.',
      tags: ['Fruit', 'Naturally Sweet'],
      unit: '350g tray',
      price: 16.99,
    },
  ];

  const productMap = products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});

  function readCart() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey));
      if (!value || typeof value !== 'object') return {};
      return Object.fromEntries(
        Object.entries(value)
          .filter(([id, quantity]) => productMap[id] && Number.isFinite(Number(quantity)) && Number(quantity) > 0)
          .map(([id, quantity]) => [id, Math.min(99, Math.floor(Number(quantity)))])
      );
    } catch {
      return {};
    }
  }

  function writeCart(cart) {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('baran:cart-change', { detail: cart }));
  }

  function addToCart(productId, quantity = 1) {
    if (!productMap[productId]) return;
    const cart = readCart();
    cart[productId] = Math.min(99, (cart[productId] || 0) + quantity);
    writeCart(cart);
  }

  function setQuantity(productId, quantity) {
    const cart = readCart();
    const nextQuantity = Math.floor(Number(quantity));
    if (!productMap[productId]) return;
    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) delete cart[productId];
    else cart[productId] = Math.min(99, nextQuantity);
    writeCart(cart);
  }

  function removeFromCart(productId) {
    const cart = readCart();
    delete cart[productId];
    writeCart(cart);
  }

  function clearCart() {
    writeCart({});
  }

  function cartItems() {
    return Object.entries(readCart()).map(([id, quantity]) => {
      const product = productMap[id];
      return {
        ...product,
        quantity,
        lineTotal: product.price * quantity,
      };
    });
  }

  function cartCount() {
    return cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  function cartTotals(options = {}) {
    const subtotal = cartItems().reduce((sum, item) => sum + item.lineTotal, 0);
    const delivery = options.delivery ? (subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : deliveryFee) : 0;
    const tax = (subtotal + delivery) * taxRate;
    return {
      subtotal,
      delivery,
      tax,
      total: subtotal + delivery + tax,
    };
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(value);
  }

  window.BaranStore = {
    products,
    productMap,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    cartItems,
    cartCount,
    cartTotals,
    formatMoney,
    freeDeliveryThreshold,
  };
})();
