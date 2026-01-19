import React, { useState } from 'react';
import '../../assets/css/dashboard.css';
import '../../assets/css/product.css';

import Sidebar from '../../components/Sidebar';
import ProductLayout from '../../components/Product/ProductLayout';

import toggleIcon from '../../assets/icons/togglebutton.png';
import notificationIcon from '../../assets/icons/notification.png';
import userDummy from '../../assets/img/user1.png';

const dummyProducts = [
    { id: 1, name: 'Tissue Paseo 250 Lembar', category: 'Rumah Tangga', stock: 145 },
    { id: 2, name: 'Chitato Sapi Panggang', category: 'Snack', stock: 100 },
    { id: 3, name: 'JetZ Coklat', category: 'Snack', stock: 200 },
];

const categories = ['Semua', 'Snack', 'Rumah Tangga'];

const Product = () => {
    // ✅ SEMUA useState HARUS DI SINI
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filteredProducts = dummyProducts.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            activeCategory === 'Semua' || p.category === activeCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="dashboard-container">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
                {/* HEADER */}
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
                            onClick={() => setNotificationOpen(!notificationOpen)}
                        >
                            <img src={notificationIcon} alt="notif" />
                            <span>Notifikasi</span>

                            {notificationOpen && (
                                <div className="notif-dropdown">
                                    <div className="notif-header">
                                        <span>Notifikasi (0)</span>
                                    </div>

                                    <div className="notif-body empty">
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
                            <img src={userDummy} alt="profile" className="header-avatar" />
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <ProductLayout
                    products={filteredProducts}
                    categories={categories}
                    search={search}
                    setSearch={setSearch}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                />
            </div>
        </div>
    );
};

export default Product;
