import { useEffect, useState } from "react";
import type { Product } from "./Products";
import { ProductCard } from "../components/ProductCard";
import { Link } from "react-router-dom";

function Cart() {
	const [cart, setCart] = useState<Product[]>([]);

	useEffect(() => {
		const storedCart = localStorage.getItem("cart");

		const savedCart: Product[] = storedCart ? JSON.parse(storedCart) : [];
		setCart(savedCart);
	}, []);

	return (
		<div className="w-screen h-screen mt-10">
			<div className="p-5 mx-10 bg-background-300 dark:bg-background-50 dark:border-2 dark:border-background-100 min-h-[80vh] flex flex-col gap-2 
            justify-between items-center rounded-2xl">
				<h1>Cart ({cart.length} Items)</h1>
				<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full gap-4 items-center justify-center">
					{cart.map((product) => (
						<ProductCard
							product={product}
							addCartButton={false}
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
								(accumulator, currentItem) => accumulator + currentItem.price,
								0,
							)}
						</h1>
					</div>
					<Link
                        to={"/checkout"}
						className="w-fit p-3 rounded-2xl mt-4 mb-1 bg-primary-500 hover:bg-primary-600 transition-colors duration-100 "
					>
						<span
							className="font-bold dark:text-accent-100 text-accent-900"
						>
							Buy Now
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Cart;
