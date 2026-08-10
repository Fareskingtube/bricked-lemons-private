import {
	useMutation,
} from "@tanstack/react-query";
import api from "../config/axios";
import type { CartItem } from "./UseCart";



async function postOrder(params: CartItem[]) {
	const res = await api.post("/orders/", { items: params } );
	return res.data;
}
export const usePostOrder = () => {
	return useMutation({
		mutationFn: postOrder,
	});
};
