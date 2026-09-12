import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
	return (
		<nav className="flex items-center gap-2 text-sm text-muted flex-wrap">
			{items.map((item, i) => (
				<span key={i} className="flex items-center gap-2">
					{i > 0 && <span>/</span>}
					{item.href ? (
						<Link href={item.href} className="hover:text-foreground transition-colors">{item.label}</Link>
					) : (
						<span className="text-foreground font-medium">{item.label}</span>
					)}
				</span>
			))}
		</nav>
	);
}
