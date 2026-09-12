"use client";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";
import Breadcrumb from "./Breadcrumb";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "./icons";
import { CATEGORIES } from "@/lib/site";

type Product = {
	id: number;
	name: string;
	brand: string;
	category: string;
	condition: string;
	priceCents: number;
	compareAtPriceCents?: number | null;
	inStock: boolean;
	sizes: string[];
	colors: string[];
	imageUrl?: string;
	imageAlt?: string;
};

const PAGE_SIZE = 9;

function FilterGroup({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className="border-b border-border py-4">
			<button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-sm font-semibold">
				{title}
				<ChevronDownIcon className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
			</button>
			{open && <div className="mt-4">{children}</div>}
		</div>
	);
}

export default function ShopClient({
	products,
	locale,
	initialCategory,
	initialQuery,
}: {
	products: Product[];
	locale: string;
	initialCategory: string;
	initialQuery: string;
}) {
	const t = useTranslations();
	const [category, setCategory] = useState(initialCategory);
	const [brandFilter, setBrandFilter] = useState<Set<string>>(new Set());
	const [storageFilter, setStorageFilter] = useState<Set<string>>(new Set());
	const [colorFilter, setColorFilter] = useState<Set<string>>(new Set());
	const [conditionFilter, setConditionFilter] = useState<Set<string>>(new Set());
	const [brandSearch, setBrandSearch] = useState("");
	const [query, setQuery] = useState(initialQuery);
	const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc" | "name">("newest");
	const [page, setPage] = useState(1);

	function toggle(set: Set<string>, setter: (s: Set<string>) => void, value: string) {
		const next = new Set(set);
		if (next.has(value)) next.delete(value); else next.add(value);
		setter(next);
		setPage(1);
	}

	const byCategory = useMemo(() => (category ? products.filter((p) => p.category === category) : products), [products, category]);

	const brandCounts = useMemo(() => {
		const counts = new Map<string, number>();
		for (const p of byCategory) counts.set(p.brand, (counts.get(p.brand) || 0) + 1);
		return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
	}, [byCategory]);

	const storageOptions = useMemo(() => Array.from(new Set(byCategory.flatMap((p) => p.sizes))).filter(Boolean), [byCategory]);
	const colorOptions = useMemo(() => Array.from(new Set(byCategory.flatMap((p) => p.colors))).filter(Boolean), [byCategory]);

	const filtered = useMemo(() => {
		let list = byCategory;
		if (query.trim()) {
			const q = query.trim().toLowerCase();
			list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
		}
		if (brandFilter.size > 0) list = list.filter((p) => brandFilter.has(p.brand));
		if (storageFilter.size > 0) list = list.filter((p) => p.sizes.some((s) => storageFilter.has(s)));
		if (colorFilter.size > 0) list = list.filter((p) => p.colors.some((c) => colorFilter.has(c)));
		if (conditionFilter.size > 0) list = list.filter((p) => conditionFilter.has(p.condition));

		const sorted = [...list];
		if (sort === "price_asc") sorted.sort((a, b) => a.priceCents - b.priceCents);
		else if (sort === "price_desc") sorted.sort((a, b) => b.priceCents - a.priceCents);
		else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
		else sorted.sort((a, b) => b.id - a.id);
		return sorted;
	}, [byCategory, query, brandFilter, storageFilter, colorFilter, conditionFilter, sort]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const categoryLabel = category ? t(`category_${category}`) : t("shop");

	return (
		<main className="px-4 md:px-10 py-8">
			<Breadcrumb
				items={[
					{ label: t("nav_home"), href: `/${locale}` },
					{ label: t("shop"), href: `/${locale}/shop` },
					{ label: categoryLabel },
				]}
			/>

			<div className="mt-6 grid md:grid-cols-[240px_1fr] gap-8">
				<aside>
					<FilterGroup title={t("filter_category")} defaultOpen>
						<div className="space-y-2 text-sm">
							<label className="flex items-center gap-2">
								<input type="radio" checked={category === ""} onChange={() => { setCategory(""); setPage(1); }} />
								{t("filter_all_categories")}
							</label>
							{CATEGORIES.map((c) => (
								<label key={c.slug} className="flex items-center gap-2">
									<input type="radio" checked={category === c.slug} onChange={() => { setCategory(c.slug); setPage(1); }} />
									{t(c.labelKey)}
								</label>
							))}
						</div>
					</FilterGroup>

					<FilterGroup title={t("filter_brand")} defaultOpen>
						<div className="flex items-center gap-2 bg-surface-muted rounded-lg px-3 py-2 mb-3">
							<SearchIcon className="w-4 h-4 text-muted shrink-0" />
							<input
								value={brandSearch}
								onChange={(e) => setBrandSearch(e.target.value)}
								placeholder={t("filter_search")}
								className="bg-transparent outline-none text-sm w-full"
							/>
						</div>
						<div className="space-y-2 text-sm max-h-56 overflow-y-auto">
							{brandCounts
								.filter(([b]) => b.toLowerCase().includes(brandSearch.toLowerCase()))
								.map(([b, count]) => (
									<label key={b} className="flex items-center justify-between gap-2">
										<span className="flex items-center gap-2">
											<input type="checkbox" checked={brandFilter.has(b)} onChange={() => toggle(brandFilter, setBrandFilter, b)} />
											{b}
										</span>
										<span className="text-muted text-xs">{count}</span>
									</label>
								))}
						</div>
					</FilterGroup>

					{storageOptions.length > 0 && (
						<FilterGroup title={t("filter_storage")}>
							<div className="space-y-2 text-sm">
								{storageOptions.map((s) => (
									<label key={s} className="flex items-center gap-2">
										<input type="checkbox" checked={storageFilter.has(s)} onChange={() => toggle(storageFilter, setStorageFilter, s)} />
										{s}
									</label>
								))}
							</div>
						</FilterGroup>
					)}

					{colorOptions.length > 0 && (
						<FilterGroup title={t("filter_color")}>
							<div className="space-y-2 text-sm">
								{colorOptions.map((c) => (
									<label key={c} className="flex items-center gap-2">
										<input type="checkbox" checked={colorFilter.has(c)} onChange={() => toggle(colorFilter, setColorFilter, c)} />
										{c}
									</label>
								))}
							</div>
						</FilterGroup>
					)}

					<FilterGroup title={t("filter_condition")}>
						<div className="space-y-2 text-sm">
							{["new", "used"].map((c) => (
								<label key={c} className="flex items-center gap-2">
									<input type="checkbox" checked={conditionFilter.has(c)} onChange={() => toggle(conditionFilter, setConditionFilter, c)} />
									{c === "new" ? t("condition_new") : t("condition_used")}
								</label>
							))}
						</div>
					</FilterGroup>
				</aside>

				<section>
					<div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
						<div className="text-sm">
							{t("selected_products")}: <span className="font-semibold">{filtered.length}</span>
						</div>
						<select
							value={sort}
							onChange={(e) => setSort(e.target.value as "newest" | "price_asc" | "price_desc" | "name")}
							className="bg-surface-muted rounded-lg px-3 py-2 text-sm border-0"
						>
							<option value="newest">{t("sort_newest")}</option>
							<option value="price_asc">{t("sort_price_asc")}</option>
							<option value="price_desc">{t("sort_price_desc")}</option>
							<option value="name">{t("sort_name")}</option>
						</select>
					</div>

					{pageItems.length === 0 ? (
						<p className="text-muted py-16 text-center">{t("no_products")}</p>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
							{pageItems.map((p) => (
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
					)}

					{totalPages > 1 && (
						<div className="mt-10 flex items-center justify-center gap-2">
							<button
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-30"
							>
								<ChevronLeftIcon className="w-4 h-4" />
							</button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
								<button
									key={p}
									onClick={() => setPage(p)}
									className={`w-9 h-9 rounded-lg text-sm ${p === currentPage ? "bg-foreground text-white" : "border border-border hover:border-foreground/40"}`}
								>
									{p}
								</button>
							))}
							<button
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
								className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-30"
							>
								<ChevronRightIcon className="w-4 h-4" />
							</button>
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
