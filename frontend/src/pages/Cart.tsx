import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { Link } from "react-router-dom";
import { usePostOrder, type CartItem } from "../hooks/UseOrder";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

function Cart() {
	const [cart, setCart] = useState<CartItem[]>(() => {
		try {
			const storedCart = localStorage.getItem("cart");
			return storedCart ? JSON.parse(storedCart) : [];
		} catch {
			return [];
		}
	});

	const {
		mutate: postOrder,
		isSuccess: isSuccess,
		isPending: isPending,
		error: error,
	} = usePostOrder();

	const handleCreateOrder = () => {
		if (!cart || cart.length === 0) {
			toast.error("Cart is empty");
			return;
		}
		postOrder({ CartItems: cart });
	};


	useEffect(() => {
		
		if (isPending) {
			return
        }
        
        
		if (isSuccess) {
			toast.success("Order created successfully");
		}
		
		if (error) {
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
        }
	}, [error, isSuccess, isPending]);

	return (
		<div className="w-screen h-screen mt-10">
			<div
				className="p-5 mx-10 bg-background-300 dark:bg-background-50 dark:border-2 dark:border-background-100 min-h-[80vh] flex flex-col gap-2 
            justify-between items-center rounded-2xl"
			>
				<h1>
					Cart (
					{cart.reduce(
						(accumulator, currentItem) => accumulator + currentItem.quantity,
						0,
					)}{" "}
					Items)
				</h1>
				<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full gap-4 items-center justify-center">
					{cart.map((cartItem) => (
						<ProductCard
							key={cartItem.product.id}
							product={cartItem.product}
							quantity={cartItem.quantity}
							setCart={setCart}
						/>
					))}
				</div>
				<div className="flex flex-col items-center">
					<div className="flex">
						<h1>Total: </h1>
						<h1 className="text-primary-500">
							$
							{cart.reduce(
								(accumulator, currentItem) =>
									accumulator +
									currentItem.product.price * currentItem.quantity,
								0,
							)}
						</h1>
					</div>
					<button
						onClick={handleCreateOrder}
						className="w-fit p-3 rounded-2xl mt-4 mb-1 bg-primary-500 hover:bg-primary-600 transition-colors duration-100 "
					>
						<span className="font-bold dark:text-accent-100 text-accent-900">
							Buy Now
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Cart;
