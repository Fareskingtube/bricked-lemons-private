import { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import api from "../config/axios";


export interface product {
	id: string;
	name: string;
	price: number;
	category: string;
	createdAt: string;
}

function Products() {

    const [loading, setLoading] = useState(false)
    const [currentPage, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [category, setCategory] = useState(2)
    const [products, setProducts] = useState<product[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            const res = await api.get(`/products/?limit=${limit}&page=${currentPage}&category=${category}`)
            setProducts(res.data?.data)
            setLoading(false)
        }
        fetchProducts()
    }, [currentPage, limit, category])


	return <div>
        <ProductList products={products} />
    </div>;
}

export default Products;
