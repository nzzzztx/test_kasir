import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { getCurrentOwnerId } from "../../utils/owner";

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
import cameraIcon from "../../assets/icons/camera.png";

const Transaction = () => {
    const { authData } = useAuth();
    const navigate = useNavigate();
    const ownerId = getCurrentOwnerId();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [category, setCategory] = useState("Semua");
    const [search, setSearch] = useState("");
    const [scanMode, setScanMode] = useState(false);
    const [scannerOpen, setScannerOpen] = useState(false);
    const role = authData?.role;
    const [user, setUser] = useState(null);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        if (!ownerId || !authData?.token) return;

        fetch("http://localhost:5000/api/products", {
            headers: {
                Authorization: `Bearer ${authData.token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Gagal ambil produk");
                return res.json();
            })

            .then(data => {
                if (!Array.isArray(data)) {
                    setProducts([]);
                    return;
                }
                setProducts(data);
            });
    }, [ownerId, authData?.token]);

    useEffect(() => {
        if (!authData?.token) return;

        const refreshProducts = async () => {
            const res = await fetch("http://localhost:5000/api/products", {
                headers: {
                    Authorization: `Bearer ${authData.token}`
                }
            });

            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        };

        window.addEventListener("stockUpdated", refreshProducts);

        return () => {
            window.removeEventListener("stockUpdated", refreshProducts);
        };
    }, [authData?.token]);

    useEffect(() => {
        if (!authData?.token) return;

        const fetchExtras = async () => {
            const [discRes, taxRes] = await Promise.all([
                fetch("http://localhost:5000/api/discounts", {
                    headers: { Authorization: `Bearer ${authData.token}` }
                }),
                fetch("http://localhost:5000/api/taxes", {
                    headers: { Authorization: `Bearer ${authData.token}` }
                })
            ]);

            const discountsData = await discRes.json();
            const taxesData = await taxRes.json();

            setDiscounts(discountsData);
            setTaxes(taxesData);
        };

        fetchExtras();
    }, [authData?.token]);

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

    const handleScanOnce = (scannedCode) => {
        if (!scannedCode) return;

        const product = products.find(
            (p) => p.code && String(p.code) === String(scannedCode)
        );

        if (!product) {
            alert("Produk dengan barcode ini belum terdaftar");
            return;
        }

        const stock = Number(product.stock) || 0;

        if (product.show_in_transaction === false) {
            alert("Produk tidak ditampilkan di transaksi");
            return;
        }

        if (product.use_stock && stock <= 0) {
            alert("Stok produk habis");
            return;
        }

        setCart((prev) => {
            const exist = prev.find((i) => i.id === product.id);

            if (exist) {
                if (product.use_stock && exist.qty >= stock) {
                    return prev;
                }

                return prev.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                );
            }

            return [
                ...prev,
                {
                    id: product.id,   // WAJIB
                    code: product.code,
                    name: product.name,
                    sellPrice: Number(product.price_max || 0),
                    qty: 1
                },
            ];
        });

        setSearch("");
    };

    useEffect(() => {
        if (!authData?.token) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/profile", {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (err) {
                console.error("Gagal ambil profile:", err);
            }
        };

        fetchProfile();
    }, [authData?.token]);

    if (!user) {
        return (
            <div className="dashboard-container">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="main-content">
                    <div style={{ padding: "24px" }}>Loading profile...</div>
                </div>
            </div>
        );
    }

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
                        <div
                            className="notif"
                            onClick={() => {
                                setNotificationOpen(!notificationOpen);
                                markAllAsRead();
                            }}
                        >
                            <div className="notif-icon-wrapper">
                                <img src={notificationIcon} alt="notif" />

                                {unreadCount > 0 && (
                                    <span className="notif-badge">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <span>Notifikasi</span>

                            {notificationOpen && (
                                <div className="notif-dropdown">
                                    <div className="notif-header">
                                        <span>Notifikasi ({unreadCount})</span>
                                    </div>

                                    <div className={`notif-body ${notifications.length === 0 ? "empty" : ""}`}>
                                        {notifications.length === 0 ? (
                                            <>
                                                <div className="notif-icon">
                                                    <img
                                                        src={notificationIcon}
                                                        alt="no notification"
                                                        className="notif-icon-img"
                                                    />
                                                </div>
                                                <p className="notif-title">Tidak Ada Notifikasi</p>
                                                <p className="notif-desc">
                                                    Informasi terkait layanan darurat akan muncul disini.
                                                </p>
                                            </>
                                        ) : (
                                            notifications.map((n) => (
                                                <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
                                                    <strong>{n.title}</strong>
                                                    <p>{n.message}</p>
                                                    <small>
                                                        {new Date(n.createdAt).toLocaleTimeString("id-ID", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </small>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div
                                        className="notif-footer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setNotificationOpen(false);
                                        }}
                                    >
                                        Tutup
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            className="profile-box profile-trigger"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            <img
                                src={user?.avatar || userDummy}
                                alt="profile"
                                className="header-avatar"
                            />
                            <span className="profile-caret">▾</span>

                            {profileOpen && (
                                <div
                                    className="profile-dropdown"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="profile-title">
                                        Akun Saya
                                    </div>

                                    <div className="profile-header profile-header-center">
                                        <div className="profile-avatar-wrapper profile-avatar-large">
                                            <img
                                                src={user?.avatar || userDummy}
                                                alt="avatar"
                                                className="profile-avatar-img"
                                            />

                                            <label className="profile-avatar-edit">
                                                <img
                                                    src={cameraIcon}
                                                    alt="edit avatar"
                                                    className="profile-avatar-edit-icon"
                                                />

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    hidden
                                                    onChange={(e) => {
                                                        console.log(e.target.files[0]);
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        <div className="profile-info profile-info-center">
                                            <div className="profile-fullname">{user?.name}</div>
                                            <div className="profile-email">{user?.email}</div>
                                            <div className={`profile-role-badge ${authData?.role}`}>
                                                {authData?.role?.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-menu">
                                        <button
                                            className="profile-menu-item"
                                            onClick={() => {
                                                setProfileOpen(false);
                                                navigate("/dashboard/akun");
                                            }}
                                        >
                                            Edit Profile
                                        </button>

                                        <button
                                            className="profile-menu-item"
                                            onClick={() => {
                                                setProfileOpen(false);
                                                setShowPasswordModal(true);
                                            }}
                                        >
                                            Ganti Password
                                        </button>
                                    </div>
                                </div>
                            )}
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
                                    setScannerOpen(val);
                                }}
                                onScanOnce={() => {
                                    if (!search) return;
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
                        products={products}
                        setProducts={setProducts}
                        ownerId={ownerId}
                        cashierName={user?.name}
                        discounts={discounts}
                        taxes={taxes}
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

                            setTimeout(() => {
                                document.querySelector(".scan-wrapper input")?.focus();
                            }, 100);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Transaction;
