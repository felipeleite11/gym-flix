import { ReactNode } from "react";

interface BadgeProps {
	children: ReactNode
}

export function Badge({ children }: BadgeProps) {
	return (
		<div className="bg-stone-900 border border-gray-700 rounded-lg px-1 py-2 leading-0 text-white/50">{children}</div>
	)
}