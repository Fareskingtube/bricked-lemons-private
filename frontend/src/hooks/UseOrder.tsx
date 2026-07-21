import {
	useMutation,
} from "@tanstack/react-query";
import api from "../config/axios";
import type { Product } from "../pages/Products";

export interface CartItem {
	product: Product;
	quantity: number;
}

export interface Cart {
    CartItems: CartItem[]
}

async function postOrder(params: Cart) {
	const res = await api.post("/orders/", { items: params.CartItems } );
	return res.data;
}
export const usePostOrder = () => {
	return useMutation({
		mutationFn: postOrder,
	});
};
