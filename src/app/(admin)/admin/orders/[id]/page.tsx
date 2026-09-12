"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { http } from "@/lib/http";
import { formatPriceDZD } from "@/lib/currency";

const STATUS_STYLES: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-700",
	confirmed: "bg-blue-100 text-blue-700",
	shipped: "bg-purple-100 text-purple-700",
	delivered: "bg-green-100 text-green-700",
	cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrderDetailPage() {
	const params = useParams<{ id: string }>();
	const [order, setOrder] = useState<any>(null);
	const [items, setItems] = useState<any[]>([]);
	const [status, setStatus] = useState<string | null>(null);

	async function load() {
		const r = await http.get(`/api/orders/${params.id}`);
		setOrder(r.data?.order ?? null);
		setItems(Array.isArray(r.data?.items) ? r.data.items : []);
	}

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id]);

	async function updateStatus(newStatus: string) {
		setStatus(null);
		await http.patch(`/api/orders/${params.id}`, { status: newStatus });
		setStatus("Updated");
		load();
	}

	if (!order) {
		return (
			<main className="min-h-screen px-4 md:px-10 py-10">
				<Link href="/admin/orders" className="text-foreground hover:underline text-sm">← Back to orders</Link>
				<p className="text-muted mt-6">Loading…</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen px-4 md:px-10 py-10">
			<Link href="/admin/orders" className="text-foreground hover:underline text-sm">← Back to orders</Link>
			<header className="flex items-center justify-between mt-4 mb-8">
				<h1 className="text-3xl font-bold">Order #{order.id}</h1>
				<select
					className={`rounded-lg px-3 py-2 text-sm font-semibold border-0 ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"}`}
					value={order.status}
					onChange={(e) => updateStatus(e.target.value)}
				>
					{["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
						<option key={s} value={s}>{s}</option>
					))}
				</select>
			</header>
			{status && <p className="text-sm text-green-600 mb-4">{status}</p>}
			<div className="grid md:grid-cols-3 gap-6">
				<section className="md:col-span-2 bg-surface border border-border rounded-xl overflow-hidden">
					<table className="w-full text-sm">
						<thead className="text-left text-muted bg-background">
							<tr>
								<th className="py-3 px-4">Product</th>
								<th>Variant</th>
								<th>Qty</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							{items.map((it) => (
								<tr key={it.id} className="border-t border-border">
									<td className="py-3 px-4">{it.nameSnapshot}</td>
									<td className="text-muted text-xs">{[it.size, it.color].filter(Boolean).join(" / ") || "—"}</td>
									<td>{it.qty}</td>
									<td>{formatPriceDZD(it.priceCents * it.qty)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
				<aside className="bg-surface border border-border rounded-xl p-6 space-y-3 self-start">
					<div className="font-semibold mb-2">Customer</div>
					<div className="text-sm">{order.customerName}</div>
					<div className="text-sm text-muted">{order.phone}</div>
					<div className="text-sm text-muted">{order.wilaya}, {order.address}</div>
					<div className="border-t border-border pt-3 flex justify-between font-semibold">
						<span>Total</span>
						<span>{formatPriceDZD(order.totalCents)}</span>
					</div>
				</aside>
			</div>
		</main>
	);
}
