import { getTranslations } from "next-intl/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import Reviews from "@/components/Reviews";
import Breadcrumb from "@/components/Breadcrumb";
import { formatPriceDZD } from "@/lib/currency";

export default async function ProductPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
	const { id: idParam, locale } = await params;
	const id = Number(idParam);
	if (!Number.isFinite(id)) notFound();
	const t = await getTranslations({ locale });

	const pRows = await db.select().from(products as any).all();
	const all = Array.isArray(pRows) ? (pRows as any[]) : [];
	const p: any = all.find((row: any) => Number(row.id) === id);
	if (!p) notFound();

	const imgRows = await db.select().from(productImages as any).all();
	const allImgs = Array.isArray(imgRows) ? (imgRows as any[]) : [];
	const images: any[] = allImgs.filter((img: any) => Number(img.productId) === id);
	const firstImageByProductId = new Map<number, any>();
	for (const img of allImgs) {
		const pid = Number(img.productId);
		if (!firstImageByProductId.has(pid)) firstImageByProductId.set(pid, img);
	}
	const sizes = (p.sizes as string[]) || [];
	const colors = (p.colors as string[]) || [];
	const hasDiscount = p.compareAtPriceCents && p.compareAtPriceCents > p.priceCents;

	const related = all
		.filter((row) => row.category === p.category && row.id !== p.id)
		.slice(0, 4)
		.map((row) => ({ ...row, imageUrl: firstImageByProductId.get(Number(row.id))?.url, imageAlt: firstImageByProductId.get(Number(row.id))?.alt }));

	return (
		<main className="px-4 md:px-10 py-8">
			<Breadcrumb
				items={[
					{ label: t("nav_home"), href: `/${locale}` },
					{ label: t("shop"), href: `/${locale}/shop` },
					{ label: t(`category_${p.category}`), href: `/${locale}/shop?category=${p.category}` },
					{ label: p.name },
				]}
			/>

			<div className="mt-6 grid md:grid-cols-2 gap-12">
				<ProductGallery images={images as any} />
				<div>
					<div className="text-sm text-muted uppercase tracking-wide mb-1">{p.brand}</div>
					<h1 className="text-3xl font-bold mb-3">{p.name}</h1>
					<div className="flex items-baseline gap-3 mb-6">
						<span className="text-2xl font-bold">{formatPriceDZD(p.priceCents)}</span>
						{hasDiscount && <span className="text-muted line-through">{formatPriceDZD(p.compareAtPriceCents)}</span>}
					</div>
					<ProductActions
						id={p.id}
						slug={p.slug}
						name={p.name}
						priceCents={p.priceCents}
						inStock={p.inStock}
						sizes={sizes}
						colors={colors}
						imageUrl={images[0]?.url}
					/>
					<p className="text-muted mt-8 leading-relaxed">{p.description}</p>
				</div>
			</div>

			<section className="mt-16 bg-surface-muted rounded-2xl p-8 md:p-10">
				<h2 className="text-xl font-bold mb-6">{t("details_title")}</h2>
				<dl className="grid sm:grid-cols-2 gap-x-10 gap-y-3 text-sm max-w-2xl">
					<div className="flex justify-between border-b border-border/60 pb-2">
						<dt className="text-muted">{t("spec_category")}</dt>
						<dd className="font-medium">{t(`category_${p.category}`)}</dd>
					</div>
					<div className="flex justify-between border-b border-border/60 pb-2">
						<dt className="text-muted">{t("spec_brand")}</dt>
						<dd className="font-medium">{p.brand}</dd>
					</div>
					<div className="flex justify-between border-b border-border/60 pb-2">
						<dt className="text-muted">{t("spec_condition")}</dt>
						<dd className="font-medium">{p.condition === "used" ? t("condition_used") : t("condition_new")}</dd>
					</div>
					{sizes.length > 0 && (
						<div className="flex justify-between border-b border-border/60 pb-2">
							<dt className="text-muted">{t("spec_storage")}</dt>
							<dd className="font-medium">{sizes.join(", ")}</dd>
						</div>
					)}
					{colors.length > 0 && (
						<div className="flex justify-between border-b border-border/60 pb-2">
							<dt className="text-muted">{t("spec_colors")}</dt>
							<dd className="font-medium">{colors.join(", ")}</dd>
						</div>
					)}
				</dl>
			</section>

			<Reviews t={t} />

			{related.length > 0 && (
				<section className="mt-16">
					<h2 className="text-xl font-bold mb-6">{t("related_products")}</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
						{related.map((r) => (
							<ProductCard
								key={r.id}
								id={r.id}
								locale={locale}
								name={r.name}
								brand={r.brand}
								priceCents={r.priceCents}
								compareAtPriceCents={r.compareAtPriceCents}
								inStock={r.inStock}
								condition={r.condition}
								imageUrl={r.imageUrl}
								imageAlt={r.imageAlt}
							/>
						))}
					</div>
				</section>
			)}
		</main>
	);
}
