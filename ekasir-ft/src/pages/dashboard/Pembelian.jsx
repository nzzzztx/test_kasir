import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "../../assets/css/dashboard.css";
import "../../assets/css/pembelian.css";

import PembelianForm from "../../components/Pembelian/PembelianForm";
import PembelianItems from "../../components/Pembelian/PembelianItems";
import PembelianSummary from "../../components/Pembelian/PembelianSummary";
import PembelianActions from "../../components/Pembelian/PembelianActions";

import backIcon from "../../assets/icons/back.png";
import toggleIcon from "../../assets/icons/togglebutton.png";

const Pembelian = () => {
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [supplier, setSupplier] = useState(null);

    const [paidAmount, setPaidAmount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("suppliers");
        if (saved) {
            setSuppliers(JSON.parse(saved));
        }
    }, []);

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

                        <button
                            className="btn-back"
                            onClick={() => navigate(-1)}
                        >
                            <img src={backIcon} alt="back" />
                        </button>

                        <h1>Pembelian Barang</h1>
                    </div>
                </header>

                <div className="pembelian-layout">
                    <div className="pembelian-left">
                        <PembelianForm
                            supplier={supplier}
                            setSupplier={setSupplier}
                            suppliers={suppliers}
                        />

                        <PembelianItems
                            items={items}
                            setItems={setItems}
                        />
                    </div>

                    <div className="pembelian-right">
                        <PembelianSummary
                            items={items}
                            paidAmount={paidAmount}
                        />
                        <PembelianActions />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pembelian;
