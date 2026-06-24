'use client'

import { ReactNode, useState } from "react"
import { AnimatePresence } from "motion/react"
import { RightDrawer } from "@/components/RightDrawer"
import { useUser } from "@/hooks/use-user"
import { useParams } from "next/navigation"
import { AppHeader } from "@/components/AppHeader"

interface UserLayoutProps {
	children: ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
	const { username } = useParams()
	
	const { data: user } = useUser({ username: String(username) })

	const [isDrawerOpen, setIsDrawerOpen] = useState(false)

	return (
		<div className="h-full bg-[#040806] flex flex-col antialiased">
			<AppHeader
				userName={user?.name || ''}
				onOpenDrawer={() => setIsDrawerOpen(true)}
			/>

			<main className="justify-center size-full bg-brand-bg text-white px-4 py-5 flex flex-col">
				<AnimatePresence>
					{children}

					<RightDrawer
						isOpen={isDrawerOpen}
						onClose={() => setIsDrawerOpen(false)}
						userName={user?.name || ''}
					/>
				</AnimatePresence>
			</main>
		</div>
	)
}