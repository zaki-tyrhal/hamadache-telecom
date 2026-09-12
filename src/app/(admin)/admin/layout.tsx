import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div dir="ltr" lang="en" className="min-h-screen bg-background text-foreground">
			<AdminNavbar />
			{children}
		</div>
	);
} 