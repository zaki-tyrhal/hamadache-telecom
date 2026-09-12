import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import ShopClient from "@/components/ShopClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = { q?: string; category?: string };

export default async function ShopPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SearchParams> }) {
	const { locale } = await params;
	const sp = await searchParams;

	const all = await db.select().from(products as any).all();
	const list = Array.isArray(all) ? (all as any[]) : [];
	const imgRows = await db.select().from(productImages as any).all();
	const imgs = Array.isArray(imgRows) ? (imgRows as any[]) : [];
	const firstImageByProductId = new Map<number, any>();
	for (const img of imgs) {
		const pid = Number(img.productId);
		if (!firstImageByProductId.has(pid)) firstImageByProductId.set(pid, img);
	}
	const withImages = list.map((p) => {
		const img = firstImageByProductId.get(Number(p.id));
		return { ...p, imageUrl: img?.url, imageAlt: img?.alt };
	});

	return (
		<ShopClient
			products={withImages}
			locale={locale}
			initialCategory={(sp.category || "").trim().toLowerCase()}
			initialQuery={sp.q || ""}
		/>
	);
}
