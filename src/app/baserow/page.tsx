'use client'

import { useUser } from "@/hooks/use-customers"

export default function Baserow() {
	const { data: user } = useUser()

	return (
		<pre>
			{user ? JSON.stringify(user, null, 2) : '.....'}
		</pre>
	)
}