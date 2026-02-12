import React, { useState, useEffect } from 'react';
import '../../assets/css/dashboard.css';
import '../../assets/css/product.css';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

import Sidebar from '../../components/Sidebar';
import AddProduct from '../../components/Product/AddProduct';
import EditProduct from '../../components/Product/EditProduct';

import toggleIcon from '../../assets/icons/togglebutton.png';
import notificationIcon from '../../assets/icons/notification.png';
import searchIcon from '../../assets/icons/search.png';
import userDummy from '../../assets/img/profile.png';
import productDummy from '../../assets/img/product.png';
import trashIcon from '../../assets/icons/trash.png';

const initialProducts = [
    {
        id: 1,
        code: '000002',
        name: 'Tissue Paseo 2 Lapis 250 Lembar',
        category: 'Alat Rumah Tangga',
        stock: 145,
        priceMin: 9000,
        priceMax: 11000,
    },
];

const Product = () => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : initialProducts;
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [categories, setCategories] = useState([]);
    const { authData } = useAuth();
    const [user, setUser] = useState(null);

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

    useEffect(() => {
        if (products.length && !selectedProduct) {
            setSelectedProduct(products[0]);
        }
    }, [products, selectedProduct]);

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const filteredProducts = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            activeCategory === 'Semua' || p.category === activeCategory;
        return matchSearch && matchCategory;
    });

    useEffect(() => {
        const saved = localStorage.getItem('categories');
        const parsed = saved ? JSON.parse(saved) : [];
        setCategories(['Semua', ...parsed.map((c) => c.name)]);
    }, []);

    useEffect(() => {
        if (!authData) return;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = users.find(u => u.id === authData.id);

        if (currentUser) {
            setUser(currentUser);
        }
    }, [authData]);

    const handleSaveProduct = (data) => {
        const exists = products.some((p) => p.code === data.code);
        if (exists) {
            alert("Barcode sudah terdaftar!");
            return;
        }

        const newProduct = {
            id: Date.now(),
            ...data,
        };

        const next = [...products, newProduct];
        setProducts(next);
        setSelectedProduct(newProduct);
        setShowAddModal(false);
    };

    const handleUpdateProduct = (updated) => {
        const next = products.map((p) =>
            p.id === updated.id ? updated : p
        );

        setProducts(next);
        setSelectedProduct(updated);
        setShowEditModal(false);
    };

    if (!user) {
        return (
            <div className="dashboard-container">
                <Sidebar
                    isOpen={sidebarOpen}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
                <div className="main-content">
                    <div style={{ padding: 24 }}>Loading...</div>
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

            <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button
                            className="toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <img src={toggleIcon} alt="Toggle Sidebar" />
                        </button>
                        <h1>Data Barang / Produk</h1>
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

                        <div className="profile-box">
                            <img src={user?.avatar || userDummy} alt="profile" />
                        </div>
                    </div>
                </header>

                <div className="product-wrapper">
                    <div className="product-left">
                        <div className="product-search-wrapper">
                            <div className="product-search-group">
                                <img src={searchIcon} alt="search" />
                                <input
                                    className="product-search"
                                    placeholder="Cari barang..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <button
                                className="btn-filter-toggle"
                                onClick={() => setFilterOpen(!filterOpen)}
                            >
                                <img src={toggleIcon} alt="filter" />
                            </button>
                        </div>

                        {filterOpen && (
                            <div className="product-filter-panel">
                                <div className="product-category">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            className={cat === activeCategory ? 'active' : ''}
                                            onClick={() => {
                                                setActiveCategory(cat);
                                                setFilterOpen(false);
                                                // setTimeout(() => setFilterOpen(false), 0);
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="product-list">
                            {filteredProducts.map((item) => (
                                <div
                                    key={item.id}
                                    className={`product-item ${selectedProduct?.id === item.id ? 'active' : ''
                                        }`}
                                    onClick={() =>
                                        setSelectedProduct({
                                            ...item,
                                            type: item.type || 'default',
                                            minStock: item.minStock || '',
                                            rack: item.rack || '',
                                            weight: item.weight || '',
                                            unit: item.unit || 'gram',
                                            discount: item.discount || '',
                                            description: item.description || '',
                                            image: item.image || productDummy,
                                        })
                                    }
                                >
                                    <div className="product-item-top">
                                        <span className="badge">{item.category}</span>
                                        <span className="stock">{item.stock}</span>
                                    </div>

                                    <h4>{item.name}</h4>
                                    <p className="price">
                                        Rp {item.priceMin} – Rp {item.priceMax}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn-add-product"
                            onClick={() => setShowAddModal(true)}
                        >
                            + Tambah Barang
                        </button>
                    </div>

                    <div className="product-right">
                        <div className="product-detail-header">
                            <h3>Rincian Barang</h3>

                            <div className="detail-actions">
                                <button
                                    className="btn-edit-barang"
                                    onClick={() => setShowEditModal(true)}
                                >
                                    Edit rincian
                                </button>

                                <button
                                    className="btn-delete-icon"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <img src={trashIcon} alt="hapus" />
                                </button>
                            </div>
                        </div>

                        <div className="product-detail-grid">
                            <div>
                                <span>Tipe Barang</span>
                                <p>{selectedProduct?.type || '-'}</p>
                            </div>

                            <div>
                                <span>Kategori</span>
                                <p>{selectedProduct?.category || '-'}</p>
                            </div>

                            <div>
                                <span>Harga Dasar</span>
                                <p>
                                    {selectedProduct?.priceMin
                                        ? `Rp ${selectedProduct.priceMin.toLocaleString()}`
                                        : '-'}
                                </p>
                            </div>

                            <div>
                                <span>Harga Jual</span>
                                <p>
                                    {selectedProduct?.priceMax
                                        ? `Rp ${selectedProduct.priceMax.toLocaleString()}`
                                        : '-'}
                                </p>
                            </div>

                            <div>
                                <span>Stok</span>
                                <p>{selectedProduct?.stock ?? '-'}</p>
                            </div>

                            <div>
                                <span>Batas Minimum Stok</span>
                                <p>{selectedProduct?.minStock ?? '-'}</p>
                            </div>

                            <div>
                                <span>Letak Rak</span>
                                <p>{selectedProduct?.rack || '-'}</p>
                            </div>

                            <div>
                                <span>Berat</span>
                                <p>
                                    {selectedProduct?.weight
                                        ? `${selectedProduct.weight} ${selectedProduct.unit}`
                                        : '-'}
                                </p>
                            </div>

                            <div>
                                <span>Diskon</span>
                                <p>
                                    {selectedProduct?.discount
                                        ? `${selectedProduct.discount}%`
                                        : '-'}
                                </p>
                            </div>

                            <div>
                                <span>Keterangan</span>
                                <p>{selectedProduct?.description || '-'}</p>
                            </div>
                        </div>

                        {selectedProduct && (
                            <div className="product-detail-card">
                                <img
                                    src={selectedProduct?.image || productDummy}
                                    className="product-image"
                                    alt="product"
                                />
                                <h4>{selectedProduct.name}</h4>
                                <span className="code">{selectedProduct.code}</span>
                            </div>
                        )}
                    </div>
                </div>

                {showAddModal && (
                    <AddProduct
                        categories={categories.filter(c => c !== 'Semua')}
                        onClose={() => setShowAddModal(false)}
                        onSave={handleSaveProduct}
                    />
                )}


                {showEditModal && selectedProduct && (
                    <EditProduct
                        product={selectedProduct}
                        categories={categories.filter(c => c !== 'Semua')}
                        onClose={() => setShowEditModal(false)}
                        onSave={handleUpdateProduct}
                    />
                )}

                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-delete">
                            <p className="modal-title">
                                Hapus produk ini?
                            </p>

                            <div className="modal-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Batal
                                </button>

                                <button
                                    className="btn-confirm-delete"
                                    onClick={() => {
                                        if (!selectedProduct) return;

                                        setProducts((prev) =>
                                            prev.filter((p) => p.id !== selectedProduct.id)
                                        );
                                        setSelectedProduct(null);
                                        setShowDeleteModal(false);
                                    }}
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;
