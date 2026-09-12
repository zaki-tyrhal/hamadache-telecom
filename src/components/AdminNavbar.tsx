"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
	{ href: "/admin", label: "Dashboard" },
	{ href: "/admin/products", label: "Products" },
	{ href: "/admin/orders", label: "Orders" },
];

export default function AdminNavbar() {
	const router = useRouter();
	const pathname = usePathname();
	async function logout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/admin/login");
	}
	return (
		<header className="sticky top-0 z-50 bg-dark text-white shadow-sm">
			<div className="px-4 md:px-10 h-16 flex items-center justify-between">
				<Link href="/admin" className="font-bold text-lg tracking-tight">Hamadache Telecom <span className="text-white/60">Admin</span></Link>
				<nav className="flex items-center gap-1 text-sm">
					{LINKS.map((l) => {
						const active = pathname === l.href;
						return (
							<Link
								key={l.href}
								href={l.href}
								className={`px-3 py-2 rounded-lg transition-colors ${active ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}
							>
								{l.label}
							</Link>
						);
					})}
					<button onClick={logout} className="ml-2 border border-white/30 rounded-lg px-3 py-1.5 text-xs hover:bg-white/10 hover:border-white/50 transition-colors">Logout</button>
				</nav>
			</div>
		</header>
	);
}
