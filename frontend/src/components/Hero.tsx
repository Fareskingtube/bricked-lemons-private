import { Link } from "react-router-dom";

function Hero() {
	return (
		<div className="w-screen h-[60vh] bg-linear-to-r from-primary-500 to-secondary-500 p-10 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
			<div className="flex flex-col gap-5">
				<h1 className="text-accent-800 dark:text-accent-200">
					From Useless Lemons To Gaming Beasts.
				</h1>
				<p className="mb-5">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
					minima placeat repellat id officia voluptatum ipsum eveniet quo sequi,
					unde natus aut itaque fugit reiciendis, facilis culpa neque totam
					ipsam!
				</p>
                <Link to="products" className="w-fit px-3 py-2.5 rounded-4xl bg-linear-to-br from-secondary-400 dark:from-secondary-600 to-accent-500 transition-transform duration-100 ease-in-out hover:scale-105 not-sm:self-center shadow shadow-black/30">
                    <h3 className="dark:text-text-100 text-text-900 font-bold">Shop Now</h3>
                </Link>
			</div>
            <img src="black-desktop-pc-png-image-21.png" className="h-full -mt-15 ml-10 not-md:hidden shrink-0" />
		</div>
	);
}

export default Hero;
