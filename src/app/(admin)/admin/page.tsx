import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import AdminCharts from "@/components/AdminCharts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
	const oRows = await db.select().from(orders as any).all();
	const iRows = await db.select().from(orderItems as any).all();
	const pRows = await db.select().from(products as any).all();
	const allOrders: any[] = Array.isArray(oRows) ? (oRows as any[]) : [];
	const allItems: any[] = Array.isArray(iRows) ? (iRows as any[]) : [];
	const allProducts: any[] = Array.isArray(pRows) ? (pRows as any[]) : [];

	const wilayaTotals = new Map<string, { total: number; count: number }>();
	for (const o of allOrders) {
		const key = String((o.wilaya ?? "")).trim() || "Unknown";
		const prev = wilayaTotals.get(key) || { total: 0, count: 0 };
		prev.total += Number(o.totalCents) || 0;
		prev.count += 1;
		wilayaTotals.set(key, prev);
	}
	const wilayaChart = Array.from(wilayaTotals.entries())
		.map(([wilaya, v]) => ({ wilaya, total: v.total, count: v.count }))
		.sort((a, b) => b.total - a.total)
		.slice(0, 10);

	const productQty = new Map<number, { qty: number; name: string }>();
	const idToName = new Map(allProducts.map((p) => [Number(p.id), String(p.name)] as const));
	for (const it of allItems) {
		const pid = Number(it.productId);
		const prev = productQty.get(pid) || { qty: 0, name: idToName.get(pid) || String(it.nameSnapshot) };
		prev.qty += Number(it.qty) || 0;
		productQty.set(pid, prev);
	}
	const productChart = Array.from(productQty.entries())
		.map(([productId, v]) => ({ productId, name: v.name, qty: v.qty }))
		.sort((a, b) => b.qty - a.qty)
		.slice(0, 10);

	const statusCounts = new Map<string, number>();
	for (const o of allOrders) {
		const s = String(o.status || "pending");
		statusCounts.set(s, (statusCounts.get(s) || 0) + 1);
	}
	const statusChart = Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count }));

	const now = Date.now();
	const start = now - 29 * 24 * 60 * 60 * 1000;
	const dayTotals = new Map<string, number>();
	for (let d = 0; d < 30; d++) {
		const day = new Date(start + d * 24 * 60 * 60 * 1000);
		const label = day.toISOString().slice(0, 10);
		dayTotals.set(label, 0);
	}
	for (const o of allOrders) {
		const ts = typeof o.createdAt === "number" ? o.createdAt : new Date(o.createdAt as any).getTime();
		if (!ts || ts < start) continue;
		const label = new Date(ts).toISOString().slice(0, 10);
		dayTotals.set(label, (dayTotals.get(label) || 0) + (Number(o.totalCents) || 0));
	}
	const revenueByDay = Array.from(dayTotals.entries()).map(([day, total]) => ({ day, total }));

	const totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.totalCents) || 0), 0);
	const totalOrders = allOrders.length;
	const totalItems = allItems.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
	const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

	return (
		<main className="min-h-screen px-4 md:px-10 py-10">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-muted text-sm mt-1">Sales overview</p>
			</header>
			<AdminCharts
				wilayaChart={wilayaChart}
				productChart={productChart}
				statusChart={statusChart}
				revenueByDay={revenueByDay}
				totalRevenue={totalRevenue}
				totalOrders={totalOrders}
				totalItems={totalItems}
				avgOrderValue={avgOrderValue}
			/>
		</main>
	);
} 