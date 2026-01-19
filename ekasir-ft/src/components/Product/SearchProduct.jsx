const SearchProduct = ({ value, onChange }) => {
    return (
        <input
            className="product-search"
            placeholder="Cari barang..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default SearchProduct;
