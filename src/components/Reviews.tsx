import { StarIcon } from "./icons";

// Static sample data — no review submission/storage backend exists yet.
const BREAKDOWN = [
	{ label: "Excellent", value: 100 },
	{ label: "Good", value: 11 },
	{ label: "Average", value: 3 },
	{ label: "Below Average", value: 8 },
	{ label: "Poor", value: 1 },
];

const SAMPLE_REVIEWS = [
	{ name: "Yasmine B.", rating: 5, date: "12 يناير 2026", text: "المنتج أصلي وجاء في الوقت المحدد، السعر كان مناسب جداً مقارنة بالمحلات الأخرى." },
	{ name: "Sofiane K.", rating: 4, date: "3 يناير 2026", text: "خدمة زبائن ممتازة عبر واتساب، تجاوب سريع وشرح مفصل قبل الشراء." },
	{ name: "Amel R.", rating: 5, date: "28 ديسمبر 2025", text: "أفضل محل هواتف في بومرداس، جربت أكثر من مرة ودائماً راضية." },
];

const maxValue = Math.max(...BREAKDOWN.map((b) => b.value));

export default function Reviews({ t }: { t: (key: string) => string }) {
	return (
		<section className="mt-16">
			<h2 className="text-xl font-bold mb-6">{t("reviews_title")}</h2>
			<div className="grid md:grid-cols-[auto_1fr] gap-8 items-start mb-8">
				<div className="bg-surface-muted rounded-2xl p-6 text-center w-full md:w-48">
					<div className="text-4xl font-bold">4.8</div>
					<div className="flex justify-center gap-1 my-2 text-foreground">
						{Array.from({ length: 5 }).map((_, i) => (
							<StarIcon key={i} className="w-4 h-4" filled={i < 5} />
						))}
					</div>
					<div className="text-xs text-muted">{t("reviews_of_count")}</div>
				</div>
				<div className="space-y-2 w-full">
					{BREAKDOWN.map((b) => (
						<div key={b.label} className="flex items-center gap-3 text-sm">
							<span className="w-28 text-muted shrink-0">{b.label}</span>
							<div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
								<div className="h-full bg-foreground rounded-full" style={{ width: `${(b.value / maxValue) * 100}%` }} />
							</div>
							<span className="w-8 text-end text-muted">{b.value}</span>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-6">
				{SAMPLE_REVIEWS.map((r, i) => (
					<div key={i} className="border-b border-border pb-6">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-sm font-semibold">
									{r.name.charAt(0)}
								</div>
								<div>
									<div className="font-medium text-sm">{r.name}</div>
									<div className="flex gap-0.5">
										{Array.from({ length: 5 }).map((_, s) => (
											<StarIcon key={s} className="w-3 h-3" filled={s < r.rating} />
										))}
									</div>
								</div>
							</div>
							<span className="text-xs text-muted">{r.date}</span>
						</div>
						<p className="text-sm text-muted">{r.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}
