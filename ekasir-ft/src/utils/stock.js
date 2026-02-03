export const isStockEnough = (products = [], cart = []) => {
  return cart.every((item) => {
    const product = products.find(
      (p) => p.code === item.productKey || p.id === item.productKey,
    );

    if (!product) return false;

    const stock = Number(product.stock) || 0;
    const qty = Number(item.qty) || 0;

    return stock >= qty && qty > 0;
  });
};

export const reduceStock = (products = [], cart = []) => {
  return products.map((product) => {
    const item = cart.find(
      (c) => c.productKey === product.code || c.productKey === product.id,
    );

    if (!item) return product;

    const stock = Number(product.stock) || 0;
    const qty = Number(item.qty) || 0;

    return {
      ...product,
      stock: Math.max(stock - qty, 0),
    };
  });
};

export const increaseStock = (products = [], items = []) => {
  return products.map((product) => {
    const item = items.find((i) => i.productKey === product.code);

    if (!item) return product;

    const stock = Number(product.stock) || 0;
    const qty = Number(item.qty) || 0;

    return {
      ...product,
      stock: stock + qty,
    };
  });
};
