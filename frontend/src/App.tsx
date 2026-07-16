import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import api from "./config/axios";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductItem from "./pages/ProductItem";

export interface User {
	id: string;
	username: string;
	role: string;
}

interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

function App() {
	
	// Creating user state to put in the UserContext
	const [user, setUser] = useState<User | null>(null);
	// Fetching current user info setting it to user state (Uses the JWT from HTTP only cookie to get current user)
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await api.get("/auth/me");
				const fetchedUser: User = {
					id: res.data?.id,
					username: res.data?.username,
					role: res.data?.role,
				};
				console.log(fetchedUser);
				
				setUser(fetchedUser);
			} catch (error: unknown) {
				setUser(null);
				console.error(error);
			}
		};
		if (!user) return
		fetchUser();
	}, [user]);

	return (
		<UserContext.Provider value={{user, setUser}}>
			<BrowserRouter>
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
			</BrowserRouter>
		</UserContext.Provider>
	);
}

export default App;
