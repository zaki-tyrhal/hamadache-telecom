"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart";
import { formatPriceDZD } from "@/lib/currency";
import { CloseIcon } from "@/components/icons";

export default function CartPage() {
	const t = useTranslations();
	const { items, hydrated, load, updateQty, removeItem } = useCartStore();
	const [promo, setPromo] = useState("");
	const [bonusCard, setBonusCard] = useState("");
	useEffect(() => {
		load();
	}, [load]);
	const safeItems = Array.isArray(items) ? items : [];
	const total = useMemo(() => safeItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0), [safeItems]);
	if (!hydrated) return null;

	return (
		<main className="px-4 md:px-10 py-10">
			<h1 className="text-3xl font-bold mb-10">{t("cart_title")}</h1>
			{safeItems.length === 0 ? (
				<div>
					<p className="text-muted">{t("cart_empty")}</p>
					<Link href="../shop" className="inline-block mt-4 bg-foreground text-white rounded-lg px-6 py-3 font-medium hover:bg-foreground/90 transition-colors">
						{t("continue_shopping")}
					</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-3 gap-10">
					<div className="md:col-span-2 divide-y divide-border">
						{safeItems.map((i) => (
							<div key={`${i.productId}-${i.size}-${i.color}`} className="flex items-center gap-4 py-5">
								<div className="w-20 h-20 rounded-xl bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden">
									{i.imageUrl ? <img src={i.imageUrl} alt={i.name} className="w-full h-full object-contain p-2" /> : <span className="text-2xl">📱</span>}
								</div>
								<div className="flex-1 min-w-0">
									<div className="font-medium truncate">{i.name}</div>
									<div className="text-muted text-xs flex gap-3 mt-1">
										{i.size ? <span>{i.size}</span> : null}
										{i.color ? <span>{i.color}</span> : null}
									</div>
								</div>
								<div className="flex items-center border border-border rounded-lg">
									<button onClick={() => updateQty(i.productId, i.size, i.color, i.qty - 1)} className="w-8 h-8 flex items-center justify-center">-</button>
									<span className="w-8 text-center text-sm">{i.qty}</span>
									<button onClick={() => updateQty(i.productId, i.size, i.color, i.qty + 1)} className="w-8 h-8 flex items-center justify-center">+</button>
								</div>
								<div className="font-semibold w-24 text-end">{formatPriceDZD(i.priceCents * i.qty)}</div>
								<button onClick={() => removeItem(i.productId, i.size, i.color)} aria-label="remove" className="text-muted hover:text-foreground">
									<CloseIcon className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>

					<aside className="border border-border rounded-2xl p-6 self-start space-y-5">
						<h2 className="font-bold text-lg">{t("order_summary")}</h2>
						<div>
							<div className="text-sm text-muted mb-2">{t("discount_code")}</div>
							<input
								value={promo}
								onChange={(e) => setPromo(e.target.value)}
								placeholder={t("code_placeholder")}
								className="w-full bg-surface-muted rounded-lg px-4 py-2.5 text-sm outline-none"
							/>
						</div>
						<div>
							<div className="text-sm text-muted mb-2">{t("bonus_card")}</div>
							<div className="flex gap-2">
								<input
									value={bonusCard}
									onChange={(e) => setBonusCard(e.target.value)}
									placeholder={t("card_number_placeholder")}
									className="flex-1 bg-surface-muted rounded-lg px-4 py-2.5 text-sm outline-none"
								/>
								<button type="button" className="border border-border rounded-lg px-4 text-sm font-medium hover:border-foreground/50 transition-colors">
									{t("apply")}
								</button>
							</div>
						</div>
						<div className="border-t border-border pt-4 flex justify-between font-bold">
							<span>{t("total")}</span>
							<span>{formatPriceDZD(total)}</span>
						</div>
						<Link
							href="../checkout"
							className="block text-center bg-foreground text-white rounded-lg px-6 py-3 font-medium hover:bg-foreground/90 transition-colors"
						>
							{t("checkout")}
						</Link>
					</aside>
				</div>
			)}
		</main>
	);
}
