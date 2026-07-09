import CategoryCard from "../components/CategoryCard";
import Hero from "../components/Hero";

function Home() {
	return (
		<>
			<Hero />
			<div className="pt-5 px-10">
				<h2>Top Categories</h2>
				<div className="grid grid-cols-6 not-md:grid-cols-3 not-md:gap-5 gap-10 mt-3">
					<CategoryCard title="CPUs" variant="amber">
						<img
							src="AMD-Ryzen-5-3600_-1.png"
							alt="CPU Picture"
							className="scale-100"
						/>
					</CategoryCard>

					<CategoryCard title="GPUs" variant="cosmic">
						<img
							src="pngtree-gpu-power-phases-png-image_15512252.png"
							alt="GPU Picture"
							className="scale-150"
						/>
					</CategoryCard>
					<CategoryCard title="Motherboards" variant="grape">
						<img
							src="intel-asus-rog-strix-z370-h-gaming-motherboard-atx-lga1151-socket-z370-lga1151-socket-lga-1151-intel-removebg-preview.png"
							alt="Motherboard Picture"
							className="scale-150"
						/>
					</CategoryCard>

					<CategoryCard title="RAM" variant="rainbow">
						<img
							src="RAM-PC-Component-Computer-Memory-PNG-768x572-removebg-preview.png"
							alt="RAM Picture"
							className="scale-150 rotate-15"
						/>
					</CategoryCard>
					<CategoryCard title="Cases" variant="amber">
						<img
							src="01_North-Momentum-Edition_Left-Front-1-540x540.webp"
							alt="Case Picture"
							className="scale-150"
						/>
					</CategoryCard>
					<CategoryCard title="Storage" variant="fuchsia">
						<img
							src="2t_05dccd58c7.webp"
							alt="GPU Picture"
							className="scale-170 rotate-2 -mr-5 -mt-4"
						/>
					</CategoryCard>
				</div>
			</div>
			<div className="h-20"></div>
		</>
	);
}

export default Home;
