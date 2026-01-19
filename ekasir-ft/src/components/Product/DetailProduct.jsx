const DetailProduct = ({ product }) => {
    if (!product) {
        return (
            <div className="product-detail">
                <p className="empty-detail">Tidak ada barang yang dipilih</p>
            </div>
        );
    }

    return (
        <div className="product-detail">
            <div className="product-detail-header">
                <h3>Rincian Barang :</h3>
                <div className="detail-actions">
                    <button className="btn-edit-product">Edit</button>
                    <button className="btn-delete-product">Hapus</button>
                </div>
            </div>

            <ul className="detail-list">
                <li><b>Nama:</b> {product.name}</li>
                <li><b>Kategori:</b> {product.category}</li>
                <li><b>Stok:</b> {product.stock}</li>
            </ul>
        </div>
    );
};

export default DetailProduct;
