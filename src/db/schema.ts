import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const products = sqliteTable("products", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	priceCents: integer("priceCents").notNull(),
	compareAtPriceCents: integer("compareAtPriceCents"),
	category: text("category").notNull(),
	brand: text("brand").notNull().default(""),
	condition: text("condition", { enum: ["new", "used"] }).notNull().default("new"),
	sizes: text("sizes", { mode: "json" }).$type<string[]>().notNull(),
	colors: text("colors", { mode: "json" }).$type<string[]>().notNull(),
	inStock: integer("inStock", { mode: "boolean" }).notNull().default(true),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch('now') * 1000)`),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch('now') * 1000)`),
});

export const productImages = sqliteTable("product_images", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	productId: integer("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
	url: text("url").notNull(),
	width: integer("width").notNull(),
	height: integer("height").notNull(),
	alt: text("alt").notNull(),
});

export const orders = sqliteTable("orders", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	customerName: text("customerName").notNull(),
	phone: text("phone").notNull(),
	wilaya: text("wilaya").notNull(),
	address: text("address").notNull(),
	totalCents: integer("totalCents").notNull(),
	status: text("status").notNull().default("pending"),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch('now') * 1000)`),
});

export const orderItems = sqliteTable("order_items", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	orderId: integer("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
	productId: integer("productId").notNull().references(() => products.id),
	nameSnapshot: text("nameSnapshot").notNull(),
	priceCents: integer("priceCents").notNull(),
	qty: integer("qty").notNull(),
	size: text("size"),
	color: text("color"),
});

export const admins = sqliteTable("admins", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	email: text("email").notNull().unique(),
	passwordHash: text("passwordHash").notNull(),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch('now') * 1000)`),
});

export const newsletterEmails = sqliteTable("newsletter_emails", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	email: text("email").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch('now') * 1000)`),
});

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"; 