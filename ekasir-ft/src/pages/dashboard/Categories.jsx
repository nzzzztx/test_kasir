import React, { useEffect, useState } from 'react';
import '../../assets/css/dashboard.css';
import '../../assets/css/categories.css';
import { useNotifications } from '../../context/NotificationContext';

import Sidebar from '../../components/Sidebar';
import AddCategoryModal from '../../components/Categories/AddCategoryModal';
import DeleteCategoryModal from '../../components/Categories/DeleteCategoryModal';

import toggleIcon from '../../assets/icons/togglebutton.png';
import notificationIcon from '../../assets/icons/notification.png';
import userDummy from '../../assets/img/profile.png';
import trashIcon from '../../assets/icons/trash.png';
import productDummy from '../../assets/img/product.png';
import searchIcon from '../../assets/icons/search.png';
import { useAuth } from '../../context/AuthContext';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [user, setUser] = useState(null);
    const { authData } = useAuth();

    const getCategoryProducts = (categoryName) =>
        products.filter((p) => p.category === categoryName);

    const filteredProducts = selectedCategory
        ? getCategoryProducts(selectedCategory.name).filter((p) =>
            (p.name || "")
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        : [];

    const {
        notifications,
        unreadCount,
        markAllAsRead, } = useNotifications();

    const handleAddCategory = async (name) => {

        const ownerId =
            authData.role === "owner"
                ? authData.id
                : authData.ownerId;

        const res = await fetch("http://localhost:5000/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ownerId, name })
        });

        const result = await res.json();

        if (!res.ok) {
            alert(result.message);
            return;
        }

        const refresh = await fetch(
            `http://localhost:5000/api/categories/${ownerId}`
        );

        const newData = await refresh.json();
        setCategories(newData);

        setShowAdd(false);
    };

    useEffect(() => {
        setSelectedCategory(null);
        setSearch('');
    }, [authData]);

    useEffect(() => {
        if (!authData) return;

        const ownerId =
            authData.role === "owner"
                ? authData.id
                : authData.ownerId;

        const fetchCategories = async () => {
            const res = await fetch(
                `http://localhost:5000/api/categories/${ownerId}`
            );
            const data = await res.json();
            setCategories(data);
        };

        const fetchProducts = async () => {
            const res = await fetch(
                `http://localhost:5000/api/products/${ownerId}`
            );
            const data = await res.json();
            setProducts(data);
        };

        fetchCategories();
        fetchProducts();

    }, [authData]);

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

    if (!authData) {
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
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <img src={toggleIcon} alt="toggle" />
                        </button>
                        <h1>Kategori Barang</h1>
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
                            <span>Notifikasi ({unreadCount})</span>

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
                        <div className="profile-box">
                            <img src={user?.avatar || userDummy} alt="profile" />
                        </div>
                    </div>
                </header>

                <div className="categories-wrapper">
                    <div className="categories-left">
                        <div className="category-search">
                            <img src={searchIcon} alt="search" />
                            <input
                                placeholder="Cari kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="category-list">
                            {categories
                                .filter(cat =>
                                    (cat.name || "")
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                                )
                                .map((cat) => {
                                    const catProducts = getCategoryProducts(cat.name);
                                    const totalStock = catProducts.reduce(
                                        (s, p) => s + Number(p.stock || 0),
                                        0
                                    );

                                    const totalModal = catProducts.reduce(
                                        (s, p) => s + Number(p.stock || 0) * Number(p.priceMin || 0),
                                        0
                                    );

                                    return (
                                        <div
                                            key={cat.id}
                                            className={`category-item ${selectedCategory?.id === cat.id ? 'active' : ''
                                                }`}
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            <div>
                                                <h4>{cat.name}</h4>
                                                <p className="price orange">Sisa : {totalStock}</p>
                                            </div>

                                            <div className="category-right">
                                                <p className="price">Modal : Rp {totalModal.toLocaleString()}</p>
                                                <button
                                                    className="icon-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteTarget(cat);
                                                    }}
                                                >
                                                    <img src={trashIcon} alt="hapus" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        <button className="btn-add-category" onClick={() => setShowAdd(true)}>
                            + Tambah Kategori
                        </button>
                    </div>

                    <div className="categories-right">
                        <h3>Barang / Produk :</h3>

                        {!selectedCategory && (
                            <p className="empty-state">Pilih kategori terlebih dahulu</p>
                        )}

                        {filteredProducts.map((item) => (
                            <div key={item.id} className="product-row">
                                <img src={item.image} alt={item.name} />
                                <div className="info">
                                    <h4>{item.name}</h4>
                                    <span>{item.code}</span>
                                </div>
                                <div className="meta">
                                    <p>
                                        Rp {item.priceMin} – Rp {item.priceMax}
                                    </p>
                                    <strong>{item.stock}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                    {showAdd && (
                        <AddCategoryModal
                            onClose={() => setShowAdd(false)}
                            onSubmit={handleAddCategory}
                        />
                    )}

                    {deleteTarget && (
                        <DeleteCategoryModal
                            category={deleteTarget}
                            onCancel={() => setDeleteTarget(null)}
                            onConfirm={async (cat) => {

                                const ownerId =
                                    authData.role === "owner"
                                        ? authData.id
                                        : authData.ownerId;

                                const res = await fetch(
                                    `http://localhost:5000/api/categories/${cat.id}`,
                                    {
                                        method: "DELETE",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ ownerId })
                                    }
                                );

                                const result = await res.json();

                                if (!res.ok) {
                                    alert(result.message);
                                    return;
                                }

                                const refresh = await fetch(
                                    `http://localhost:5000/api/categories/${ownerId}`
                                );

                                const newData = await refresh.json();
                                setCategories(newData);

                                setDeleteTarget(null);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
