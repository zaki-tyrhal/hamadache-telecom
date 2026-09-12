import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins, products, productImages } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DDL = [
	`CREATE TABLE IF NOT EXISTS admins (
		id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		email text NOT NULL,
		passwordHash text NOT NULL,
		createdAt integer DEFAULT (unixepoch('now') * 1000) NOT NULL
	)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS admins_email_unique ON admins (email)`,
	`CREATE TABLE IF NOT EXISTS newsletter_emails (
		id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		email text NOT NULL,
		createdAt integer DEFAULT (unixepoch('now') * 1000) NOT NULL
	)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS newsletter_emails_email_unique ON newsletter_emails (email)`,
	`CREATE TABLE IF NOT EXISTS products (
		id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		slug text NOT NULL,
		name text NOT NULL,
		description text NOT NULL,
		priceCents integer NOT NULL,
		compareAtPriceCents integer,
		category text NOT NULL,
		brand text DEFAULT '' NOT NULL,
		condition text DEFAULT 'new' NOT NULL,
		sizes text NOT NULL,
		colors text NOT NULL,
		inStock integer DEFAULT true NOT NULL,
		createdAt integer DEFAULT (unixepoch('now') * 1000) NOT NULL,
		updatedAt integer DEFAULT (unixepoch('now') * 1000) NOT NULL
	)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON products (slug)`,
	`CREATE TABLE IF NOT EXISTS product_images (
		id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		productId integer NOT NULL,
		url text NOT NULL,
		width integer NOT NULL,
		height integer NOT NULL,
		alt text NOT NULL,
		FOREIGN KEY (productId) REFERENCES products(id) ON DELETE cascade
	)`,
	`CREATE TABLE IF NOT EXISTS orders (
		id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		customerName text NOT NULL,
		phone text NOT NULL,
		wilaya text NOT NULL,
		address text NOT NULL,
		totalCents integer NOT NULL,
		status text DEFAULT 'pending' NOT NULL,
		createdAt integer DEFAULT (unixepoch('now') * 1000) NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS order_items (
		id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		orderId integer NOT NULL,
		productId integer NOT NULL,
		nameSnapshot text NOT NULL,
		priceCents integer NOT NULL,
		qty integer NOT NULL,
		size text,
		color text,
		FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE cascade,
		FOREIGN KEY (productId) REFERENCES products(id)
	)`,
];

const SAMPLE_PRODUCTS = [
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

export async function POST(req: NextRequest) {
	const key = req.headers.get("x-setup-key");
	if (!key || key !== process.env.ADMIN_PASSWORD) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const log: string[] = [];

	for (const stmt of DDL) {
		await db.run(sql.raw(stmt));
	}
	log.push("schema ready");

	const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").trim().toLowerCase();
	const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe_123";
	const existingAdmin = await db.select().from(admins).where(eq(admins.email, adminEmail)).all();
	if (existingAdmin.length === 0) {
		const passwordHash = await bcrypt.hash(adminPassword, 10);
		await db.insert(admins).values({ email: adminEmail, passwordHash }).run();
		log.push(`admin created: ${adminEmail}`);
	} else {
		log.push("admin already exists");
	}

	for (const { image, ...p } of SAMPLE_PRODUCTS) {
		const existing = await db.select().from(products).where(eq(products.slug, p.slug)).all();
		let productId: number;
		if (existing.length === 0) {
			const res = await db.insert(products).values(p).run();
			productId = Number(res.lastInsertRowid);
			log.push(`product created: ${p.slug} (id=${productId})`);
		} else {
			productId = Number((existing[0] as any).id);
			log.push(`product exists: ${p.slug}`);
		}
		const existingImages = await db.select().from(productImages).where(eq(productImages.productId, productId)).all();
		if (existingImages.length === 0) {
			await db.insert(productImages).values({ productId, url: image.url, width: 800, height: 800, alt: image.alt }).run();
			log.push(`  + image attached: ${image.url}`);
		}
	}

	return NextResponse.json({ ok: true, log });
}
