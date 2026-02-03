export const getProductKey = (product, index = 0) => {
  if (!product || typeof product !== "object") {
    return `invalid_${index}`;
  }

  return (
    product.code ||
    product.barcode ||
    product.sku ||
    product.id ||
    `temp_${index}`
  );
};
