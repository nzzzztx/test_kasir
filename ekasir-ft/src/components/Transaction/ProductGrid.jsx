const ProductGrid = ({ products = [], category, search, cart, setCart }) => {
    const safeSearch = search.toLowerCase();

    const filteredProducts = products.filter((product) => {
        const name =
            product?.name ||
            product?.nama ||
            "";

        const cat =
            product?.category ||
            product?.kategori ||
            "";

        const matchSearch = name.toLowerCase().includes(safeSearch);
        const matchCategory =
            category === "Semua" || cat === category;

        return matchSearch && matchCategory;
    });

    return (
        <div className="product-grid">
            {filteredProducts.map((product) => {
                const code = product.code;
                const name = product.name || product.nama;
                const price =
                    product.sellPrice ??
                    product.harga_jual ??
                    0;

                const inCart = cart.find((i) => i.code === code);

                return (
                    <div
                        key={code}
                        className={`product-card ${inCart ? "active" : ""}`}
                        onClick={() => {
                            setCart((prev) => {
                                const exist = prev.find(
                                    (i) => i.code === code
                                );

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
                                        ...product,
                                        name,
                                        sellPrice: price,
                                        qty: 1,
                                    },
                                ];
                            });
                        }}
                    >
                        <img
                            src={product.image}
                            alt={name}
                        />

                        <div className="product-name">
                            {name || "Tanpa Nama"}
                        </div>

                        <div className="product-price">
                            Rp {price.toLocaleString("id-ID")}
                        </div>

                        {inCart && (
                            <div className="product-qty">
                                {inCart.qty}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProductGrid;
