import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductItem from "./pages/ProductIDetails";
import { UserProvider } from "./hooks/UseUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
	return (
		<UserProvider>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<Navbar />
					<Toaster />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/products" element={<Products />} />
						<Route path="/products/:id" element={<ProductItem />} />
						<Route path="/products/search/:search" element={<Products />} />
						<Route path="/cart" element={<Cart />} />
					</Routes>
					<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
				</QueryClientProvider>
			</BrowserRouter>
		</UserProvider>
	);
}

export default App;
