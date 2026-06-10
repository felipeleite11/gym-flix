import { createContext, ReactNode } from "react"

export const UserContext = createContext({})

export function UserContextProvider({ children }: { children: ReactNode }) {
	return (
		<UserContext.Provider 
			value={{
				
			}}
		>
			{children}
		</UserContext.Provider>
	)
}