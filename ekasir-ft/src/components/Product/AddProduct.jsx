import React, { useState } from 'react';
import '../../assets/css/product.css';
import imageIcon from '../../assets/icons/camera.png';
import dummyProduct from '../../assets/img/product.png';

const AddProduct = ({ onClose, onSave }) => {
    const [imagePreview, setImagePreview] = useState(dummyProduct);

    const [name, setName] = useState('');
    const [type, setType] = useState('default');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [minStock, setMinStock] = useState('');
    const [code, setCode] = useState('');
    const [priceBase, setPriceBase] = useState('');
    const [priceSell, setPriceSell] = useState('');
    const [rack, setRack] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('gram');
    const [discount, setDiscount] = useState('');
    const [note, setNote] = useState('');

    const [useStock, setUseStock] = useState(true);
    const [showInTransaction, setShowInTransaction] = useState(true);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-add-product">
                <div className="modal-header">
                    <h3>Tambah Barang</h3>
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
                    <label>Nama</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Tipe Barang</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Default">Default</option>
                        <option value="Paket">Paket</option>
                        <option value="Multisatuan">Multisatuan</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Kategori</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Pilih</option>
                        <option value="Snack">Snack</option>
                        <option value="Peralatan Tulis dan Kantor">Peralatan Tulis dan Kantor</option>
                        <option value="Kebutuhan Rumah Tangga">Kebutuhan Rumah Tangga</option>
                    </select>
                </div>

                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Stok *</label>
                        <input
                            value={stock}
                            readOnly={!useStock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Kode Barang</label>
                        <input value={code} onChange={(e) => setCode(e.target.value)} />
                    </div>
                </div>

                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Harga Dasar</label>
                        <div className="input-prefix">
                            <span>Rp</span>
                            <input value={priceBase} onChange={(e) => setPriceBase(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Harga Jual</label>
                        <div className="input-prefix">
                            <span>Rp</span>
                            <input value={priceSell} onChange={(e) => setPriceSell(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Batas Minimum Stok</label>
                        <input value={minStock} onChange={(e) => setMinStock(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Letak Rak</label>
                        <input value={rack} onChange={(e) => setRack(e.target.value)} />
                    </div>
                </div>

                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Berat</label>
                        <input value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Satuan</label>
                        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                            <option value="gram">gram</option>
                            <option value="kg">kg</option>
                            <option value="pcs">pcs</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Diskon</label>
                    <div className="input-prefix">
                        <input value={discount} onChange={(e) => setDiscount(e.target.value)} />
                        <span>%</span>
                    </div>
                </div>

                <div className="form-switches">
                    <label className="switch-item">
                        <input type="checkbox" checked={showInTransaction} onChange={() => setShowInTransaction(!showInTransaction)} />
                        <span className="switch-ui" />
                        <span>Tampilkan di Transaksi</span>
                    </label>
                    <label className="switch-item">
                        <input type="checkbox" checked={useStock} onChange={() => setUseStock(!useStock)} />
                        <span className="switch-ui" />
                        <span>Pakai Stok</span>
                    </label>
                </div>

                <div className="form-group">
                    <label>Keterangan</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} />
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Batal</button>
                    <button
                        className="btn-confirm"
                        onClick={() => {
                            onSave({
                                name,
                                type,
                                category,
                                stock: Number(stock),
                                minStock,
                                code,
                                priceMin: Number(priceBase),
                                priceMax: Number(priceSell),
                                rack,
                                weight,
                                unit,
                                discount,
                                description: note,
                                image: imagePreview,
                            });
                        }}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
