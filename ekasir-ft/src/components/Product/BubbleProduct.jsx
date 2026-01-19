const BubbleProduct = ({ categories, active, onChange }) => {
    return (
        <div className="product-filters">
            {categories.map(cat => (
                <button
                    key={cat}
                    className={`filter-chip ${active === cat ? 'active' : ''}`}
                    onClick={() => onChange(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default BubbleProduct;
