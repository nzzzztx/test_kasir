import React, { useEffect, useState } from 'react';
import '../../assets/css/dashboard.css';
import '../../assets/css/product.css';
import '../../assets/css/categories.css';

import Sidebar from '../../components/Sidebar';
import toggleIcon from '../../assets/icons/togglebutton.png';
import notificationIcon from '../../assets/icons/notification.png';
import userDummy from '../../assets/img/user1.png';
import trashIcon from '../../assets/icons/trash.png';
import productDummy from '../../assets/img/product.png';
import searchIcon from '../../assets/icons/search.png';

const defaultCategories = [
    { id: 1, name: 'Kebutuhan Rumah Tangga' },
    { id: 2, name: 'Makanan dan Minuman' },
    { id: 3, name: 'Elektronik' },
    { id: 4, name: 'Peralatan Tulis dan Kantor' },
];

const dummyProducts = [
    {
        id: 1,
        name: 'Chitato Rasa Sapi Panggang',
        code: '000001',
        category: 'Makanan dan Minuman',
        stock: 100,
        priceMin: 5000,
        priceMax: 8000,
        image: productDummy,
    },
    {
        id: 2,
        name: 'Jetz Makanan Ringan Choco Viesta',
        code: '000002',
        category: 'Makanan dan Minuman',
        stock: 200,
        priceMin: 6000,
        priceMax: 9000,
        image: productDummy,
    },
];

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    useEffect(() => {
        const savedCategories = localStorage.getItem('categories');
        const savedProducts = localStorage.getItem('products');

        setCategories(savedCategories ? JSON.parse(savedCategories) : defaultCategories);
        setProducts(savedProducts ? JSON.parse(savedProducts) : dummyProducts);
    }, []);

    const getCategoryProducts = (categoryName) =>
        products.filter((p) => p.category === categoryName);

    const filteredProducts = selectedCategory
        ? getCategoryProducts(selectedCategory.name).filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    return (
        <div className="dashboard-container">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
                {/* HEADER */}
                <header className="content-header">
                    <div className="header-left">
                        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <img src={toggleIcon} alt="toggle" />
                        </button>
                        <h1>Kategori Barang</h1>
                    </div>

                    <div className="header-right">
                        <div className="notif" onClick={() => setNotificationOpen(!notificationOpen)}>
                            <img src={notificationIcon} alt="notif" />
                            <span>Notifikasi (0)</span>
                        </div>
                        <div className="profile-box">
                            <img src={userDummy} alt="profile" />
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="categories-wrapper">
                    {/* LEFT */}
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
                            {categories.map((cat) => {
                                const catProducts = getCategoryProducts(cat.name);
                                const totalStock = catProducts.reduce((s, p) => s + p.stock, 0);
                                const totalModal = catProducts.reduce(
                                    (s, p) => s + p.stock * p.priceMin,
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
                                            <button className="icon-btn">
                                                <img src={trashIcon} alt="hapus" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button className="btn-add-category">+ Tambah Kategori</button>
                    </div>

                    {/* RIGHT */}
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
                </div>
            </div>
        </div>
    );
};

export default Categories;
