'use client'

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from 'motion/react';
import { useQuery } from "@tanstack/react-query";
import { baserow } from "@/lib/baserow";
import { useUser } from "@/hooks/use-user";
import { format, isAfter, subDays } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Progress() {
	const { username } = useParams()
	
	const { data: user } = useUser({ username: String(username) })

	const [showCompleteWorkoutHistoryList, setShowCompleteWorkoutHistoryList] = useState(false)

	const { data: workoutHistory } = useQuery({
		queryKey: ['get-workout-history'],
		queryFn: async () => {
			const history = await baserow.helpers.findHistoryItems(user!.id)

			return history
		},
		enabled: !!user
	})

	if(!workoutHistory) {
		return null
	}

	const workoutHistoryLast30Days = workoutHistory?.filter((w: any) => isAfter(new Date(w.date), subDays(new Date(), 30))) || []
	const workoutHistoryLast7Days = workoutHistory?.filter((w: any) => isAfter(new Date(w.date), subDays(new Date(), 7))) || []
	const truncatedWorkoutHistoryList = workoutHistory?.slice(0, 3) || []
	
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
				<span className="text-[10px] uppercase tracking-wide text-white/50 font-sans font-medium">Relatórios</span>
				<h1 className="text-[21px] font-sans font-bold text-white uppercase tracking-tight">
					Progresso pessoal
				</h1>
			</div>

			<div className="grid grid-cols-[2fr_3fr] gap-3">
				<div className="bg-card-bg p-4 rounded-xl border border-white/5 flex flex-col gap-2">
					<span className="text-[10px] text-white/40 uppercase font-medium">Treinos feitos</span>
					<span className="text-[21px] font-sans font-bold text-neon-lime">{workoutHistoryLast30Days.length}</span>
					<span className="text-xs font-sans text-white/50">Últimos 30 dias</span>
				</div>

				<div className="bg-card-bg p-4 rounded-xl border border-white/5 flex flex-col gap-2">
					<span className="text-[10px] text-white/40 uppercase font-medium">Frequência Semanal</span>
					{workoutHistoryLast7Days && (
						<span className="text-[21px] font-sans font-bold text-neon-lime">
							{workoutHistoryLast7Days.length > 4 ? 'Elevada 🔥' : workoutHistoryLast7Days.length > 2 ? 'Firme 🤙' : 'Baixa'}
						</span>
					)}
					<span className="text-xs font-sans text-white/50">Você fez {workoutHistoryLast7Days.length} treinos na última semana</span>
				</div>
			</div>

			<div className="space-y-3 pt-2 grow">
				<h2 className="font-sans font-bold text-white px-2">
					Histórico de treinos
				</h2>

				<div className="space-y-2 overflow-y-auto max-h-96">
					{workoutHistory.length === 0 ? (
						<div className="text-center py-8 bg-card-bg rounded-xl border border-white/5">
							<span className="text-[11px] text-white/40 font-normal font-sans">Nenhum treino concluído nos últimos 30 dias. Escolha um e comece!</span>
						</div>
					) : (
						<>
							<ul
								style={{
									maskImage: showCompleteWorkoutHistoryList ? '' : 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
								}}
								className="overflow-y-auto space-y-2"
							>
								{
									(showCompleteWorkoutHistoryList ? workoutHistory : truncatedWorkoutHistoryList).map((w: any) => {
										return (
											<li key={w.id} className="p-3 bg-card-bg border border-neon-lime/20 rounded-xl flex items-center justify-between">
												<div className="flex flex-col min-w-0">
													<span className="text-[10px] text-neon-lime uppercase font-sans font-semibold mb-0.5">{format(new Date(w.date), 'dd/MM/yyyy HH:mm')}</span>
													<span className="text-sm font-bold text-white truncate">{w.workout.name}</span>
												</div>
												<span className="text-[10px] font-sans text-neon-lime font-bold bg-neon-lime/10 px-2 py-0.5 border border-neon-lime/20 rounded-full shrink-0 flex items-center gap-1">
													Concluído
												</span>
											</li>
										)
									})
								}
							</ul>

							{!showCompleteWorkoutHistoryList && (
								<div className="flex justify-center">
									<span
										className="text-gray-600 text-[12px] cursor-pointer hover:opacity-80"
										onClick={() => {
											setShowCompleteWorkoutHistoryList(true)
										}}
									>
										Mostrar mais
									</span>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			<div className="pt-4 border-t border-white/5 flex flex-col gap-2 shrink-0">
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