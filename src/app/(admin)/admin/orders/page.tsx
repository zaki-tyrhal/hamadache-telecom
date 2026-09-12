"use client";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import Link from "next/link";
import { formatPriceDZD } from "@/lib/currency";

const STATUS_STYLES: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-700",
	confirmed: "bg-blue-100 text-blue-700",
	shipped: "bg-purple-100 text-purple-700",
	delivered: "bg-green-100 text-green-700",
	cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
	const [data, setData] = useState<any[]>([]);
	useEffect(() => {
		let mounted = true;
		http.get("/api/orders").then((r) => { if (mounted) setData(Array.isArray(r.data) ? r.data : []); });
		return () => { mounted = false; };
	}, []);
	async function updateStatus(id: number, status: string) {
		await http.patch(`/api/orders/${id}`, { status });
		const r = await http.get("/api/orders");
		setData(Array.isArray(r.data) ? r.data : []);
	}
	return (
		<main className="min-h-screen px-4 md:px-10 py-10">
			<h1 className="text-3xl font-bold mb-8">Orders</h1>
			<div className="bg-surface border border-border rounded-xl overflow-hidden">
				<table className="w-full text-sm">
					<thead className="text-left text-muted bg-background">
						<tr>
							<th className="py-3 px-4">ID</th>
							<th>Customer</th>
							<th>Total</th>
							<th>Status</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{data.map((o: any) => (
							<tr key={o.id} className="border-t border-border">
								<td className="py-3 px-4"><Link href={`/admin/orders/${o.id}`} className="text-foreground hover:underline">#{o.id}</Link></td>
								<td>{o.customerName}</td>
								<td className="font-medium">{formatPriceDZD(o.totalCents)}</td>
								<td>
									<select
										className={`rounded-lg px-2 py-1 text-xs font-semibold border-0 ${STATUS_STYLES[o.status] || "bg-gray-100 text-gray-700"}`}
										defaultValue={o.status}
										onChange={(e) => updateStatus(o.id, e.target.value)}
									>
										{["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
											<option key={s} value={s}>{s}</option>
										))}
									</select>
								</td>
								<td className="text-right pr-4"><Link href={`/admin/orders/${o.id}`} className="text-foreground hover:underline">View</Link></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</main>
	);
}
