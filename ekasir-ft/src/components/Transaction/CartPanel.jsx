import { useEffect, useState } from "react";

const CartPanel = ({ cart, setCart, userEmail }) => {
    const [discount, setDiscount] = useState(null);

    const total = cart.reduce(
        (sum, i) => sum + i.sellPrice * i.qty,
        0
    );

    const finalTotal = discount
        ? total - (total * discount.value) / 100
        : total;

    const removeItem = (code) => {
        setCart((prev) => prev.filter((i) => i.code !== code));
    };

    const handlePay = () => {
        if (!cart.length) return;

        // update STOCK
        const products = JSON.parse(
            localStorage.getItem("products") || "[]"
        );

        const updatedProducts = products.map((p) => {
            const item = cart.find((c) => c.code === p.code);
            if (!item) return p;

            return {
                ...p,
                stock: p.stock - item.qty,
            };
        });

        localStorage.setItem(
            "products",
            JSON.stringify(updatedProducts)
        );

        // LOGISTIK (KELUAR)
        const prevLogs = JSON.parse(
            localStorage.getItem("logistics") || "[]"
        );

        const newLogs = cart.map((item) => ({
            id: Date.now() + Math.random(),
            code: item.code,
            date: new Date().toISOString().split("T")[0],
            in: 0,
            out: item.qty,
            stock: item.stock - item.qty,
            basePrice: item.basePrice,
            sellPrice: item.sellPrice,
            email: userEmail,
            mode: "Transaksi Penjualan",
        }));

        localStorage.setItem(
            "logistics",
            JSON.stringify([...newLogs, ...prevLogs])
        );

        setCart([]);
        alert("Transaksi berhasil");
    };

    return (
        <div className="cart-panel">
            <h3>List Barang</h3>

            {cart.map((item) => (
                <div key={item.code} className="cart-item">
                    <span className="qty">{item.qty}</span>
                    <span className="name">{item.name}</span>
                    <span className="price">
                        Rp{" "}
                        {(item.sellPrice * item.qty).toLocaleString(
                            "id-ID"
                        )}
                    </span>
                    <button onClick={() => removeItem(item.code)}>
                        🗑
                    </button>
                </div>
            ))}

            <div className="cart-discount">
                <span>Lihat Diskon</span>
            </div>

            <button className="btn-pay" onClick={handlePay}>
                Rp {finalTotal.toLocaleString("id-ID")} — Bayar
            </button>
        </div>
    );
};

export default CartPanel;
