import Link from "next/link";
import { SmartphoneIcon, ChargerIcon, HeadphonesIcon, ShieldIcon } from "./icons";

type T = (key: string) => string;

const ITEMS = [
	{ slug: "smartphones", Icon: SmartphoneIcon, labelKey: "category_smartphones" },
	{ slug: "chargers", Icon: ChargerIcon, labelKey: "category_chargers" },
	{ slug: "accessories", Icon: HeadphonesIcon, labelKey: "category_accessories" },
	{ slug: "protection", Icon: ShieldIcon, labelKey: "category_protection" },
];

export default function CategoryBar({ t, locale }: { t: T; locale: string }) {
	return (
		<section className="bg-surface-muted/60 py-12">
			<div className="px-4 md:px-10">
				<h2 className="text-lg font-semibold mb-6">{t("browse_by_category")}</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{ITEMS.map(({ slug, Icon, labelKey }) => (
						<Link
							key={slug}
							href={`/${locale}/shop?category=${slug}`}
							className="flex flex-col items-center gap-3 bg-surface rounded-2xl py-8 border border-border hover:border-foreground/30 transition-colors"
						>
							<Icon className="w-7 h-7" />
							<span className="text-sm font-medium text-center">{t(labelKey)}</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
