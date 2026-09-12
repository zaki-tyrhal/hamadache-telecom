"use client";
import {
	ResponsiveContainer,
	BarChart as RBarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	LineChart,
	Line,
} from "recharts";
import { formatPriceDZD } from "@/lib/currency";

type WilayaRow = { wilaya: string; total: number; count: number };
type ProductRow = { productId: number; name: string; qty: number };
type StatusRow = { status: string; count: number };
type RevenueRow = { day: string; total: number };

const GRID = "#e2e5eb";
const AXIS = "#5b6472";
const PRIMARY = "#0b1f3a";
const ACCENT = "#f97316";
const TOOLTIP_STYLE = { background: "#ffffff", border: "1px solid #e2e5eb", borderRadius: 8, color: "#0b1526" };

export default function AdminCharts({
	wilayaChart,
	productChart,
	statusChart,
	revenueByDay,
	totalRevenue,
	totalOrders,
	totalItems,
	avgOrderValue,
}: {
	wilayaChart: WilayaRow[];
	productChart: ProductRow[];
	statusChart: StatusRow[];
	revenueByDay: RevenueRow[];
	totalRevenue: number;
	totalOrders: number;
	totalItems: number;
	avgOrderValue: number;
}) {
	return (
		<div className="space-y-8">
			<section className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-surface border border-border rounded-xl p-5">
					<div className="text-muted text-xs uppercase tracking-widest">Revenue</div>
					<div className="text-2xl font-bold mt-1 text-foreground">{formatPriceDZD(totalRevenue)}</div>
				</div>
				<div className="bg-surface border border-border rounded-xl p-5">
					<div className="text-muted text-xs uppercase tracking-widest">Orders</div>
					<div className="text-2xl font-bold mt-1 text-foreground">{totalOrders}</div>
				</div>
				<div className="bg-surface border border-border rounded-xl p-5">
					<div className="text-muted text-xs uppercase tracking-widest">Items Sold</div>
					<div className="text-2xl font-bold mt-1 text-foreground">{totalItems}</div>
				</div>
				<div className="bg-surface border border-border rounded-xl p-5">
					<div className="text-muted text-xs uppercase tracking-widest">Avg Order Value</div>
					<div className="text-2xl font-bold mt-1 text-foreground">{formatPriceDZD(avgOrderValue)}</div>
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-surface border border-border rounded-xl p-5">
					<h3 className="text-lg font-semibold mb-3">Top Wilayas by Revenue</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<RBarChart data={wilayaChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" stroke={GRID} />
								<XAxis dataKey="wilaya" stroke={AXIS} tick={{ fill: AXIS }} hide />
								<YAxis stroke={AXIS} tick={{ fill: AXIS }} hide />
								<Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [formatPriceDZD(Number(v)), "Revenue"]} />
								<Bar dataKey="total" fill={PRIMARY} radius={[4, 4, 0, 0]} />
							</RBarChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div className="bg-surface border border-border rounded-xl p-5">
					<h3 className="text-lg font-semibold mb-3">Best Products (Qty)</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<RBarChart data={productChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" stroke={GRID} />
								<XAxis dataKey="name" stroke={AXIS} tick={{ fill: AXIS }} hide />
								<YAxis stroke={AXIS} tick={{ fill: AXIS }} />
								<Tooltip contentStyle={TOOLTIP_STYLE} />
								<Bar dataKey="qty" fill={ACCENT} radius={[4, 4, 0, 0]} />
							</RBarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-surface border border-border rounded-xl p-5">
					<h3 className="text-lg font-semibold mb-3">Orders by Status</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<RBarChart data={statusChart}>
								<CartesianGrid strokeDasharray="3 3" stroke={GRID} />
								<XAxis dataKey="status" stroke={AXIS} tick={{ fill: AXIS }} />
								<YAxis stroke={AXIS} tick={{ fill: AXIS }} />
								<Tooltip contentStyle={TOOLTIP_STYLE} />
								<Bar dataKey="count" fill={PRIMARY} radius={[4, 4, 0, 0]} />
							</RBarChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div className="bg-surface border border-border rounded-xl p-5">
					<h3 className="text-lg font-semibold mb-3">Revenue by Day (Last 30)</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={revenueByDay}>
								<CartesianGrid strokeDasharray="3 3" stroke={GRID} />
								<XAxis dataKey="day" stroke={AXIS} tick={{ fill: AXIS }} hide />
								<YAxis stroke={AXIS} tick={{ fill: AXIS }} />
								<Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [formatPriceDZD(Number(v)), "Revenue"]} />
								<Line type="monotone" dataKey="total" stroke={ACCENT} strokeWidth={2} dot={false} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</section>
		</div>
	);
}
