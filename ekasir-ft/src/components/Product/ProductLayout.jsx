import SearchProduct from './SearchProduct';
import BubbleProduct from './BubbleProduct';
import ListProduct from './ListProduct';
import DetailProduct from './DetailProduct';

const ProductLayout = ({
    products,
    categories,
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    selectedProduct,
    setSelectedProduct,
}) => {
    return (
        <div className="product-layout">
            {/* LEFT */}
            <div className="product-list">
                <SearchProduct value={search} onChange={setSearch} />

                <BubbleProduct
                    categories={categories}
                    active={activeCategory}
                    onChange={setActiveCategory}
                />

                <ListProduct
                    products={products}
                    selectedProduct={selectedProduct}
                    onSelect={setSelectedProduct}
                />

                <button className="btn-add-product">+ Tambah Barang</button>
            </div>

            {/* RIGHT */}
            <DetailProduct product={selectedProduct} />
        </div>
    );
};

export default ProductLayout;
