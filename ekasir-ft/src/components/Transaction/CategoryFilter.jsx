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
                    className={cat === active ? "active" : ""}
                    onClick={() => setActive(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
