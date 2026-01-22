import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

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
import userDummy from "../../assets/img/user1.png";

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

    const handleScanOnce = (code) => {
        if (!code) return;

        const product = products.find((p) => p.code === code);
        if (!product) {
            alert("Produk tidak ditemukan");
            return;
        }

        setCart((prev) => {
            const exist = prev.find((i) => i.code === product.code);
            if (exist) {
                return prev.map((i) =>
                    i.code === product.code ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });

        setSearch("");
    };

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
                            <img src={userDummy} alt="profile" />
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
                                onScanOnce={() => {
                                    handleScanOnce(search);
                                }}
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
