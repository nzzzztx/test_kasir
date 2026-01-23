const CategoryFilter = ({ products = [], active, setActive }) => {
    const categories = [
        "Semua",
        ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];

    return (
        <div className="category-filter">
            {categories.map((cat) => (
                <button
                    key={cat}
                    type="button"
                    className={`category-chip ${cat === active ? "active" : ""}`}
                    onClick={() => setActive(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
