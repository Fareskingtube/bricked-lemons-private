import type { product } from "../pages/Products";

interface ProductListProps {
    products: product[]
}

function ProductList({ products }: ProductListProps) {
	return <div>
        {products.map(product => (
            <div key={product.id}>
                <span>{product.name}</span>
            </div>
        ) )}
    </div>;
}

export default ProductList;
