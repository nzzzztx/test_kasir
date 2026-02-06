import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../assets/css/dashboard.css";
import "../../assets/css/edc.css";

import toggleIcon from "../../assets/icons/togglebutton.png";

const EDC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selected, setSelected] = useState("");
    const selectedDevice = devices.find(d => d.id === selected);

    useEffect(() => {
        const saved = localStorage.getItem("edc_devices");
        if (saved) {
            const parsed = JSON.parse(saved);
            setDevices(parsed);
            setSelected(parsed[0]?.id || "");
        }
    }, []);

    const saveDevices = (list) => {
        setDevices(list);
        localStorage.setItem("edc_devices", JSON.stringify(list));
    };

    const handleAddDevice = () => {
        const newDevice = {
            id: `EDC-${String(devices.length + 1).padStart(3, "0")}`,
            name: `EDC ${devices.length + 1}`,
            status: "connected",
            createdAt: new Date().toISOString(),
        };

        const updated = [...devices, newDevice];
        saveDevices(updated);
        setSelected(newDevice.id);
    };

    const handleDisconnect = () => {
        if (!selectedDevice) return;

        const updated = devices.map(d =>
            d.id === selected
                ? { ...d, status: "disconnected" }
                : d
        );

        saveDevices(updated);
    };

    const handleReconnect = () => {
        if (!selectedDevice) return;

        const updated = devices.map(d =>
            d.id === selected
                ? { ...d, status: "connected" }
                : d
        );

        saveDevices(updated);
    };

    const handleDelete = () => {
        if (!selectedDevice) return;

        if (selectedDevice.status === "connected") {
            alert("Disconnect perangkat terlebih dahulu");
            return;
        }

        const updated = devices.filter(d => d.id !== selected);
        saveDevices(updated);
        setSelected(updated[0]?.id || "");
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
                        <h1>Perangkat EDC</h1>
                    </div>
                </header>

                <div className="edc-wrapper">
                    <div className="edc-card">
                        <div className="edc-select">
                            <select
                                value={selected}
                                onChange={(e) => setSelected(e.target.value)}
                            >
                                {devices.length === 0 ? (
                                    <option value="">
                                        Belum pernah terhubung EDC
                                    </option>
                                ) : (
                                    devices.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name} ({d.status})
                                        </option>
                                    ))
                                )}
                            </select>

                            {devices.length === 0 && (
                                <button
                                    type="button"
                                    className="edc-apply"
                                    onClick={() =>
                                        alert("Nanti bisa diarahkan ke form pengajuan EDC")
                                    }
                                >
                                    Ajukan di sini
                                </button>
                            )}
                        </div>

                        <div className="edc-empty">
                            {devices.length === 0 ? (
                                <p>Belum ada data</p>
                            ) : (
                                <div className="edc-info">
                                    <p>
                                        <b>{selectedDevice?.name}</b>
                                    </p>
                                    <span
                                        className={`edc-status ${selectedDevice?.status}`}
                                    >
                                        {selectedDevice?.status === "connected"
                                            ? "Terhubung"
                                            : "Terputus"}
                                    </span>

                                    <div className="edc-actions">
                                        {selectedDevice?.status === "connected" ? (
                                            <button className="btn-outline" onClick={handleDisconnect}>
                                                Disconnect
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn-outline" onClick={handleReconnect}>
                                                    Reconnect
                                                </button>
                                                <button
                                                    className="btn-outline danger"
                                                    onClick={handleDelete}
                                                >
                                                    Hapus
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="edc-btn" onClick={handleAddDevice}>
                            Tambahkan Perangkat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EDC;
