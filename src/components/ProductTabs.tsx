"use client";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";

type Product = {
	id: number;
	name: string;
	brand?: string;
	priceCents: number;
	compareAtPriceCents?: number | null;
	inStock: boolean;
	condition?: string;
	createdAt?: number;
	imageUrl?: string;
	imageAlt?: string;
};

const TABS = [
	{ key: "new", labelKey: "tab_new_arrival" },
	{ key: "bestseller", labelKey: "tab_bestseller" },
	{ key: "featured", labelKey: "tab_featured" },
] as const;

export default function ProductTabs({ products, locale }: { products: Product[]; locale: string }) {
	const t = useTranslations();
	const [active, setActive] = useState<(typeof TABS)[number]["key"]>("new");

	const list = useMemo(() => {
		if (active === "new") return [...products].sort((a, b) => (b.createdAt ?? b.id) - (a.createdAt ?? a.id)).slice(0, 8);
		if (active === "bestseller") return products.filter((p) => p.inStock).slice(0, 8);
		return products.filter((p) => p.compareAtPriceCents || p.inStock).slice(0, 8);
	}, [active, products]);

	return (
		<section className="px-4 md:px-10 py-14">
			<div className="flex items-center gap-6 border-b border-border mb-8 text-sm">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setActive(tab.key)}
						className={`pb-3 -mb-px border-b-2 transition-colors ${active === tab.key ? "border-foreground font-semibold" : "border-transparent text-muted hover:text-foreground"}`}
					>
						{t(tab.labelKey)}
					</button>
				))}
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
				{list.map((p) => (
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
	);
}
