'use client'

import { ArrowRightIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Start() {
	const router = useRouter()

	const [username, setUsername] = useState('')

	return (
		<div className="min-h-screen bg-[#040806] flex flex-col antialiased">
			<main className="justify-center w-full h-screen bg-brand-bg text-white px-4 py-5 flex flex-col">
				<AnimatePresence>
					<motion.section
						key="screen-explore"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="space-y-5 flex flex-col"
					>
						<span className="text-xs text-slate-400">Informe seu nome de usuário</span>

						<input
							type="text" className="bg-brand-bg ring ring-slate-500 p-2 focus:outline-0 focus:ring-2 rounded-md"
							onChange={e => {
								setUsername(e.target.value)
							}}
						/>

						<button
							className="bg-[#0e1a14] text-[#FFFFFF] text-[13px] p-3 rounded-lg border border-white/5 hover:bg-zinc-900 cursor-pointer flex items-center gap-2 justify-center"
							onClick={() => {
								if (username) {
									router.replace(`/${username}`)
								} else {
									alert('Informe seu nome de usuário para acessar os treinos.')
								}
							}}
						>
							Acessar
							<ArrowRightIcon className="size-4" />
						</button>
					</motion.section>
				</AnimatePresence>
			</main>
		</div>
	)
}
