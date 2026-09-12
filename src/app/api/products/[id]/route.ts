import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
	slug: z.string().min(1).optional(),
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	priceCents: z.number().int().nonnegative().optional(),
	compareAtPriceCents: z.number().int().nonnegative().optional().nullable(),
	category: z.string().min(1).optional(),
	brand: z.string().min(1).optional(),
	condition: z.enum(["new", "used"]).optional(),
	sizes: z.array(z.string()).min(1).optional(),
	colors: z.array(z.string()).min(1).optional(),
	inStock: z.boolean().optional(),
	images: z.array(z.object({ url: z.string().url(), width: z.number().int(), height: z.number().int(), alt: z.string() })).optional(),
});

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	const rows = await db.select().from(products).where(eq(products.id, Number(id))).all();
	const p = Array.isArray(rows) ? rows[0] : null;
	if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
	const images = await db.select().from(productImages).where(eq(productImages.productId, Number(id))).all();
	return NextResponse.json({ ...p, images });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	const json = await req.json();
	const parsed = schema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
	const { images, ...update } = parsed.data as any;
	const res: any = await db.update(products).set(update).where(eq(products.id, Number(id))).run();
	if (res.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
	if (Array.isArray(images)) {
		// Replace product images
		const res: any = await db.delete(productImages).where(eq(productImages.productId, Number(id))).run();
		for (const img of images) {
			const res: any = await db.insert(productImages).values({ productId: Number(id), url: img.url, width: img.width, height: img.height, alt: img.alt }).run();
		}
	}
	return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	
	// First delete related order items (no cascade, so manual deletion required)
	await db.delete(orderItems).where(eq(orderItems.productId, Number(id))).run();
	
	// Then delete related product images (cascade should handle this, but being explicit)
	await db.delete(productImages).where(eq(productImages.productId, Number(id))).run();
	
	// Finally delete the product
	const res: any = await db.delete(products).where(eq(products.id, Number(id))).run();
	if (res.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
	
	return NextResponse.json({ ok: true });
} 