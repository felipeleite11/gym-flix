'use client'

import { Card } from '@/components/Card';
import { CircleParticles } from '@/components/CircleParticles';
import { useUser } from '@/hooks/use-user';
import { baserow } from '@/lib/baserow';
import { cn } from '@/utils/classnames';
import { useQuery } from '@tanstack/react-query';
import { ArrowRightIcon, Flame, UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Workouts() {
	const { username } = useParams()

	const { data: user } = useUser({ username: String(username) })

	const { data: workoutHistory } = useQuery({
		queryKey: ['get-workout-history'],
		queryFn: async () => {
			const history = await baserow.helpers.findHistoryItems(user!.id)

			return history
		},
		enabled: !!user
	})

	if (!user) {
		return null
	}

	return (
		<motion.section
			key="screen-explore"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className="space-y-5 flex-1 flex flex-col"
		>
			<div className="flex items-end justify-between">
				<div className="space-y-0.5">
					<span className="text-[11px] uppercase tracking-wide text-white/50 font-sans font-medium">Musculação</span>
					<h1 className="text-[21px] font-sans font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
						GYM Flix
					</h1>
				</div>
				{workoutHistory && (
					<div className="bg-neon-lime/10 text-neon-lime px-3 py-1 rounded-full text-xs font-sans font-bold flex items-center gap-1 border border-neon-lime/20">
						<Flame className="size-4 text-neon-lime fill-neon-lime animate-pulse" />
						<span>{workoutHistory.length} treino(s) concluído(s)</span>
					</div>
				)}
			</div>

			<p className="text-sm text-zinc-300 font-sans leading-[150%]">
				Escolha seu treino abaixo para iniciar
			</p>

			<div className="pt-2">
				<h2 className="text-[15px] font-sans font-bold text-white mb-3 uppercase">
					Seus treinos
				</h2>

				<div className="grid grid-cols-1 gap-4">
					{user.workouts.map((wk: Workout) => {
						return (
							<Card key={wk.id}>
								<Link
									href={`/${username}/treino/${wk.id}`}
									className={cn(
										'w-full h-44 text-left bg-card-bg rounded-[20px] shadow-sm hover:shadow-md border border-white/5 hover:border-neon-lime/20 cursor-pointer flex flex-col justify-between transition-all',
										{ 'h-32': wk.supervised }
									)}
								>
									<div className="absolute inset-0 pointer-events-none">
										<CircleParticles id={String(wk.id)} />
										<div className="absolute inset-0 bg-black/30" />
									</div>

									<div className="relative z-10 flex flex-col justify-between h-full">
										<div className="size-full p-4">
											<div className="flex items-center justify-between mb-2">
												{!wk.supervised ? (
													<span className="text-[10px] font-sans font-bold tracking-wide text-neon-lime bg-neon-lime/10 px-2 py-0.5 rounded-full inline-block border border-neon-lime/20 uppercase">
														{wk.exercises.length} exercícios
													</span>
												) : (
													<span className="text-[11px] font-sans font-bold tracking-wide text-neon-lime bg-neon-lime/10 px-2 py-0.5 rounded-full border border-neon-lime/20 flex gap-1 items-center uppercase">
														<UserIcon className="size-3.5" strokeWidth={3.5} />
														Felipe
													</span>
												)}
											</div>
											<h3 className="text-[18px] font-sans font-bold text-white leading-tight">
												{wk.name}
											</h3>
											<p className="text-xs text-zinc-300 font-sans leading-[150%] mt-1 line-clamp-2">
												{wk.description}
											</p>
										</div>

										<div className="px-4 py-2.5 bg-white/1 border-t border-white/5 flex items-center justify-between w-full">
											{!wk.supervised && (
												<div className="text-[12px] font-sans font-medium text-neon-lime flex gap-1 items-center">
													Visualizar treino
													<ArrowRightIcon className="size-3" />
												</div>
											)}
										</div>
									</div>
								</Link>

								<div className='light opacity-0 size-50 rounded-full absolute top-0 left-0 z-10 bg-[radial-gradient(50%_50%_at_50%_50%,#ffffff33_0%,rgba(104,134,255,0)_100%)]'></div>
							</Card>								
						)
					})}
				</div>
			</div>
		</motion.section>
	)
}