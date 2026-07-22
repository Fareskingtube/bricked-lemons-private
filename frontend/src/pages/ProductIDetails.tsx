import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import type { Product } from "./Products";
import toast from "react-hot-toast";
import renderStars from "../util/renderStarts";
import type { CartItem } from "../hooks/UseOrder";
import { useProductById } from "../hooks/UseProducts";

function ProductItem() {
	const { id } = useParams();

	const [currentImage, setCurrentImage] = useState(0);

	const { data, error } = useProductById(id);


	const product: Product = data?.data;

	useEffect(() => {
		if (!error) return
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
	}, [error]);

	const handleAddQuantity = () => {
		const storedCart = localStorage.getItem("cart");
		const savedCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

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

	return product ? (
		<div className="flex flex-col gap-10 w-screen p-10 pl-5 mt-5">
			<div className="flex gap-5">
				<div className="flex gap-2">
					<div className="flex flex-col gap-2 overflow-y-auto scrollbar-none w-40 h-[50vh]">
						{product?.imageUrls.map((image, index) => (
							<button
								key={image}
								className="group cursor-pointer"
								onClick={() => {
									setCurrentImage(index);
								}}
							>
								<img
									src={image}
									alt={`${product?.name} Image ${currentImage}`}
									className={`rounded-2xl ${index === currentImage ? "border-accent-500 border-3" : "border-background-300 border-2"} group-hover:border-accent-800 object-cover object-center`}
								/>
							</button>
						))}
					</div>
					<img
						src={product?.imageUrls?.[currentImage]}
						alt={`${product?.name} Image ${currentImage}`}
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
				<p>{product?.description}</p>
			</div>
		</div>
	) : (
		<h1>Loading...</h1>
	);
}

export default ProductItem;
