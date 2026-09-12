import Link from "next/link";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import AdminProductActions from "@/components/AdminProductActions";
import { formatPriceDZD } from "@/lib/currency";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
	const rows = await db.select().from(products).all();
	const list = Array.isArray(rows) ? rows : [];
	const imgRows = await db.select().from(productImages as any).all();
	const imgs = Array.isArray(imgRows) ? (imgRows as any[]) : [];
	const firstImageByProductId = new Map<number, any>();
	for (const img of imgs) {
		const pid = Number(img.productId);
		if (!firstImageByProductId.has(pid)) firstImageByProductId.set(pid, img);
	}
	return (
		<main className="min-h-screen px-4 md:px-10 py-10">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Products</h1>
				<Link href="/admin/products/new" className="bg-foreground hover:bg-foreground/90 text-white rounded-lg px-4 py-2 font-medium transition-colors">+ New</Link>
			</header>
			<div className="bg-surface border border-border rounded-xl overflow-hidden">
				<table className="w-full text-sm">
					<thead className="text-left text-muted bg-background">
						<tr>
							<th className="py-3 px-4">Image</th>
							<th>Name</th>
							<th>Brand</th>
							<th>Category</th>
							<th>Price</th>
							<th>Stock</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{list.map((p) => {
							const img = firstImageByProductId.get(Number(p.id));
							return (
								<tr key={p.id} className="border-t border-border">
									<td className="py-3 px-4">
										<div className="w-12 h-12 rounded-lg overflow-hidden bg-background flex items-center justify-center">
											{img ? <img src={img.url} alt={img.alt} className="w-full h-full object-contain" /> : <span className="text-lg">📱</span>}
										</div>
									</td>
									<td className="font-medium">{p.name}</td>
									<td className="text-muted">{p.brand}</td>
									<td className="text-muted">{p.category}</td>
									<td>{formatPriceDZD(p.priceCents)}</td>
									<td>
										{p.inStock ? (
											<span className="text-xs font-semibold uppercase bg-green-100 text-green-700 px-2 py-1 rounded">In stock</span>
										) : (
											<span className="text-xs font-semibold uppercase bg-red-100 text-red-700 px-2 py-1 rounded">Out</span>
										)}
									</td>
									<td className="text-right pr-4">
										<AdminProductActions id={p.id} name={p.name} />
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</main>
	);
}
