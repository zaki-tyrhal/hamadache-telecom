"use client";
import Link from "next/link";
import { useState } from "react";
import { formatPriceDZD } from "@/lib/currency";
import { HeartIcon } from "./icons";

type Props = {
	id: number;
	locale: string;
	name: string;
	brand?: string;
	priceCents: number;
	compareAtPriceCents?: number | null;
	inStock: boolean;
	condition?: string;
	imageUrl?: string;
	imageAlt?: string;
};

export default function ProductCard({ id, locale, name, priceCents, compareAtPriceCents, inStock, imageUrl, imageAlt }: Props) {
	const [saved, setSaved] = useState(false);
	const hasDiscount = !!compareAtPriceCents && compareAtPriceCents > priceCents;
	return (
		<div className="group">
			<Link href={`/${locale}/product/${id}`} className="block">
				<div className="relative aspect-square bg-surface-muted rounded-2xl overflow-hidden">
					<button
						type="button"
						onClick={(e) => { e.preventDefault(); setSaved((s) => !s); }}
						aria-label="save"
						className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
					>
						<HeartIcon className="w-4 h-4" filled={saved} />
					</button>
					{!inStock && (
						<span className="absolute left-3 top-3 z-10 text-[10px] font-semibold uppercase bg-foreground text-white px-2 py-1 rounded">
							Out of stock
						</span>
					)}
					{hasDiscount && (
						<span className="absolute left-3 top-3 z-10 text-[10px] font-semibold uppercase bg-foreground text-white px-2 py-1 rounded">
							Sale
						</span>
					)}
					{imageUrl ? (
						<img src={imageUrl} alt={imageAlt || name} className="w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105" />
					) : (
						<div className="w-full h-full flex items-center justify-center text-4xl">📱</div>
					)}
				</div>
				<div className="mt-3">
					<div className="text-sm font-medium line-clamp-2 min-h-[2.5em]">{name}</div>
					<div className="mt-1 flex items-baseline gap-2">
						<span className="font-bold">{formatPriceDZD(priceCents)}</span>
						{hasDiscount && <span className="text-muted line-through text-sm">{formatPriceDZD(compareAtPriceCents!)}</span>}
					</div>
				</div>
			</Link>
			<Link
				href={`/${locale}/product/${id}`}
				className="mt-3 block text-center text-sm font-medium bg-foreground text-white rounded-lg py-2.5 hover:bg-foreground/90 transition-colors"
			>
				Buy Now
			</Link>
		</div>
	);
}
