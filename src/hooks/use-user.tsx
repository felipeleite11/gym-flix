import { baserow } from '@/lib/baserow'
import { useQuery } from '@tanstack/react-query'

interface UseUserProps {
	username: string
}

export function useUser({ username }: UseUserProps) {
	return useQuery({
		queryKey: ['get-user'],
		queryFn: async () => {
			const user = await baserow.helpers.findUserByUsername(username)

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