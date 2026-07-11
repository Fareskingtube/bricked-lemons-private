import { BiChevronRight } from "react-icons/bi";
import { BiChevronLeft } from "react-icons/bi";
import { BiLastPage } from "react-icons/bi";
import { BiFirstPage } from "react-icons/bi";
import { Select } from "../components/Select";
import { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import api from "../config/axios";
import { Link, useParams } from "react-router-dom";
import getPageSelectorList from "../util/pageSelectorHelper";

export interface Product {
	id: string;
	name: string;
	price: number;
	category: string;
	imageLink: string;
	reviewRating: number;
	reviewCount: number;
	createdAt: string;
}

function Products() {
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(20);
	const [maxPrice, setMaxPrice] = useState<number | string>("");
	const [minPrice, setMinPrice] = useState<number | string>("");
	const [category, setCategory] = useState("");
	const [products, setProducts] = useState<Product[]>([]);
	const [sortBy, setSortBy] = useState("");
	const [sortDir, setSortDir] = useState("");

	const { search } = useParams();

	
	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			const res = await api.get(
				`/products/?limit=${limit || 20}&page=${currentPage}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&orderBy=${sortBy}&orderDirection=${sortDir || "asc"}&search=${search || ""}`,
			);
			setProducts(res.data?.data);
			setTotalPages(res.data?.pagination?.totalPages);
			setLoading(false);
		};
		fetchProducts();
	}, [currentPage, limit, category, minPrice, maxPrice, sortBy, sortDir, search]);

	const pageSelectorList = getPageSelectorList(totalPages, currentPage);

	return (
		<div className="flex flex-col gap-13">
			{/* Hero */}
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
							to="/cart"
							className="ml-4 w-fit p-3 dark:bg-secondary-200 bg-secondary-500 rounded-4xl hover:scale-110 
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
			{/* Filters and Sort */}
			<div className="flex justify-between mx-10">
				<div className="flex gap-5">
					<Select
						name="Category"
						options={["GPU", "CPU", "RAM", "Storage", "Monitor", "Peripherals"]}
						setValue={setCategory}
					/>
					<Select
						name="Limit"
						options={[5, 10, 20, 30, 50, 100]}
						setValue={setLimit}
					/>
					<Select
						name="Min Price"
						options={[10, 100, 200, 300, 400, 500, 800, 1000, 1200]}
						values={[9, 99, 199, 299, 399, 499, 799, 999, 1199]}
						setValue={setMinPrice}
					/>
					<Select
						name="Max Price"
						options={[30, 100, 200, 300, 400, 500, 800, 1000, 1200, 1600]}
						setValue={setMaxPrice}
					/>
				</div>
				<div className="flex gap-5">
					<Select
						name="Sort Direction"
						options={["Ascending", "Descending"]}
						values={["asc", "desc"]}
						setValue={setSortDir}
					/>
					<Select
						name="Sort By"
						options={["Recent", "Price", "Rating", "Name"]}
						values={["createdAt", "price", "reviewRating", "name"]}
						setValue={setSortBy}
					/>
				</div>
			</div>
			{/* Products */}
			{loading ? (
				<h1 className="mx-10">Loading...</h1>
			) : (
				<ProductList products={products} />
			)}
			{/* Pagination Selector */}
			<div className="flex justify-center items-center h-[10vh] -mt-10">
				<button
					className="hover:cursor-pointer"
					onClick={() => setCurrentPage(1)}
				>
					<BiFirstPage className="text-accent-900 hover:text-accent-700 text-4xl" />
				</button>
				<button
					className="hover:cursor-pointer"
					onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
				>
					<BiChevronLeft className="text-accent-900 hover:text-accent-700 text-4xl" />
				</button>
				<div className="flex gap-2">
					{pageSelectorList.map((num) => (
						<button
							className="hover:cursor-pointer"
							onClick={() => setCurrentPage(num)}
							key={num}
						>
							<span
								className={`text-3xl font-semibold p-1 hover:text-accent-700 ${currentPage === num ? "text-accent-500" : "text-accent-800"}`}
							>
								{num}
							</span>
						</button>
					))}
				</div>
				<button
					className="hover:cursor-pointer"
					onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
				>
					<BiChevronRight className="text-accent-900 hover:text-accent-700 text-4xl" />
				</button>
				<button
					className="hover:cursor-pointer"
					onClick={() => setCurrentPage(totalPages)}
				>
					<BiLastPage className="text-accent-900 hover:text-accent-700 text-4xl" />
				</button>
			</div>
		</div>
	);
}

export default Products;
