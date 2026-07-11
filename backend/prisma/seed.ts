import { PrismaClient } from "../src/generated/prisma/index.js";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

// 1. Set up the native pg connection pool using your environment variable
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Pass the adapter directly into the constructor to satisfy engineType = "client"
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("Starting database seeding with Driver Adapter...");

	// Clean out existing data
	await prisma.product.deleteMany();
	await prisma.user.deleteMany();
	const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || "admin";
	const adminEmail =
		process.env.DEFAULT_ADMIN_EMAIL || "admin@brickedlemons.com";
	const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Change_Me";
	const hashedPassword = await bcrypt.hash(adminPassword, 12);
	console.log("Seeding users...");
	await prisma.user.create({
		data: {
			username: adminUsername,
			email: adminEmail,
			password: hashedPassword,
			role: "ADMIN",
		},
	});

	console.log("Seeding products...");
	await prisma.product.createMany({
		data: [
    // --- GPUs ---
    { 
      name: "NVIDIA GeForce RTX 4090 24GB", 
      price: 1599.99, 
      category: "GPU", 
      imageLink: "https://www.hellotech.com/blog/wp-content/uploads/2020/02/what-is-a-gpu-770x462.jpg" 
    },
    { 
      name: "NVIDIA GeForce RTX 4080 Super 16GB", 
      price: 999.99, 
      category: "GPU", 
      imageLink: "https://www.hellotech.com/blog/wp-content/uploads/2020/02/what-is-a-gpu-770x462.jpg" 
    },
    { 
      name: "NVIDIA GeForce RTX 4070 Ti Super 16GB", 
      price: 799.99, 
      category: "GPU", 
      imageLink: "https://www.hellotech.com/blog/wp-content/uploads/2020/02/what-is-a-gpu-770x462.jpg" 
    },
    { 
      name: "AMD Radeon RX 7900 XTX 24GB", 
      price: 929.99, 
      category: "GPU", 
      imageLink: "https://www.hellotech.com/blog/wp-content/uploads/2020/02/what-is-a-gpu-770x462.jpg" 
    },
    { 
      name: "AMD Radeon RX 7800 XT 16GB", 
      price: 499.99, 
      category: "GPU", 
      imageLink: "https://www.hellotech.com/blog/wp-content/uploads/2020/02/what-is-a-gpu-770x462.jpg"},

    // --- CPUs ---
    { 
      name: "AMD Ryzen 7 7800X3D", 
      price: 369.99, 
      category: "CPU", 
      imageLink: "https://compuscience.com.eg/23610-home_default/cpu-amd-ryzen-9-9950x-box-am5-without-fan.jpg" 
    },
    { 
      name: "AMD Ryzen 9 7950X", 
      price: 549.99, 
      category: "CPU", 
      imageLink: "https://compuscience.com.eg/23610-home_default/cpu-amd-ryzen-9-9950x-box-am5-without-fan.jpg" 
    },
    { 
      name: "Intel Core i9-14900K", 
      price: 529.99, 
      category: "CPU", 
      imageLink: "https://m.media-amazon.com/images/I/61iMaYoZ0sL._AC_UF894,1000_QL80_.jpg" 
    },
    { 
      name: "Intel Core i7-14700K", 
      price: 389.99, 
      category: "CPU", 
      imageLink: "https://m.media-amazon.com/images/I/61iMaYoZ0sL._AC_UF894,1000_QL80_.jpg" 
    },
    { 
      name: "Intel Core i5-14600K", 
      price: 299.99, 
      category: "CPU", 
      imageLink: "https://m.media-amazon.com/images/I/61iMaYoZ0sL._AC_UF894,1000_QL80_.jpg" 
    },

    // --- RAM ---
    { 
      name: "Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz", 
      price: 119.99, 
      category: "RAM", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPu0YRDS8D4Mu5NpLmY7eSy8J4QIXgrsGbiogGISTK-eP1XWWUM3jCZE62&s=10" 
    },
    { 
      name: "G.Skill Trident Z5 Neo RGB DDR5 64GB (2x32GB) 6000MHz", 
      price: 209.99, 
      category: "RAM", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPu0YRDS8D4Mu5NpLmY7eSy8J4QIXgrsGbiogGISTK-eP1XWWUM3jCZE62&s=10" 
    },
    { 
      name: "Teamgroup T-Force Delta RGB DDR5 32GB (2x16GB) 6400MHz", 
      price: 104.99, 
      category: "RAM", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPu0YRDS8D4Mu5NpLmY7eSy8J4QIXgrsGbiogGISTK-eP1XWWUM3jCZE62&s=10" 
    },
    { 
      name: "Crucial Pro DDR5 32GB (2x16GB) 5600MHz", 
      price: 89.99, 
      category: "RAM", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPu0YRDS8D4Mu5NpLmY7eSy8J4QIXgrsGbiogGISTK-eP1XWWUM3jCZE62&s=10" 
    },
    { 
      name: "Kingston FURY Beast DDR5 16GB (2x8GB) 5200MHz", 
      price: 64.99, 
      category: "RAM", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPu0YRDS8D4Mu5NpLmY7eSy8J4QIXgrsGbiogGISTK-eP1XWWUM3jCZE62&s=10" 
    },

    // --- Storage ---
    { 
      name: "Samsung 990 PRO NVMe M.2 SSD 2TB", 
      price: 169.99, 
      category: "Storage", 
      imageLink: "https://m.media-amazon.com/images/I/71OWtcxKgvL.jpg" 
    },
    { 
      name: "Crucial T700 PCIe 5.0 NVMe M.2 SSD 2TB", 
      price: 249.99, 
      category: "Storage", 
      imageLink: "https://m.media-amazon.com/images/I/71OWtcxKgvL.jpg" 
    },
    { 
      name: "Western Digital Black SN855X NVMe M.2 SSD 1TB", 
      price: 94.99, 
      category: "Storage", 
      imageLink: "https://m.media-amazon.com/images/I/71OWtcxKgvL.jpg" 
    },
    { 
      name: "Seagate IronWolf Pro 8TB NAS Internal Hard Drive", 
      price: 199.99, 
      category: "Storage", 
      imageLink: "https://m.media-amazon.com/images/I/61EzYF3znjL.jpg" 
    },
    { 
      name: "Crucial X9 Pro Portable SSD 2TB", 
      price: 139.99, 
      category: "Storage", 
      imageLink: "https://m.media-amazon.com/images/I/71OWtcxKgvL.jpg" 
    },

    // --- Monitors ---
    { 
      name: "ASUS ROG Swift 32\" 4K OLED PG32UCDM", 
      price: 1299.99, 
      category: "Monitor", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeivlUuxVoXy-e34ymi4wPDPrszaCVZ5pGErkpwMh0gw&s" 
    },
    { 
      name: "Alienware 34\" Curved QD-OLED AW3423DWF", 
      price: 799.99, 
      category: "Monitor", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeivlUuxVoXy-e34ymi4wPDPrszaCVZ5pGErkpwMh0gw&s" 
    },
    { 
      name: "LG UltraGear 27\" QHD IPS 27GP850-B", 
      price: 299.99, 
      category: "Monitor", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeivlUuxVoXy-e34ymi4wPDPrszaCVZ5pGErkpwMh0gw&s" 
    },
    { 
      name: "Samsung Odyssey G9 49\" Curved Gaming Monitor", 
      price: 1099.99, 
      category: "Monitor", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeivlUuxVoXy-e34ymi4wPDPrszaCVZ5pGErkpwMh0gw&s" 
    },
    { 
      name: "Gigabyte M27Q 27\" 170Hz KVM Monitor", 
      price: 249.99, 
      category: "Monitor", 
      imageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeivlUuxVoXy-e34ymi4wPDPrszaCVZ5pGErkpwMh0gw&s" 
    },

    // --- Peripherals ---
    { 
      name: "Logitech G Pro X Superlight 2 Gaming Mouse", 
      price: 149.99, 
      category: "Peripherals", 
      imageLink: "https://i5.walmartimages.com/seo/Logitech-G-PRO-X-SUPERLIGHT-Wireless-Gaming-Mouse-Black_c481f5fa-9934-4ed7-94af-29a598bd3b2e.03017ee44c6bb06a233bf23cbdd4f52b.jpeg" 
    },
    { 
      name: "Razer DeathAdder V3 Pro Wireless Mouse", 
      price: 139.99, 
      category: "Peripherals", 
      imageLink: "https://i5.walmartimages.com/seo/Logitech-G-PRO-X-SUPERLIGHT-Wireless-Gaming-Mouse-Black_c481f5fa-9934-4ed7-94af-29a598bd3b2e.03017ee44c6bb06a233bf23cbdd4f52b.jpeg" 
    },
    { 
      name: "ASUS ROG Azoth Wireless Mechanical Keyboard", 
      price: 249.99, 
      category: "Peripherals", 
      imageLink: "https://i5.walmartimages.com/seo/Logitech-G-PRO-X-SUPERLIGHT-Wireless-Gaming-Mouse-Black_c481f5fa-9934-4ed7-94af-29a598bd3b2e.03017ee44c6bb06a233bf23cbdd4f52b.jpeg" 
    },
    { 
      name: "Keychron Q1 Pro Custom Mechanical Keyboard", 
      price: 199.99, 
      category: "Peripherals", 
      imageLink: "https://i5.walmartimages.com/seo/Logitech-G-PRO-X-SUPERLIGHT-Wireless-Gaming-Mouse-Black_c481f5fa-9934-4ed7-94af-29a598bd3b2e.03017ee44c6bb06a233bf23cbdd4f52b.jpeg" 
    },
    { 
      name: "SteelSeries Apex Pro TKL Mechanical Keyboard", 
      price: 179.99, 
      category: "Peripherals", 
      imageLink: "https://i5.walmartimages.com/seo/Logitech-G-PRO-X-SUPERLIGHT-Wireless-Gaming-Mouse-Black_c481f5fa-9934-4ed7-94af-29a598bd3b2e.03017ee44c6bb06a233bf23cbdd4f52b.jpeg" 
    },

    // --- Networking ---
    { 
      name: "ASUS ROG Rapture GT6 Wi-Fi 6E Mesh System", 
      price: 429.99, 
      category: "Networking", 
      imageLink: "https://images.unsplash.com/photo-1610018556010-6a11691bc905?w=500&auto=format&fit=crop" 
    },
    { 
      name: "Netgear Nighthawk WiFi 7 Router RS700", 
      price: 699.99, 
      category: "Networking", 
      imageLink: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop" 
    },
    { 
      name: "TP-Link Deco AX3000 Whole Home Mesh System", 
      price: 179.99, 
      category: "Networking", 
      imageLink: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop" 
    },
    { 
      name: "Ubiquiti UniFi Dream Machine Professional", 
      price: 379.99, 
      category: "Networking", 
      imageLink: "https://images.unsplash.com/photo-1600132806608-231446b2e7af?w=500&auto=format&fit=crop" 
    },
    { 
      name: "Netgear 8-Port Gigabit Ethernet Unmanaged Switch", 
      price: 29.99, 
      category: "Networking", 
      imageLink: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop" 
    },

    // --- Audio ---
    { 
      name: "SteelSeries Arctis Nova Pro Wireless Headset", 
      price: 349.99, 
      category: "Audio", 
      imageLink: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop" 
    },
    { 
      name: "HyperX Cloud Alpha Wireless Gaming Headset", 
      price: 169.99, 
      category: "Audio", 
      imageLink: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format&fit=crop" 
    },
    { 
      name: "Audio-Technica ATH-M50x Professional Studio Headphones", 
      price: 149.99, 
      category: "Audio", 
      imageLink: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop" 
    },
    { 
      name: "Shure SM7B Vocal Microphone", 
      price: 399.99, 
      category: "Audio", 
      imageLink: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop" 
    },
    { 
      name: "Rodecaster Pro II Audio Production Studio", 
      price: 699.99, 
      category: "Audio", 
      imageLink: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&auto=format&fit=crop" 
    }
  ],
});

	console.log("Seeding completed successfully!");
}

main()
	.catch((e) => {
		console.error("Seeding failed:", e);
		throw new Error("Seed process terminated due to errors.");
	})
	.finally(async () => {
		// 3. Gracefully shut down both Prisma and the connection pool
		await prisma.$disconnect();
		await pool.end();
	});
