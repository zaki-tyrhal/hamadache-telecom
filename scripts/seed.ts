import 'dotenv/config';
import { db } from "@/db";
import { admins, products, productImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function main() {
	const adminEmail = process.env.ADMIN_EMAIL || "admin@amigo.com";
	const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe_123";
	const passwordHash = await bcrypt.hash(adminPassword, 10);

	// upsert admin
	try {
		await db.insert(admins).values({ email: adminEmail, passwordHash }).run();
		console.log(`Admin created: ${adminEmail}`);
	} catch (e) {
		console.log("Admin exists - skipping");
	}

	// sample products
	const sampleProducts = [
		{
			slug: "samsung-galaxy-a54",
			name: "Samsung Galaxy A54",
			description: "شاشة Super AMOLED مقاس 6.4 بوصة، كاميرا 50 ميجابيكسل، بطارية 5000mAh.",
			priceCents: 45000,
			compareAtPriceCents: 49000,
			category: "smartphones",
			brand: "Samsung",
			condition: "new" as const,
			sizes: ["128GB", "256GB"],
			colors: ["Black", "White", "Lime"],
			inStock: true,
			image: { url: "/products/smartphone.svg", alt: "Samsung Galaxy A54" },
		},
		{
			slug: "poco-x6",
			name: "POCO X6",
			description: "معالج Snapdragon قوي، شاشة AMOLED 120Hz، شحن سريع 67W.",
			priceCents: 38000,
			compareAtPriceCents: 42000,
			category: "smartphones",
			brand: "POCO",
			condition: "new" as const,
			sizes: ["256GB"],
			colors: ["Black", "Blue"],
			inStock: true,
			image: { url: "/products/smartphone.svg", alt: "POCO X6" },
		},
		{
			slug: "apple-iphone-13",
			name: "Apple iPhone 13",
			description: "شاشة Super Retina XDR، شريحة A15 Bionic، مقاوم للماء.",
			priceCents: 62000,
			category: "smartphones",
			brand: "Apple",
			condition: "new" as const,
			sizes: ["128GB", "256GB"],
			colors: ["Black", "Blue", "White"],
			inStock: true,
			image: { url: "/products/smartphone.svg", alt: "Apple iPhone 13" },
		},
		{
			slug: "anker-charger-20w",
			name: "Anker PowerPort 20W",
			description: "شاحن سريع مع كابل USB-C، متوافق مع جميع الهواتف الذكية.",
			priceCents: 2500,
			category: "chargers",
			brand: "Anker",
			condition: "new" as const,
			sizes: [],
			colors: ["White", "Black"],
			inStock: true,
			image: { url: "/products/charger.svg", alt: "Anker PowerPort 20W" },
		},
		{
			slug: "type-c-cable-1m",
			name: "كابل Type-C 1 متر",
			description: "كابل شحن ونقل بيانات متين، متوافق مع جميع الهواتف الحديثة.",
			priceCents: 800,
			category: "chargers",
			brand: "Generic",
			condition: "new" as const,
			sizes: [],
			colors: ["Black", "White"],
			inStock: true,
			image: { url: "/products/charger.svg", alt: "كابل Type-C" },
		},
		{
			slug: "jbl-tune-510bt",
			name: "JBL Tune 510BT",
			description: "سماعات لاسلكية بلوتوث مع صوت جهير قوي وبطارية تدوم 40 ساعة.",
			priceCents: 6500,
			category: "accessories",
			brand: "JBL",
			condition: "new" as const,
			sizes: [],
			colors: ["Black", "Blue", "White"],
			inStock: true,
			image: { url: "/products/earbuds.svg", alt: "JBL Tune 510BT" },
		},
		{
			slug: "tws-earbuds-generic",
			name: "سماعات لاسلكية TWS",
			description: "سماعات بلوتوث 5.0 مع علبة شحن، عزل ضوضاء أساسي.",
			priceCents: 3500,
			category: "accessories",
			brand: "Generic",
			condition: "new" as const,
			sizes: [],
			colors: ["Black", "White"],
			inStock: true,
			image: { url: "/products/earbuds.svg", alt: "سماعات TWS" },
		},
		{
			slug: "tempered-glass-case-a54",
			name: "طقم حماية Galaxy A54 (زجاج + غطاء)",
			description: "زجاج واقٍ للشاشة مقاوم للخدش مع غطاء سيليكون شفاف.",
			priceCents: 1500,
			category: "protection",
			brand: "Generic",
			condition: "new" as const,
			sizes: [],
			colors: ["Transparent"],
			inStock: true,
			image: { url: "/products/case.svg", alt: "طقم حماية Galaxy A54" },
		},
		{
			slug: "silicone-case-universal",
			name: "غطاء سيليكون عام",
			description: "غطاء سيليكون مرن يحمي من الصدمات والخدوش، مقاسات متعددة.",
			priceCents: 900,
			category: "protection",
			brand: "Generic",
			condition: "new" as const,
			sizes: [],
			colors: ["Black", "Transparent", "Blue"],
			inStock: true,
			image: { url: "/products/case.svg", alt: "غطاء سيليكون" },
		},
	];

	for (const { image, ...p } of sampleProducts) {
		let productId: number | undefined;
		try {
			const res = await db.insert(products).values(p).run();
			productId = Number(res.lastInsertRowid);
			console.log(`Seeded product: ${p.name} (id=${productId})`);
		} catch (e) {
			const existing = await db.select().from(products).where(eq(products.slug, p.slug)).all();
			productId = existing[0] ? Number((existing[0] as any).id) : undefined;
			console.log(`Product exists - skipping: ${p.slug}`);
		}

		if (productId) {
			const existingImages = await db.select().from(productImages).where(eq(productImages.productId, productId)).all();
			if (existingImages.length === 0) {
				await db.insert(productImages).values({ productId, url: image.url, width: 800, height: 800, alt: image.alt }).run();
				console.log(`  + image attached: ${image.url}`);
			}
		}
	}
}

main().then(() => {
	console.log("Seed complete");
	process.exit(0);
});
