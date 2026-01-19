import ItemProduct from './ItemProduct';

const ListProduct = ({ products, selectedProduct, onSelect }) => {
    if (products.length === 0) {
        return <div className="product-empty">Tidak ada barang</div>;
    }

    return (
        <div className="product-items">
            {products.map(p => (
                <ItemProduct
                    key={p.id}
                    product={p}
                    active={selectedProduct?.id === p.id}
                    onClick={() => onSelect(p)}
                />
            ))}
        </div>
    );
};

export default ListProduct;
