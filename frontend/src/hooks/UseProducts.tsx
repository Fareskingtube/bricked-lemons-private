import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../config/axios";

interface ProductsParams {
	limit: number;
	page: number;
	category: string;
	minPrice: number | string;
	maxPrice: number | string;
	orderBy: string;
	orderDirection: string;
	search: string;
}

async function fetchProducts(params: ProductsParams) {
	const res = await api.get("/products/", { params });
	return res.data;
}

export function useProducts(params: ProductsParams) {
	return useQuery({
		queryKey: ["products", params],
		queryFn: () => fetchProducts(params),
		placeholderData: keepPreviousData,
	});
}

async function fetchProductById(id: string) {
	const res = await api.get(`/products/${id}`);
	return res.data;
}

export function useProductById(id: string | undefined) {
	return useQuery({
		queryKey: ["productById", id],
		queryFn: () => fetchProductById(id as string),
		placeholderData: keepPreviousData,
	});
}