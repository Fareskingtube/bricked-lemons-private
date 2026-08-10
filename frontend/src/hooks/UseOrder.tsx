import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";

async function postOrder() {
	const res = await api.post("/orders/");
	return res.data;
}
export const usePostOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
};
