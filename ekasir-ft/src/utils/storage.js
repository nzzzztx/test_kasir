import { isStockEnough, reduceStock } from "../utils/stock";

if (!cart.length) {
  alert("Keranjang masih kosong");
  return;
}

if (!isStockEnough(products, cart)) {
  alert("Stok tidak mencukupi");
  return;
}

const updatedProducts = reduceStock(products, cart);

setProducts(updatedProducts);
localStorage.setItem("products", JSON.stringify(updatedProducts));
