export const getProductKey = (product, index = 0) => {
  return (
    product.code ??
    product.barcode ??
    product.sku ??
    `${product.id ?? "noid"}_${index}`
  );
};
