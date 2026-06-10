'use client'

import { UserContextProvider } from "@/contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<UserContextProvider>
				{children}
			</UserContextProvider>
		</QueryClientProvider>
	)
}