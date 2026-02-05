import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProductKey } from "../../utils/product";

import "../../assets/css/dashboard.css";
import "../../assets/css/transaction.css";

import Sidebar from "../../components/Sidebar";
import ProductGrid from "../../components/Transaction/ProductGrid";
import CartPanel from "../../components/Transaction/CartPanel";
import ScanInput from "../../components/Transaction/ScanInput";
import CategoryFilter from "../../components/Transaction/CategoryFilter";
import BarcodeScannerModal from "../../components/Transaction/BarcodeScannerModal";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import userDummy from "../../assets/img/profile.png";

const Transaction = () => {
    const { authData } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [category, setCategory] = useState("Semua");
    const [search, setSearch] = useState("");
    const [scanMode, setScanMode] = useState(false);
    const [scannerOpen, setScannerOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("products");
        if (saved) setProducts(JSON.parse(saved));
    }, []);

    const handleScanOnce = (scannedCode) => {
        const product = products.find(
            (p, idx) => getProductKey(p, idx) === scannedCode
        );

        if (!product) {
            alert("Produk tidak ditemukan");
            return;
        }

        const stock = Number(product.stock) || 0;

        if (stock <= 0) {
            alert("Stok produk habis");
            return;
        }

        const code = getProductKey(product);

        setCart((prev) => {
            const exist = prev.find((i) => i.code === code);

            if (exist) {
                if (exist.qty >= stock) return prev;

                return prev.map((i) =>
                    i.code === code ? { ...i, qty: i.qty + 1 } : i
                );
            }

            return [
                ...prev,
                {
                    code,
                    name: product.name,
                    sellPrice: product.priceMax ?? 0,
                    image: product.image,
                    qty: 1,
                },
            ];
        });

        setSearch("");
    };

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user_profile");
        return saved
            ? JSON.parse(saved)
            : {
                name: "",
                email: "",
                avatar: userDummy,
            };
    });


    return (
        <div className="dashboard-container">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button
                            className="toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <img src={toggleIcon} alt="toggle" />
                        </button>
                        <h1>Transaksi</h1>
                    </div>

                    <div className="header-right">
                        <div className="notif">
                            <img src={notificationIcon} alt="notif" />
                            <span>Notifikasi (0)</span>
                        </div>
                        <div className="profile-box">
                            <img src={user.avatar} alt="profile" />
                        </div>
                    </div>
                </header>

                <div className="transaction-layout">
                    <div className="transaction-left">
                        <div className="transaction-search-card">
                            <ScanInput
                                search={search}
                                setSearch={setSearch}
                                scanMode={scanMode}
                                setScanMode={(val) => {
                                    setScanMode(val);
                                    if (val) setScannerOpen(true);
                                }}
                                onScanOnce={() => handleScanOnce(search)}
                            />
                        </div>

                        <div className="transaction-card">
                            <div className="card-title">Kategori</div>
                            <CategoryFilter
                                products={products}
                                active={category}
                                setActive={setCategory}
                            />
                        </div>

                        <div className="transaction-card">
                            <ProductGrid
                                products={products}
                                category={category}
                                search={search}
                                cart={cart}
                                setCart={setCart}
                            />
                        </div>
                    </div>

                    <CartPanel
                        cart={cart}
                        setCart={setCart}
                        userEmail={authData.email}
                    />
                </div>

                {scannerOpen && (
                    <BarcodeScannerModal
                        onClose={() => {
                            setScannerOpen(false);
                            setScanMode(false);
                        }}
                        onDetected={(code) => {
                            setSearch(code);
                            handleScanOnce(code);
                            setScannerOpen(false);
                            setScanMode(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Transaction;
