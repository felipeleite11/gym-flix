import { baserow } from '@/lib/baserow'
import { useQuery } from '@tanstack/react-query'

export function useUser() {
	return useQuery({
		queryKey: ['get-customers'],
		queryFn: async () => {
			const user = await baserow.helpers.findUserById(1)

			return user
		},
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
		retry: false
	})
}