"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

export default function Hero() {
	const t = useTranslations();
	const locale = useLocale();
	return (
		<section className="relative bg-dark text-white overflow-hidden rounded-2xl mx-4 md:mx-10 mt-6">
			<div className="relative z-10 px-8 md:px-16 py-16 md:py-24 max-w-xl">
				<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-white/50 text-sm mb-3">
					{t("hero_overline")}
				</motion.div>
				<motion.h1
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]"
				>
					{t("brand")}
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mt-4 text-white/60"
				>
					{t("tagline")}
				</motion.p>
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-8">
					<Link
						href={`/${locale}/shop`}
						className="inline-block border border-white/70 hover:bg-white hover:text-dark px-7 py-3 rounded-full text-sm font-medium transition-colors"
					>
						{t("cta_shop_now")}
					</Link>
				</motion.div>
			</div>
			<motion.img
				initial={{ opacity: 0, x: 30 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.6, delay: 0.15 }}
				src="/products/smartphone.svg"
				alt=""
				className="hidden md:block absolute right-4 lg:right-16 top-1/2 -translate-y-1/2 w-56 lg:w-72 rotate-6 drop-shadow-2xl"
			/>
		</section>
	);
}
