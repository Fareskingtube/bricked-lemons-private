import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import type { CartItem } from "../pages/Cart";
import type { Product } from "../pages/Products";
import renderStars from "../util/renderStarts";
import { Link } from "react-router-dom";

interface ProductCardProps {
	product: Product;
	quantity?: number;
	setCart?: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function ProductCard({ product, quantity, setCart }: ProductCardProps) {
	const handleChangeQuantity = (add: boolean) => {
		const storedCart = localStorage.getItem("cart");
		const savedCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

		const cartItem = savedCart.find((item) => item.product.id === product.id);

		if (!cartItem) return;
		if (add) {
			cartItem.quantity += 1;
		} else {
			if (cartItem.quantity - 1 <= 0) {
				handleRemoveCart();
				return;
			}
			cartItem.quantity -= 1;
		}

		localStorage.setItem("cart", JSON.stringify(savedCart));

		if (!setCart) return;
		setCart(savedCart);
	};

	const handleAddCart = () => {
		const storedCart = localStorage.getItem("cart");

		const savedCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

		const cartItemExists = savedCart.find(
			(item) => item.product.id === product.id,
		);

		if (cartItemExists) {
			handleChangeQuantity(true);
			return;
		}

		const newCartItem: CartItem = {
			product: product,
			quantity: 1,
		};

		localStorage.setItem("cart", JSON.stringify([...savedCart, newCartItem]));
	};

	const handleRemoveCart = () => {
		const storedCart = localStorage.getItem("cart");

		const savedCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

		const newCart = savedCart.filter(
			(filterProduct) => filterProduct.product.id !== product.id,
		);

		localStorage.setItem("cart", JSON.stringify(newCart));

		if (!setCart) return;
		setCart(newCart);
	};

	return (
		<Link
			to={`/products/${product.id}`}
			className="w-65 overflow-hidden flex flex-col gap-2 bg-background-100 p-3 rounded-2xl hover:bg-background-200 transition-colors duration-90"
		>
			<h3 className="truncate">{product.name}</h3>
			<img
				src={product.imageUrls[0]}
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
			{!quantity ? (
				<button
					className="group w-fit p-3 rounded-2xl mt-4 mb-1 border-2 border-accent-500 dark:bg-accent-900 bg-accent-100
                transition-all duration-100 active:scale-95 dark:hover:border-accent-100 hover:border-accent-900 dark:hover:bg-secondary-300 
				hover:bg-secondary-800"
					onClick={(e) => {
						e.preventDefault();
						handleAddCart();
					}}
				>
					<span
						className="font-bold dark:text-accent-100 text-accent-900 dark:group-hover:text-accent-900 group-hover:text-accent-100
                    transition-colors duration-100"
					>
						Add to Cart
					</span>
				</button>
			) : (
				<div className="flex justify-between mt-4 mb-1">
					<button
						className="w-fit p-3 rounded-2xl bg-red-600 hover:bg-red-400 transition-all duration-100 active:scale-95"
						onClick={(e) => {
							e.preventDefault();
							handleRemoveCart();
						}}
					>
						<span className="font-bold dark:text-accent-100 text-accent-900">
							Remove
						</span>
					</button>
					<div className="flex items-center gap-2 text-2xl text-text-900">
						<button className="cursor-pointer">
							<AiOutlineMinusCircle
								onClick={(e) => {
									e.preventDefault();
									handleChangeQuantity(false);
								}}
							/>
						</button>
						<span>{quantity}</span>
						<button
							className="cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								handleChangeQuantity(true);
							}}
						>
							<AiOutlinePlusCircle />
						</button>
					</div>
				</div>
			)}
		</Link>
	);
}
