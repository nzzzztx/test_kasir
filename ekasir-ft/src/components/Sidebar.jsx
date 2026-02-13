import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/sidebar.css';

import logo from '../assets/img/logo.png';
import manajemenIcon from '../assets/icons/manajemen.png';
import transaksiIcon from '../assets/icons/keuangan.png';
import laporanIcon from '../assets/icons/report.png';
import shiftIcon from '../assets/icons/shift.png';
import stokIcon from '../assets/icons/stock.png';
import userIcon from '../assets/icons/user.png';
import settingIcon from '../assets/icons/settings.png';
import logoutIcon from '../assets/icons/logout.png';

const Sidebar = ({ isOpen }) => {
    const { authData, logout } = useAuth();
    const role = authData?.role;

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <img src={logo} alt="Logo" className="logo-img" />
                {isOpen && <h2 className="brand-name">Kasir Test</h2>}
            </div>

            <div className="sidebar-menu">
                <p className="menu-label">{isOpen ? 'MAIN' : '...'}</p>

                {(role === "owner" || role === "gudang" || role === "kasir") && (
                    <Link to="/dashboard" className="menu-item">
                        <img src={manajemenIcon} alt="icon" />
                        {isOpen && <span>Dashboard</span>}
                    </Link>
                )}

                {(role === "owner" || role === "kasir") && (
                    <Link to="/dashboard/transaction" className="menu-item">
                        <img src={transaksiIcon} alt="icon" />
                        {isOpen && <span>Transaksi</span>}
                    </Link>
                )}

                {(role === "owner" || role === "gudang" || role === "kasir") && (
                    <Link to="/dashboard/laporan" className="menu-item">
                        <img src={laporanIcon} alt="icon" />
                        {isOpen && <span>Laporan</span>}
                    </Link>
                )}

                {(role === "owner" || role === "kasir") && (
                    <Link to="/dashboard/shift" className="menu-item">
                        <img src={shiftIcon} alt="icon" />
                        {isOpen && <span>Shift</span>}
                    </Link>
                )}

                {(role === "owner" || role === "gudang") && (
                    <Link to="/dashboard/stok-opname" className="menu-item">
                        <img src={stokIcon} alt="icon" />
                        {isOpen && <span>Stok Opname</span>}
                    </Link>
                )}

                <p className="menu-label" style={{ marginTop: '20px' }}>
                    {isOpen ? 'MORE' : '...'}
                </p>

                <Link to="/dashboard/akun" className="menu-item">
                    <img src={userIcon} alt="icon" />
                    {isOpen && <span>Akun Saya</span>}
                </Link>

                {role === "owner" && (
                    <Link to="/dashboard/setting" className="menu-item">
                        <img src={settingIcon} alt="icon" />
                        {isOpen && <span>Pengaturan</span>}
                    </Link>
                )}

                <p className="menu-label" style={{ marginTop: '160px' }}>
                    {isOpen ? 'LOGOUT' : '...'}
                </p>

                <button
                    className="menu-item logout-btn"
                    onClick={logout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <img src={logoutIcon} alt="logout" />
                    {isOpen && <span>Keluar</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
