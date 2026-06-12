'use client'

import { ReactNode } from "react"
import { UserContextProvider } from "@/contexts/UserContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from "@tsparticles/slim"

export function Providers({ children }: { children: ReactNode }) {
	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<ParticlesProvider
				init={async engine => {
					await loadSlim(engine)
				}}
			>
				<UserContextProvider>
					{children}
				</UserContextProvider>
			</ParticlesProvider>
		</QueryClientProvider>
	)
}