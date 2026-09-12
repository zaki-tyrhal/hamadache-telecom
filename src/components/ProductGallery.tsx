"use client";
import { useState } from "react";

type Image = { url: string; width: number; height: number; alt: string };

export default function ProductGallery({ images }: { images: Image[] }) {
	const [index, setIndex] = useState(0);
	if (!images || images.length === 0) {
		return <div className="aspect-square bg-surface-muted rounded-2xl flex items-center justify-center text-5xl">📱</div>;
	}
	const current = images[Math.max(0, Math.min(index, images.length - 1))];
	return (
		<div className="flex flex-col-reverse md:flex-row gap-4">
			{images.length > 1 && (
				<div className="flex md:flex-col gap-3">
					{images.map((img, i) => (
						<button
							key={i}
							onClick={() => setIndex(i)}
							className={`w-16 h-16 rounded-xl overflow-hidden bg-surface-muted border-2 transition-colors ${i === index ? "border-foreground" : "border-transparent"}`}
						>
							<img src={img.url} alt={img.alt} className="w-full h-full object-contain p-2" />
						</button>
					))}
				</div>
			)}
			<div className="flex-1 aspect-square bg-surface-muted rounded-2xl overflow-hidden">
				<img src={current.url} alt={current.alt} className="w-full h-full object-contain p-10" />
			</div>
		</div>
	);
}
