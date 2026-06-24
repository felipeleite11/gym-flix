'use client'

import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { ArrowLeftIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Guide() {
	const { username } = useParams()

	const { data: user } = useUser({ username: String(username) })

	if(!user?.workouts) {
		return null
	}

	const { workouts } = user

	return (
		<motion.section
			key="screen-workout-detail"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className="space-y-4 flex-1"
		>
			<Link
				href={`/${username}/treinos`}
				className="flex items-center gap-1.5 text-white group hover:text-neon-lime transition-colors py-1 shrink-0 cursor-pointer"
			>
				<ArrowLeftIcon className="w-5 h-5 text-white group-hover:text-neon-lime" />
				<span className="text-[13px] font-sans font-medium">Voltar</span>
			</Link>

			<div>
				<span className="text-[10px] uppercase tracking-wide text-white/50 font-sans font-medium">Todos os exercícios</span>
				<h1 className="text-[21px] font-sans font-bold text-white uppercase tracking-tight">
					Tabela de Consulta
				</h1>
			</div>

			<p className="text-xs text-zinc-300 font-sans leading-[150%]">
				Consulte abaixo a listagem de todos os exercícios, categorizados por grupo muscular.
			</p>

			<div className="flex-1 overflow-x-auto">
				<div className="min-w-81.25 border border-stone-800 rounded-[10px] overflow-hidden">
					<table className="w-full border-collapse bg-[#101b15]">
						<thead>
							<tr className="bg-black/5 border-b border-stone-700">
								<th className="p-1.5 text-[13px] font-semibold text-center font-sans text-white">Grupo(s)</th>
								<th className="p-1.5 text-[13px] font-semibold text-center font-sans text-white">Exercício</th>
								<th className="p-1.5 text-[13px] font-semibold text-center font-sans text-white">Meta</th>
								<th className="p-1.5 text-[13px] font-semibold text-center font-sans text-white">Treino</th>
							</tr>
						</thead>
						<tbody>
							{workouts.map(wk => {
								const workoutIdentifier = wk.name.split(' - ')[0].replace('Treino', '')

								return wk.exercises.map(ex => (
									<tr
										key={ex.id}
										className="border-b border-stone-600 last:border-b-0 hover:bg-black/5 transition-colors text-white"
									>
										<td className="p-1.5 text-[11px] font-normal text-center font-sans text-white/80">
											{ex.focus.join(', ')}
										</td>
										<td className="p-1.5 text-[11px] font-bold text-center font-sans">
											{ex.name}
										</td>
										<td className="p-1.5 text-[11px] font-normal text-center font-sans text-white/80">
											{ex.goal}
										</td>
										<td className="p-1.5 text-[11px] font-semibold text-center font-sans text-emerald-500">
											{workoutIdentifier}
										</td>
									</tr>
								))
							})}

							{workouts.reduce((acc, curr) => acc + curr.exercises.length, 0) === 0 && (
								<tr>
									<td colSpan={4} className="p-3 text-center text-black/40 font-sans text-[11px]">
										Nenhum exercício a exibir.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<div className="shrink-0 pt-4">
				<Button
					asChild
					className="w-full bg-black font-sans font-bold py-5 px-4 rounded-[10px] border border-neon-lime/20 flex items-center justify-center gap-1.5 hover:bg-zinc-950 hover:scale-[102%] active:scale-[0.98] transition-all shadow-md cursor-pointer"
				>
					<Link href={`/${username}/treinos`}>
						Voltar para treinos
					</Link>
				</Button>
			</div>
		</motion.section>
	)
} 