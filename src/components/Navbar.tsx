"use client";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon, HeartIcon, CartIcon, UserIcon } from "./icons";

export default function Navbar() {
	const t = useTranslations();
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const [q, setQ] = useState("");

	function switchLocale(target: string) {
		const parts = pathname.split("/").filter(Boolean);
		if (parts.length > 0) parts[0] = target;
		return "/" + parts.join("/");
	}

	function onSearch(e: React.FormEvent) {
		e.preventDefault();
		router.push(`/${locale}/shop${q ? `?q=${encodeURIComponent(q)}` : ""}`);
	}

	return (
		<header className="sticky top-0 z-50 bg-background border-b border-border">
			<div className="px-4 md:px-10 h-20 flex items-center gap-4 md:gap-8">
				<Link href={`/${locale}`} className="text-xl font-bold tracking-tight whitespace-nowrap">
					{t("brand")}
				</Link>

				<form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md">
					<div className="flex items-center gap-2 w-full bg-surface-muted rounded-full px-4 py-2.5 text-sm text-muted">
						<SearchIcon className="w-4 h-4 shrink-0" />
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder={t("shop")}
							className="bg-transparent outline-none w-full placeholder:text-muted"
						/>
					</div>
				</form>

				<nav className="hidden lg:flex items-center gap-6 text-sm">
					<Link href={`/${locale}`} className="hover:text-muted transition-colors">{t("nav_home")}</Link>
					<Link href={`/${locale}/shop`} className="hover:text-muted transition-colors">{t("shop")}</Link>
					<a href={`/${locale}#contact`} className="hover:text-muted transition-colors">{t("contact_title")}</a>
				</nav>

				<div className="flex items-center gap-4 ms-auto">
					<button aria-label="wishlist" className="hidden sm:inline-flex text-foreground/80 hover:text-foreground">
						<HeartIcon />
					</button>
					<Link href={`/${locale}/cart`} aria-label="cart" className="text-foreground/80 hover:text-foreground">
						<CartIcon />
					</Link>
					<Link href="/admin/login" aria-label="account" className="text-foreground/80 hover:text-foreground">
						<UserIcon />
					</Link>
					<select
						defaultValue={locale}
						onChange={(e) => { window.location.assign(switchLocale(e.target.value)); }}
						className="bg-surface-muted rounded-full px-2 py-1 text-xs border-0"
					>
						<option value="fr">FR</option>
						<option value="en">EN</option>
						<option value="ar">AR</option>
					</select>
				</div>
			</div>
			<form onSubmit={onSearch} className="md:hidden px-4 pb-3">
				<div className="flex items-center gap-2 w-full bg-surface-muted rounded-full px-4 py-2 text-sm text-muted">
					<SearchIcon className="w-4 h-4 shrink-0" />
					<input
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder={t("shop")}
						className="bg-transparent outline-none w-full placeholder:text-muted"
					/>
				</div>
			</form>
		</header>
	);
}
