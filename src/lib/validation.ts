import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const productSchema = z.object({
	slug: z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	priceCents: z.number().int().nonnegative(),
	compareAtPriceCents: z.number().int().nonnegative().optional().nullable(),
	category: z.string().min(1),
	brand: z.string().min(1),
	condition: z.enum(["new", "used"]).default("new"),
	sizes: z.array(z.string()).min(1),
	colors: z.array(z.string()).min(1),
	inStock: z.boolean(),
	images: z
		.array(
			z.object({ url: z.string().url(), width: z.number().int(), height: z.number().int(), alt: z.string() })
		)
		.default([]),
});

export const checkoutSchema = z.object({
	name: z.string().min(1),
	phone: z.string().min(6),
	wilaya: z.string().min(1),
	address: z.string().min(1),
	items: z
		.array(
			z.object({
				productId: z.number().int().positive(),
				qty: z.number().int().positive(),
				priceCents: z.number().int().nonnegative(),
				size: z.string().optional(),
				color: z.string().optional(),
			})
		)
		.min(1),
});

export const newsletterSchema = z.object({ email: z.string().email() }); 