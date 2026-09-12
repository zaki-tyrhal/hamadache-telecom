type IconProps = { className?: string; filled?: boolean };

export function SearchIcon({ className = "w-4 h-4" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
			<circle cx="11" cy="11" r="7" />
			<path d="M21 21l-4.3-4.3" strokeLinecap="round" />
		</svg>
	);
}

export function HeartIcon({ className = "w-5 h-5", filled = false }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" className={className}>
			<path d="M12 20s-7-4.35-9.5-8.5C.8 8 2 4.5 5.4 4c2-.3 3.7.7 4.6 2.2C10.9 4.7 12.6 3.7 14.6 4c3.4.5 4.6 4 3.9 7.5C16 15.65 12 20 12 20z" strokeLinejoin="round" />
		</svg>
	);
}

export function CartIcon({ className = "w-5 h-5" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
			<circle cx="10" cy="20" r="1.3" />
			<circle cx="18" cy="20" r="1.3" />
		</svg>
	);
}

export function UserIcon({ className = "w-5 h-5" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<circle cx="12" cy="8" r="3.4" />
			<path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" strokeLinecap="round" />
		</svg>
	);
}

export function ChevronDownIcon({ className = "w-4 h-4" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
			<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function ChevronLeftIcon({ className = "w-4 h-4" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
			<path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function ChevronRightIcon({ className = "w-4 h-4" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
			<path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function StarIcon({ className = "w-4 h-4", filled = true }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" className={className}>
			<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8L12 2.5z" strokeLinejoin="round" />
		</svg>
	);
}

export function SmartphoneIcon({ className = "w-6 h-6" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<rect x="7" y="2.5" width="10" height="19" rx="2.2" />
			<path d="M11 18.5h2" strokeLinecap="round" />
		</svg>
	);
}

export function ChargerIcon({ className = "w-6 h-6" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" strokeLinecap="round" />
		</svg>
	);
}

export function HeadphonesIcon({ className = "w-6 h-6" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<path d="M4 13v-1a8 8 0 0 1 16 0v1" strokeLinecap="round" />
			<rect x="2.5" y="13" width="4.5" height="6.5" rx="1.8" />
			<rect x="17" y="13" width="4.5" height="6.5" rx="1.8" />
		</svg>
	);
}

export function ShieldIcon({ className = "w-6 h-6" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<path d="M12 2.5 20 6v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6l8-3.5Z" strokeLinejoin="round" />
		</svg>
	);
}

export function TruckIcon({ className = "w-5 h-5" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<rect x="1.5" y="7" width="12" height="9" rx="1" />
			<path d="M13.5 10h4l3 3.5V16h-7z" strokeLinejoin="round" />
			<circle cx="6" cy="18" r="1.7" />
			<circle cx="17" cy="18" r="1.7" />
		</svg>
	);
}

export function CheckShieldIcon({ className = "w-5 h-5" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<path d="M12 2.5 20 6v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6l8-3.5Z" strokeLinejoin="round" />
			<path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function BoxIcon({ className = "w-5 h-5" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<path d="M3 8l9-4.5L21 8l-9 4.5L3 8Z" strokeLinejoin="round" />
			<path d="M3 8v9l9 4.5V12.5M21 8v9l-9 4.5" strokeLinejoin="round" />
		</svg>
	);
}

export function CloseIcon({ className = "w-4 h-4" }: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
			<path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
		</svg>
	);
}
