const ItemProduct = ({ product, active, onClick }) => {
    return (
        <div className={`product-item ${active ? 'active' : ''}`} onClick={onClick}>
            <div className="product-info">
                <strong>{product.name}</strong>
                <span>{product.category}</span>
            </div>
            <span className="product-stock">{product.stock}</span>
        </div>
    );
};

export default ItemProduct;
