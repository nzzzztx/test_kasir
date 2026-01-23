import { getProductKey } from "../../utils/product";

const ProductGrid = ({ products = [], category, search, cart, setCart }) => {
    const safeSearch = (search || "").toLowerCase();

    const filteredProducts = products.filter((product) => {
        const name = product.name || "";
        const cat = product.category || "";

        return (
            name.toLowerCase().includes(safeSearch) &&
            (category === "Semua" || cat === category)
        );
    });

    return (
        <div className="product-grid">
            {filteredProducts.map((product, index) => {
                const code = getProductKey(product, index);
                const name = product.name || "Tanpa Nama";
                const price = Number(product.priceMax ?? 0);

                const inCart = cart.find((i) => i.code === code);

                return (
                    <div
                        key={code}
                        className={`product-card ${inCart ? "active" : ""}`}
                        onClick={() => {
                            setCart((prev) => {
                                const exist = prev.find((i) => i.code === code);

                                if (exist) {
                                    return prev.map((i) =>
                                        i.code === code
                                            ? { ...i, qty: i.qty + 1 }
                                            : i
                                    );
                                }

                                return [
                                    ...prev,
                                    {
                                        code,
                                        name,
                                        sellPrice: price,
                                        image: product.image,
                                        qty: 1,
                                    },
                                ];
                            });
                        }}
                    >
                        <img src={product.image} alt={name} />
                        <div className="product-name">{name}</div>
                        <div className="product-price">
                            {price > 0
                                ? `Rp ${price.toLocaleString("id-ID")}`
                                : "Rp -"}
                        </div>
                        {inCart && (
                            <div className="product-qty">{inCart.qty}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProductGrid;
