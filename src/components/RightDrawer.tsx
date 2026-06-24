'use client'

import { motion, AnimatePresence } from 'motion/react';
import { X, Dumbbell, ChartNoAxesCombinedIcon, NotebookTabsIcon, XIcon } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';

interface RightDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	userName: string;
}

export function RightDrawer({
	isOpen,
	onClose,
	userName,
}: RightDrawerProps) {
	const router = useRouter()
	const pathname = usePathname()
	const { username } = useParams()

	const currentRoute = pathname.split('/').at(-1)

	const menuItems = [
		{ id: 'treinos', label: 'Treinos', icon: Dumbbell },
		{ id: 'progresso', label: 'Progresso', icon: ChartNoAxesCombinedIcon },
		{ id: 'guia', label: 'Guia de exercícios', icon: NotebookTabsIcon }
	]

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.38 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-[#000000] z-1000"
					/>

					<motion.div
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						className="fixed right-0 top-0 bottom-0 w-70 bg-[#0c120f] z-1001 shadow-2xl p-6 flex flex-col justify-between border-l border-white/5"
					>
						<div>
							<div className="flex justify-between items-center pb-6 border-b border-white/5 mb-6">
								<div className="flex flex-col">
									<span className="text-[11px] text-white/50 font-sans uppercase">Atleta</span>
									<span className="text-lg font-sans font-medium text-white">{userName}</span>
								</div>
								<button
									onClick={onClose}
									className="cursor-pointer size-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
								>
									<XIcon className="size-5 text-white" />
								</button>
							</div>

							<div className="space-y-4">
								<nav className="flex flex-col gap-2 mt-2">
									{menuItems.map(item => {
										const IconComponent = item.icon
										const isActive = currentRoute === item.id

										return (
											<button
												key={item.id}
												onClick={() => {
													router.push(`/${username}/${item.id}`)
													onClose()
												}}
												className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${isActive
													? 'bg-neon-lime text-black font-semibold shadow-[0_0_15px_rgba(204,255,0,0.15)]'
													: 'bg-transparent text-white/80 hover:bg-white/5 hover:text-white'
												}`}
											>
												<IconComponent className={`size-4.5 ${isActive ? 'text-black' : 'text-white'}`} />
												<span className="font-sans text-[13px]">{item.label}</span>
											</button>
										);
									})}
								</nav>
							</div>
						</div>

						<div className="pt-4 border-t border-white/5 text-center">
							<span className="text-[11px] font-sans text-white/40">GYM Flix v1.0.0</span>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
