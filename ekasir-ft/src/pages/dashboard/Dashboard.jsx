import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
// import Navbar from '../../components/Navbar';
import '../../assets/css/dashboard.css';

import produkIcon from '../../assets/icons/produk.png';
import kategoriIcon from '../../assets/icons/category.png';
import customerIcon from '../../assets/icons/customer.png';
import supplierIcon from '../../assets/icons/user.png';
import diskonIcon from '../../assets/icons/discount.png';
import stokIcon from '../../assets/icons/stock.png';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuData = [
        { title: "Data Barang / Produk", desc: "Tambahkan barang atau jasa yang anda miliki untuk pengelolaan yang lebih akurat.", icon: produkIcon },
        { title: "Kategori Barang", desc: "Kelola barang dengan kategori tertentu untuk memudahkan manajemen produk.", icon: kategoriIcon },
        { title: "Data Pelanggan", desc: "Kelola informasi pelanggan atau member dengan mudah dan pantau dengan efisien.", icon: customerIcon },
        { title: "Data Supplier", desc: "Simpan data supplier anda secara teratur, untuk memastikan alur pasokan tetap lancar.", icon: supplierIcon },
        { title: "Diskon Barang", desc: "Buat potongan harga/diskon produk, baik berupa persentase atau nominal.", icon: diskonIcon },
        { title: "Stok Barang", desc: "Kelola stok barang anda dengan mudah dan pantau stok secara real-time disini.", icon: stokIcon },
    ];

    return (
        <div className="dashboard-container">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                        <h1>Manajemen <span className="badge">6</span></h1>
                    </div>
                    <div className="header-right">
                        <div className="notif"> Notifikasi (0)</div>
                        <img src="https://via.placeholder.com/40" alt="profile" className="profile-img" />
                    </div>
                </header>

                <div className="card-grid">
                    {menuData.map((item, index) => (
                        <div className="menu-card" key={index}>
                            <div className="card-top">
                                <div className="card-text">
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                                <div className="card-icon">
                                    <img src={item.icon} alt="icon" />
                                </div>
                            </div>
                            <button className="btn-atur">Atur sekarang</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;