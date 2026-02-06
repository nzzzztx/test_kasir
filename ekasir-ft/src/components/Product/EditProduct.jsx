import React, { useState, useEffect } from 'react';
import '../../assets/css/product.css';
import imageIcon from '../../assets/icons/camera.png';
import productDummy from '../../assets/img/product.png';
import BarcodeScannerModal from "../Transaction/BarcodeScannerModal";

const EditProduct = ({ product, onClose, onSave, categories }) => {
    const [form, setForm] = useState({
        name: '',
        type: '',
        stock: '',
        code: '',
        category: '',
        priceMin: '',
        priceMax: '',
        minStock: '',
        rack: '',
        weight: '',
        unit: 'gram',
        discount: '',
        description: '',
        image: '',
    });
    const [showScanner, setShowScanner] = useState(false);
    const [imagePreview, setImagePreview] = useState(productDummy);

    useEffect(() => {
        if (product) {
            setForm({
                ...product,
                type: product.type || 'default',
                minStock: product.minStock || '',
                rack: product.rack || '',
                weight: product.weight || '',
                unit: product.unit || 'gram',
                discount: product.discount || '',
                description: product.description || '',
            });

            setImagePreview(product.image || productDummy);
        }
    }, [product]);


    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
            setForm((prev) => ({
                ...prev,
                image: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };


    if (!product) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-add-product">
                <div className="modal-header">
                    <h3>Edit Rincian</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="image-upload">
                    <label htmlFor="upload-image" className="image-wrapper">
                        <img src={imagePreview} alt="preview" />
                        <div className="image-edit-icon">
                            <img src={imageIcon} alt="edit" />
                        </div>
                    </label>
                    <input
                        type="file"
                        id="upload-image"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                    />
                </div>

                <div className="form-group">
                    <label>Nama *</label>
                    <input
                        value={form.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Tipe Barang</label>
                    <select
                        value={form.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                    >
                        <option value="Default">Default</option>
                        <option value="Paket">Paket</option>
                        <option value="Multisatuan">Multisatuan</option>
                    </select>
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Stok *</label>
                        <input
                            type="number"
                            value={form.stock || ''}
                            onChange={(e) => handleChange('stock', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kode Barang</label>
                        <div className="barcode-input">
                            <input
                                value={form.code || ""}
                                onChange={(e) => handleChange("code", e.target.value)}
                                placeholder="Scan / isi barcode"
                            />
                            <button
                                type="button"
                                className="barcode-scan-btn"
                                onClick={() => setShowScanner(true)}
                            >
                                Scan
                            </button>
                        </div>
                    </div>
                </div>

                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Harga Dasar</label>
                        <div className="input-prefix">
                            <span>Rp</span>
                            <input
                                type="number"
                                value={form.priceMin || ''}
                                onChange={(e) => handleChange('priceMin', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Harga Jual</label>
                        <div className="input-prefix">
                            <span>Rp</span>
                            <input
                                type="number"
                                value={form.priceMax || ''}
                                onChange={(e) => handleChange('priceMax', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Kategori</label>
                    <select
                        value={form.category || ''}
                        onChange={(e) => handleChange('category', e.target.value)}
                    >
                        <option value="">Pilih</option>

                        {Array.isArray(categories) &&
                            categories.map((cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Batas Minimum Stok</label>
                        <input
                            type="number"
                            value={form.minStock}
                            onChange={(e) => handleChange('minStock', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Letak Rak</label>
                        <input
                            value={form.rack}
                            onChange={(e) => handleChange('rack', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Berat</label>
                        <input
                            type="number"
                            value={form.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Satuan</label>
                        <select
                            value={form.unit}
                            onChange={(e) => handleChange('unit', e.target.value)}
                        >
                            <option value="gram">gram</option>
                            <option value="kg">kg</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Diskon (%)</label>
                    <input
                        type="number"
                        value={form.discount}
                        onChange={(e) => handleChange('discount', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Keterangan</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Batal</button>
                    <button
                        className="btn-confirm"
                        onClick={() => {
                            if (!form.name?.trim()) {
                                alert("Nama barang wajib diisi");
                                return;
                            }

                            if (
                                form.priceMax &&
                                form.priceMin &&
                                Number(form.priceMax) < Number(form.priceMin)
                            ) {
                                alert("Harga jual tidak boleh lebih kecil dari harga dasar");
                                return;
                            }

                            onSave(form);
                        }}
                    >
                        Simpan
                    </button>
                </div>
                {showScanner && (
                    <BarcodeScannerModal
                        onClose={() => setShowScanner(false)}
                        onDetected={(barcode) => {
                            handleChange("code", barcode);
                            setShowScanner(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default EditProduct;
