import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../config/axios";
import { AxiosError } from "axios";
import type { Product } from "./Products";
import toast from "react-hot-toast";
import renderStars from "../util/renderStarts";
import type { CartItem } from "./Cart";

function ProductItem() {
	const { id } = useParams();

	const [product, setProduct] = useState<Product | null>();

	useEffect(() => {
		try {
			const fetchProducts = async () => {
				const res = await api.get(`/products/${id}`);

				setProduct(res.data?.data);
			};
			fetchProducts();
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response) {
					// The server responded with a status code outside the 2xx range
					console.error("Server Error Data:", error.response.data);
					console.error("Status Code:", error.response.status);

					// Target your API's custom message layout (e.g., { message: "..." })
					const apiMessage =
						error.response.data?.message || "Server error occurred";
					toast.error(`Error: ${apiMessage}`);
				} else if (error.request) {
					// The request was made but no response was received (e.g., network down)
					console.error("No Response Received:", error.request);
					toast.error("Network error: Couldn't Connect to servers.");
				} else {
					// Something happened setting up the request
					console.error("Request Setup Error:", error.message);
					toast.error(`Config Error: ${error.message}`);
				}
			} else {
				toast.error("An unexpected error has occurred");
			}
			console.error(error);
		}
	}, []);

	const handleAddQuantity = () => {
		const storedCart = localStorage.getItem("cart");
		let savedCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

		if (!product) return;
		const cartItem = savedCart.find((item) => item.product.id === product.id);

		if (!cartItem) return;
		cartItem.quantity += 1;

		localStorage.setItem("cart", JSON.stringify(savedCart));
	};

	const handleAddCart = () => {
		const storedCart = localStorage.getItem("cart");

		const savedCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

		if (!product) return;
		const cartItemExists = savedCart.find(
			(item) => item.product.id === product.id,
		);

		if (cartItemExists) {
			handleAddQuantity();
			return;
		}

		const newCartItem: CartItem = {
			product: product,
			quantity: 1,
		};

		localStorage.setItem("cart", JSON.stringify([...savedCart, newCartItem]));
	};

	return (
		product && (
			<div className="flex flex-col gap-10 w-screen p-10 mt-5">
				<div className="flex gap-5">
					<div>
						<img
							src={product?.imageLink}
							alt=""
							className="w-[clamp(15rem,35vw,25rem)] object-cover object-center border-6 border-accent-500 rounded-2xl"
						/>
					</div>
					<div className="flex flex-col">
						<h2>{product?.name}</h2>
						<h3 className="-mt-1.5">Category: {product?.category}</h3>
						<div className="flex mt-1">
							<div className="flex text-lg">
								{renderStars(product.reviewRating)}
							</div>
							<span className="text-text-500 text-sm">
								&nbsp;({product.reviewCount} Reviews)
							</span>
						</div>
						{/* Div for if there are discounts */}
						<div className="mt-5">
							<h2 className="text-primary-600">${product?.price}</h2>
						</div>
						<button
							className="group w-fit p-3 rounded-2xl mt-8 transition-all duration-150 dark:border-accent-100 dark:bg-secondary-300 
                            bg-secondary-800 hover:scale-110 active:scale-100"
							onClick={handleAddCart}
						>
							<span className="font-bold dark:text-accent-900 text-accent-100">
								Add to Cart
							</span>
						</button>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h3>Description:</h3>
					<p>
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente,
						provident expedita aspernatur optio aut voluptas placeat ut quae
						iusto veniam sit vero eum impedit soluta tempore suscipit odit
						asperiores odio, quos excepturi. Iste doloribus non dignissimos
						harum, dolore optio nam quo delectus obcaecati numquam eos veniam
						quae reprehenderit in totam.
					</p>
				</div>
			</div>
		)
	);
}

export default ProductItem;
