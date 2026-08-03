window.SLECart = (() => {
  const key = 'sle-cart';
  const read = () => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
  const write = items => localStorage.setItem(key, JSON.stringify(items));
  const count = () => read().reduce((total, item) => total + item.quantity, 0);
  const price = value => Number(String(value).replace(/[^0-9.]/g, '')) || 0;
  const money = value => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
  const updateBadges = () => document.querySelectorAll('[data-cart-count]').forEach(badge => { badge.textContent = count(); });
  const add = product => {
    const items = read();
    const existing = items.find(item => item.sku === product.sku);
    if (existing) existing.quantity += 1;
    else items.push({ sku: product.sku, name: product.name, price: product.price, image: product.image || '', quantity: 1 });
    write(items); updateBadges();
  };
  const setQuantity = (sku, quantity) => { const items = read().map(item => item.sku === sku ? { ...item, quantity } : item).filter(item => item.quantity > 0); write(items); updateBadges(); };
  const remove = sku => { write(read().filter(item => item.sku !== sku)); updateBadges(); };
  const clear = () => { write([]); updateBadges(); };
  const total = () => read().reduce((sum, item) => sum + price(item.price) * item.quantity, 0);
  return { read, add, setQuantity, remove, clear, count, total, price, money, updateBadges };
})();
