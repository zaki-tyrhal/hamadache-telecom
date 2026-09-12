"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart";
import { whatsappLink } from "@/lib/site";
import { HeartIcon, TruckIcon, BoxIcon, CheckShieldIcon } from "./icons";

type Props = {
	id: number;
	slug: string;
	name: string;
	priceCents: number;
	inStock: boolean;
	sizes: string[];
	colors: string[];
	imageUrl?: string;
};

const COLOR_SWATCH: Record<string, string> = {
	black: "#111111",
	white: "#f5f5f5",
	blue: "#3b82f6",
	lime: "#84cc16",
	transparent: "#e5e5e5",
};

export default function ProductActions({ id, slug, name, priceCents, inStock, sizes, colors, imageUrl }: Props) {
	const t = useTranslations();
	const addItem = useCartStore((s) => s.addItem);
	const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[0]);
	const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0]);
	const [saved, setSaved] = useState(false);
	const [added, setAdded] = useState(false);

	const canAdd = inStock && (sizes.length === 0 || !!selectedSize) && (colors.length === 0 || !!selectedColor);

	function addToCart() {
		if (!canAdd) return;
		addItem({ productId: id, slug, name, priceCents, qty: 1, size: selectedSize, color: selectedColor, imageUrl });
		setAdded(true);
		setTimeout(() => setAdded(false), 1800);
	}

	return (
		<div className="space-y-6">
			{colors.length > 0 && (
				<div>
					<div className="text-sm text-muted mb-2">{t("select_color")}</div>
					<div className="flex gap-2">
						{colors.map((c) => (
							<button
								key={c}
								onClick={() => setSelectedColor(c)}
								aria-label={c}
								className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === c ? "border-foreground scale-110" : "border-border"}`}
								style={{ background: COLOR_SWATCH[c.toLowerCase()] || "#999" }}
							/>
						))}
					</div>
				</div>
			)}

			{sizes.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{sizes.map((s) => (
						<button
							key={s}
							onClick={() => setSelectedSize(s)}
							className={`border rounded-lg px-4 py-2 text-sm transition-colors ${selectedSize === s ? "border-foreground bg-foreground text-white" : "border-border hover:border-foreground/50"}`}
						>
							{s}
						</button>
					))}
				</div>
			)}

			<div className="flex flex-col sm:flex-row gap-3">
				<button
					onClick={() => setSaved((s) => !s)}
					className="flex items-center justify-center gap-2 border border-border rounded-lg px-6 py-3 font-medium hover:border-foreground/50 transition-colors"
				>
					<HeartIcon className="w-4 h-4" filled={saved} />
					{t("add_to_wishlist")}
				</button>
				<button
					disabled={!canAdd}
					onClick={addToCart}
					className="flex-1 bg-foreground text-white rounded-lg px-6 py-3 font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{added ? t("added_to_cart") : t("add_to_cart")}
				</button>
			</div>

			<a
				href={whatsappLink(`مرحبا، أريد طلب: ${name}`)}
				target="_blank"
				rel="noopener noreferrer"
				className="block text-center border border-border rounded-lg px-6 py-3 font-medium hover:border-foreground/50 transition-colors"
			>
				{t("order_whatsapp")}
			</a>

			<div className="grid grid-cols-3 gap-3 text-xs text-muted pt-2">
				<div className="flex flex-col items-center text-center gap-1 border border-border rounded-lg py-3 px-2">
					<TruckIcon className="w-5 h-5" />
					{t("info_delivery")}
				</div>
				<div className="flex flex-col items-center text-center gap-1 border border-border rounded-lg py-3 px-2">
					<BoxIcon className="w-5 h-5" />
					{inStock ? t("info_in_stock") : t("info_out_of_stock")}
				</div>
				<div className="flex flex-col items-center text-center gap-1 border border-border rounded-lg py-3 px-2">
					<CheckShieldIcon className="w-5 h-5" />
					{t("info_guaranteed")}
				</div>
			</div>
		</div>
	);
}
