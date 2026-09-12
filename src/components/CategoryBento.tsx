import Link from "next/link";
import { SmartphoneIcon, HeadphonesIcon, ChargerIcon, ShieldIcon } from "./icons";

type T = (key: string) => string;

export default function CategoryBento({ t, locale }: { t: T; locale: string }) {
	return (
		<div className="px-4 md:px-10 py-10 grid grid-cols-2 gap-4 md:gap-5">
			<Link href={`/${locale}/shop?category=smartphones`} className="rounded-2xl bg-surface-muted p-6 md:p-8 flex flex-col justify-between hover:opacity-90 transition-opacity min-h-[220px]">
				<div>
					<div className="text-xl md:text-2xl font-bold">{t("category_smartphones")}</div>
					<p className="text-muted text-sm mt-2 max-w-[16rem]">{t("bento_smartphones_desc")}</p>
				</div>
				<div className="flex items-end justify-between">
					<span className="inline-block border border-foreground/20 px-5 py-2 rounded-full text-sm font-medium">{t("cta_shop_now")}</span>
					<SmartphoneIcon className="w-12 h-12 text-foreground/30" />
				</div>
			</Link>

			<Link href={`/${locale}/shop?category=accessories`} className="row-span-2 rounded-2xl bg-surface-muted p-6 md:p-8 flex flex-col justify-between hover:opacity-90 transition-opacity min-h-[220px]">
				<div>
					<div className="text-xl md:text-2xl font-bold">{t("category_accessories")}</div>
					<p className="text-muted text-sm mt-2 max-w-[16rem]">{t("bento_accessories_desc")}</p>
				</div>
				<div className="flex items-end justify-between">
					<span className="inline-block border border-foreground/20 px-5 py-2 rounded-full text-sm font-medium">{t("cta_shop_now")}</span>
					<HeadphonesIcon className="w-14 h-14 text-foreground/30" />
				</div>
			</Link>

			<div className="grid grid-cols-2 gap-4 md:gap-5">
				<Link href={`/${locale}/shop?category=chargers`} className="rounded-2xl bg-dark text-white p-5 flex flex-col justify-between hover:opacity-90 transition-opacity min-h-[140px]">
					<div className="font-semibold text-sm">{t("category_chargers")}</div>
					<ChargerIcon className="w-8 h-8 text-white/50 self-end" />
				</Link>
				<Link href={`/${locale}/shop?category=protection`} className="rounded-2xl bg-dark text-white p-5 flex flex-col justify-between hover:opacity-90 transition-opacity min-h-[140px]">
					<div className="font-semibold text-sm">{t("category_protection")}</div>
					<ShieldIcon className="w-8 h-8 text-white/50 self-end" />
				</Link>
			</div>
		</div>
	);
}
