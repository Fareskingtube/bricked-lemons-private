import type { Product } from "../pages/Products";
import renderStars from "../util/renderStarts";

interface ProductCardProps {
	product: Product;
	addCartButton?: boolean;
	setCart?: React.Dispatch<React.SetStateAction<Product[]>>
}

export function ProductCard({
	product,
	addCartButton = true,
	setCart
}: ProductCardProps) {
	const handleAddCart = () => {
		const storedCart = localStorage.getItem("cart");

		const savedCart: Product[] = storedCart ? JSON.parse(storedCart) : [];

		if (savedCart.includes(product)) return;

		localStorage.setItem("cart", JSON.stringify([...savedCart, product]));
	};

	const handleRemoveCart = () => {
		const storedCart = localStorage.getItem("cart");

		const savedCart: Product[] = storedCart ? JSON.parse(storedCart) : [];

		const newCart = savedCart.filter((filterProduct) => filterProduct.id !== product.id)
		
		localStorage.setItem("cart", JSON.stringify(newCart));
		if (!setCart) return
		setCart(newCart)
	};

	return (
		<div className="w-65 overflow-hidden flex flex-col gap-2 bg-background-100 p-3 rounded-2xl hover:bg-background-200 transition-colors duration-90">
			<h3 className="truncate">{product.name}</h3>
			<img
				src={product.imageLink}
				alt={product.name}
				className="w-65 h-45 object-cover object-center border-6 border-accent-500 rounded-2xl mb-4"
			/>
			<h3 className="text-primary-500">${product.price}</h3>
			<div className="flex -mt-2">
				<div className="flex text-lg">{renderStars(product.reviewRating)}</div>
				<span className="text-text-500 text-sm">
					({product.reviewCount} Reviews)
				</span>
			</div>
			{addCartButton ? (
				<button
					className="group w-fit p-3 rounded-2xl mt-4 mb-1 border-2 border-accent-500 dark:bg-accent-900 bg-accent-100
                transition-colors duration-100 dark:hover:border-accent-100 hover:border-accent-900 dark:hover:bg-secondary-300 hover:bg-secondary-800"
					onClick={handleAddCart}
				>
					<span
						className="font-bold dark:text-accent-100 text-accent-900 dark:group-hover:text-accent-900 group-hover:text-accent-100
                    transition-colors duration-100"
					>
						Add to Cart
					</span>
				</button>
			) : (
				<button
					className="w-fit p-3 rounded-2xl mt-4 mb-1 bg-red-600 hover:bg-red-400 transition-colors duration-100 "
					onClick={handleRemoveCart}
				>
					<span
						className="font-bold dark:text-accent-100 text-accent-900"
					>
						Remove
					</span>
				</button>
			)}
		</div>
	);
}
