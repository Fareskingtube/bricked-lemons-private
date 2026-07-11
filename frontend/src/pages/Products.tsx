import { Select } from "../components/Select";
import { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import api from "../config/axios";
import { Link } from "react-router-dom";

export interface product {
	id: string;
	name: string;
	price: number;
	category: string;
	createdAt: string;
}

function Products() {
	const [loading, setLoading] = useState(false);
	const [currentPage, setcurrentPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [category, setCategory] = useState("");
	const [products, setProducts] = useState<product[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			const res = await api.get(
				`/products/?limit=${limit}&page=${currentPage}&category=${category}`,
			);
			setProducts(res.data?.data);
			setLoading(false);
		};
		fetchProducts();
	}, [currentPage, limit, category]);

	return (
		<div className="flex flex-col gap-13">
			<div className="w-screen h-[30vh] px-10">
				<div
					className="bg-background-100 w-full h-full grid grid-cols-1 md:grid-cols-2 
                overflow-hidden"
				>
					<div className="pl-5 flex flex-col gap-5">
						<h1 className="text-[clamp(1.8rem,3vw,5rem)] text-accent-600">
							Get All The PC Components You Need Here.
						</h1>
						<Link
							to="products"
							className="ml-4 w-fit p-3 bg-secondary-200 rounded-4xl hover:scale-110 
                            transition-all duration-100 not-md:self-center not-md:ml-0 not-md:mt-10"
						>
							<span className="font-bold text-accent-900">Buy Now</span>
						</Link>
					</div>
					<img
						src="https://freepngimg.com/thumb/computer/32745-9-gaming-computer-transparent.png"
						className="h-[30vh] not-md:hidden shrink-0 self-center justify-self-center -mr-30"
					/>
				</div>
			</div>
			<div className="flex gap-10 mx-10">
				<Select name="Category" options={["GPU", "CPU", "RAM", "Storage", "Monitor", "Peripherals"]} setValue={setCategory} />
			</div>
			{/* <ProductList products={products} /> */}
		</div>
	);
}

export default Products;
