import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	type ReactNode,
} from "react";
import api from "../config/axios";

export interface User {
	id: string;
	username: string;
	email: string;
	role: string;
	imageUrl?: string;
}

interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	loading: boolean;
	fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// Exposed for manual re-syncs
	const fetchUser = useCallback(async () => {
		try {
			const res = await api.get("/auth/me");
			const fetchedUser: User = {
				id: res.data?.id,
				username: res.data?.username,
				email: res.data?.email,
				role: res.data?.role,
				imageUrl: res.data?.imageUrl,
			};
			setUser(fetchedUser);
		} catch (error: unknown) {
			console.error("Failed to fetch current user:", error);
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		let isMounted = true;

		const checkSession = async () => {
			try {
				const res = await api.get("/auth/me");
				if (!isMounted) return;

				const fetchedUser: User = {
					id: res.data?.id,
					username: res.data?.username,
					email: res.data?.email,
					role: res.data?.role,
					imageUrl: res.data?.imageUrl,
				};
				setUser(fetchedUser);
			} catch (error: unknown) {
				if (!isMounted) return;
				console.error("Failed to fetch current user:", error);
				setUser(null);
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		checkSession();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
			{children}
		</UserContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
