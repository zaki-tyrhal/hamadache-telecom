import { getTranslations } from "next-intl/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { whatsappLink } from "@/lib/site";
import Hero from "@/components/Hero";
import CategoryBento from "@/components/CategoryBento";
import CategoryBar from "@/components/CategoryBar";
import ProductTabs from "@/components/ProductTabs";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale });

	const allProducts = await db.select().from(products as any).all();
	const list = Array.isArray(allProducts) ? (allProducts as any[]) : [];
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
	const discounted = withImages.filter((p) => p.compareAtPriceCents && p.compareAtPriceCents > p.priceCents).slice(0, 4);

	return (
		<main className="min-h-screen">
			<Hero />
			<CategoryBento t={t} locale={locale} />
			<CategoryBar t={t} locale={locale} />
			<ProductTabs products={withImages} locale={locale} />

			{discounted.length > 0 && (
				<section className="px-4 md:px-10 py-14">
					<h2 className="text-lg font-semibold mb-6">{t("discounts_title")}</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
						{discounted.map((p) => (
							<ProductCard
								key={p.id}
								id={p.id}
								locale={locale}
								name={p.name}
								brand={p.brand}
								priceCents={p.priceCents}
								compareAtPriceCents={p.compareAtPriceCents}
								inStock={p.inStock}
								condition={p.condition}
								imageUrl={p.imageUrl}
								imageAlt={p.imageAlt}
							/>
						))}
					</div>
				</section>
			)}

			<section className="px-4 md:px-10 pb-16">
				<div className="bg-dark text-white rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
					<div>
						<h2 className="text-2xl md:text-4xl font-bold">{t("big_sale_title")}</h2>
						<p className="mt-3 text-white/60 max-w-md">{t("big_sale_desc")}</p>
					</div>
					<a
						href={whatsappLink()}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block border border-white/70 hover:bg-white hover:text-dark px-7 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
					>
						{t("order_whatsapp")}
					</a>
				</div>
			</section>
		</main>
	);
}
