import { BiCart } from "react-icons/bi"; 
import { AiOutlineUser } from "react-icons/ai"; 
import { BiSearchAlt2 } from "react-icons/bi"; 
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineDown } from "react-icons/ai";
import { Link } from "react-router-dom";

function Navbar() {
	return (
		<nav className="w-screen fixed">
			<div className="bg-background-50 flex py-2.5 px-2 items-center justify-between">
				<div className="flex items-center lg:gap-15 gap-2">
					<Link to="/">
						<h1 className="text-primary-500">Bricked Lemons</h1>
					</Link>
					<div className="flex lg:gap-8 gap-2">
						<Link to="/deals" className="flex items-center">
							<h2>Deals</h2>
							<BiChevronDown className="text-text-900 w-5" />
						</Link>
						<Link to="/new">
							<h2>What's New</h2>
						</Link>
						<Link to="/deals">
							<h2>Deals</h2>
						</Link>
					</div>
				</div>
				<div className="flex gap-5 mr-3">
					<div className="flex flex-1 items-center justify-between lg:w-[33vw] pr-2 pl-2.5 py-0.5 bg-background-200 rounded-xl shadow-lg dark:focus-within:shadow-accent-600/20 focus-within:shadow-accent-400/60 transition-all duration-200 ">
						<input type="text" className="w-[90%] h-full outline-none ring-0 text-text-900 placeholder:opacity-25 placeholder:text-text-600" placeholder="Search..." />
                        <BiSearchAlt2 className="text-2xl text-secondary-500" />
					</div>
					<Link to="/login" className="rounded-4xl flex items-center gap-1 text-text-900">
						<AiOutlineUser className="text-3xl " /> Account
					</Link>
					<Link to="/cart" className="rounded-4xl text-text-900">
						<BiCart className="text-3xl" />
					</Link>
				</div>
			</div>
			<hr className="w-full border-t-background-100" />
		</nav>
	);
}
<AiOutlineDown />;

export default Navbar;
