import { type PropsWithChildren } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type User } from "../App";
import api from "../config/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface DropdownProps {
	isOpen: boolean;
	user: User | null;
	setUser: (user: User | null) => void;
	handleToggle: () => void;
}

function Dropdown({
	user,
	isOpen,
	setUser,
	handleToggle,
	children,
}: PropsWithChildren<DropdownProps>) {
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			await api.post("/auth/logout");
			setUser(null);
			handleToggle();
			navigate("/", { replace: true });
			toast.success("Logged out successfully");
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message);
			} else {
				toast.error("An unexpected error has occurred");
			}
			console.error(error);
		}
	};

	return (
		<div className="relative inline-block text-left">
			<div>{children}</div>

			{isOpen && (
				<div
					className="origin-top-right absolute right-0 mt-2 w-56 
                    rounded-md shadow-lg bg-background-100 ring-1 ring-black
                    focus:outline-none"
				>
					{user ? (
						<div className="py-1" role="none">
							<Link
								to="/profile"
								className="block px-4 py-2 text-sm text-gray-700
                            hover:bg-background-200"
								onClick={handleToggle}
							>
								Profile
							</Link>
							{user?.role === "ADMIN" && (
								<Link
									to="/admin"
									className="block px-4 py-2 text-sm text-red-400
                            hover:bg-background-200"
									onClick={handleToggle}
								>
									Logout
								</Link>
							)}
							<button
								className="block w-full text-start px-4 py-2 text-sm text-red-400
                            hover:bg-background-200"
								onClick={handleLogout}
							>
								Logout
							</button>
						</div>
					) : (
						<div className="py-1" role="none">
							<Link
								to="/login"
								className="block px-4 py-2 text-sm text-gray-100
                            hover:bg-background-200"
								onClick={handleToggle}
							>
								Login
							</Link>
							<Link
								to="/register"
								className="block px-4 py-2 text-sm text-gray-100
                            hover:bg-background-200"
								onClick={handleToggle}
							>
								Register
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default Dropdown;
