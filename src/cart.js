function validateQuantity(quantity, stock) {
  if (!Number.isInteger(quantity) || quantity <= 0 || quantity > stock) {
    throw new RangeError('Количество должно быть положительным целым числом и не превышать остаток на складе.');
  }
}

function addToCart(cart, product, quantity) {
  validateQuantity(quantity, product.stock);
  const existingProduct = cart.find((item) => item.id === product.id);
  const totalQuantity = (existingProduct ? existingProduct.quantity : 0) + quantity;
  validateQuantity(totalQuantity, product.stock);

  if (existingProduct) {
    return cart.map((item) => item.id === product.id
      ? { ...item, quantity: totalQuantity }
      : item);
  }

  return [...cart, { ...product, quantity }];
}

function changeQuantity(cart, productId, quantity) {
  const product = cart.find((item) => item.id === productId);
  if (!product) return cart;

  validateQuantity(quantity, product.stock);
  return cart.map((item) => item.id === productId ? { ...item, quantity } : item);
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);
  const discount = promoCode === 'SAVE10' && subtotal >= 20000
    ? Math.round(subtotal * 0.1)
    : 0;
  const delivery = subtotal < 50000 ? 30000 : 0;
  const total = subtotal - discount + delivery;

  return { subtotal, discount, delivery, total };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
