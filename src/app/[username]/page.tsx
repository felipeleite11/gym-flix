'use client'

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  ArrowLeft,
  Flame,
  LoaderIcon
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { baserow } from '@/lib/baserow';
import { format, isAfter, subDays } from 'date-fns';
import { AppHeader } from '../../components/AppHeader';
import { RightDrawer } from '../../components/RightDrawer';
import { ExerciseItem } from '../../components/ExerciseItem';
import { ExerciseModal } from '../../components/ExerciseModal';
import { Toast } from '../../components/Toast';
import { useParams } from 'next/navigation';

export default function Dashboard() {
	const { username } = useParams()

	const { data: user } = useUser({ username: String(username) })

	const [workouts, setWorkouts] = useState<Workout[]>(() => {
		return user?.workouts || []
	})

	const [completedExercises, setCompletedExercises] = useState<number[]>([])

	const [activeScreen, setActiveScreen] = useState<ActiveScreen>('explore');
	const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
	const [isExercisePlayerOpen, setIsExercisePlayerOpen] = useState(false);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const [toastMessage, setToastMessage] = useState('');
	const [isToastOpen, setIsToastOpen] = useState(false);

	const [showCompleteWorkoutHistoryList, setShowCompleteWorkoutHistoryList] = useState(false)

	useEffect(() => {
		if(user) {
			setWorkouts(user.workouts)
		} 
	}, [user])

	const showSystemToast = (msg: string) => {
		setToastMessage(msg);
		setIsToastOpen(true);
	}

	const handleSelectWorkout = (workoutId: number) => {
		setSelectedWorkoutId(workoutId);
		setActiveScreen('workout_detail');
	}

	const handleSelectExercise = (index: number) => {
		setCurrentExerciseIndex(index);
		setIsExercisePlayerOpen(true);
	}

	const activeWorkout = workouts.find((w) => w.id === selectedWorkoutId);
	const activeExercise = activeWorkout?.exercises[currentExerciseIndex];

	const { data: workoutHistory } = useQuery({
		queryKey: ['get-workout-history'],
		queryFn: async () => {
			const history = await baserow.helpers.findHistoryItems(user!.id)

			return history
		},
		enabled: !!user
	})

	const { mutate: registerOnHistory } = useMutation({
		mutationFn: async (workout: Workout) => {
			if(!user) return null

			await baserow.helpers.createHistoryItem({
				userId: user.id,
				workoutId: workout.id
			})
		}
	})

	const handleMarkCompleted = (exerciseId: number) => {
		if (!completedExercises.includes(exerciseId)) {
			const updated = [...completedExercises, exerciseId];
			setCompletedExercises(updated);
			showSystemToast('Exercício finalizado com sucesso! 💪');

			if(activeWorkout?.exercises.length === updated.length) {
				registerOnHistory(activeWorkout)
			}
		}
	};

	const handleNextExercise = () => {
		if (activeWorkout && currentExerciseIndex < activeWorkout.exercises.length - 1) {
			setCurrentExerciseIndex(currentExerciseIndex + 1);
		}
	};

	const handlePrevExercise = () => {
		if (currentExerciseIndex > 0) {
			setCurrentExerciseIndex(currentExerciseIndex - 1);
		}
	};

	if(!user) {
		return (
			<div className="flex flex-col gap-4 items-center text-slate-400 justify-center h-screen">
				<LoaderIcon className="animate-spin" size={40} />
				<span>Aguarde...</span>
			</div>
		)
	}

	const workoutHistoryLast30Days = workoutHistory?.filter((w: any) => isAfter(new Date(w.date), subDays(new Date(), 30))) || []
	const workoutHistoryLast7Days = workoutHistory?.filter((w: any) => isAfter(new Date(w.date), subDays(new Date(), 7))) || []
	const truncatedWorkoutHistoryList = workoutHistory?.slice(0, 3) || []
	
	return (
		<div className="min-h-screen bg-[#040806] flex items-center justify-center antialiased">
			<div
				id="mobile-viewport-container"
				className="w-full h-screen bg-brand-bg text-white overflow-hidden flex flex-col relative"
			>
				<AppHeader
					userName={user.name || ''}
					onOpenDrawer={() => setIsDrawerOpen(true)}
				/>

				<main className="flex-1 overflow-y-auto px-4 py-5 flex flex-col">
					<AnimatePresence mode="wait">
						{/* Screen 1: GALERIA DE TREINOS */}
						{activeScreen === 'explore' && (
							<motion.section
								key="screen-explore"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="space-y-5 flex-1 flex flex-col"
							>
								<div className="flex items-end justify-between">
									<div className="space-y-0.5">
										<span className="text-[10px] uppercase tracking-wide text-white/50 font-sans font-medium">Musculação</span>
										<h1 className="text-[21px] font-sans font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
											GYM Flix
										</h1>
									</div>
									{workoutHistory && (
										<div className="bg-neon-lime/10 text-neon-lime px-3 py-1 rounded-full text-[11px] font-sans font-bold flex items-center gap-1 border border-neon-lime/20">
											<Flame className="w-4 h-4 text-neon-lime fill-neon-lime animate-pulse" />
											<span>{workoutHistory.length} treino(s) concluído(s)</span>
										</div>
									)}
								</div>

								<p className="text-[11px] text-zinc-300 font-sans leading-[150%]">
									Escolha seu treino abaixo para iniciar. Acompanhe a execução perfeita de cada exercício assistindo aos vídeos e registre seu progresso diário.
								</p>

								{/* <div className="bg-[#121815] p-4 rounded-[15px] border border-white/5 flex justify-between items-center">
									<div className="flex flex-col gap-[6px]">
										<span className="text-[8px] text-white/40 uppercase">Exercícios Concluídos</span>
										<span className="text-[14px] font-sans font-bold text-[#ccff00] flex items-center gap-1">
											{completedExercises.length} exercícios 🏆
										</span>
									</div>
									<div className="flex flex-col gap-[6px] items-end">
										<span className="text-[8px] text-white/40 uppercase">Status do Dia</span>
										<span className="text-[11px] font-sans text-[#ccff00] font-semibold uppercase">
											{completedExercises.length > 0 ? 'Em Andamento' : 'Pendente'}
										</span>
									</div>
								</div> */}

								<div className="pt-2">
									<h2 className="text-[15px] font-sans font-bold text-white mb-3 uppercase">
										Seus treinos
									</h2>

									<div className="grid grid-cols-1 gap-4">
										{user.workouts.map((wk: any) => {
											const exerciseIds = wk.exercises.map((e: any) => e.id);
											const doneTodayCount = exerciseIds.filter((id: number) =>
												completedExercises.includes(id)
											).length;

											return (
												<div key={wk.id} className="relative">
													<button
														id={`workout-card-btn-${wk.id}`}
														onClick={() => handleSelectWorkout(wk.id)}
														className="w-full text-left bg-card-bg rounded-[20px] shadow-sm hover:shadow-md border border-white/5 hover:border-neon-lime/20 overflow-hidden cursor-pointer flex flex-col justify-between transition-all"
													>
														<div className="p-4 w-full">
															<div className="flex items-center justify-between mb-2">
																<span className="text-[10px] font-sans font-bold tracking-wide text-neon-lime bg-neon-lime/10 px-2 py-0.5 rounded-full inline-block border border-neon-lime/20">
																	{wk.exercises.length} EXERCÍCIOS
																</span>
																{/* <span className="text-[11px] text-white/50 font-sans font-normal">
																	{doneTodayCount}/{wk.exercises.length} feitos hoje
																</span> */}
															</div>
															<h3 className="text-[18px] font-sans font-bold text-white leading-tight">
																{wk.name}
															</h3>
															<p className="text-[11px] text-zinc-300 font-sans leading-[150%] mt-1 line-clamp-2">
																{wk.description}
															</p>

															{/* {wk.exercises.length > 0 && (
																<div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
																	<div
																		className="h-full bg-[#ccff00] transition-all duration-500 shadow-[0_0_8px_#ccff00]"
																		style={{ width: `${(doneTodayCount / wk.exercises.length) * 100}%` }}
																	/>
																</div>
															)} */}
														</div>
														<div className="px-4 py-2.5 bg-white/1 border-t border-white/5 flex items-center justify-between w-full">
															<span className="text-[11px] font-sans font-medium text-neon-lime">Visualizar treino →</span>
															{doneTodayCount === wk.exercises.length && wk.exercises.length > 0 ? (
																<span className="text-[11px] font-sans font-bold text-neon-lime">✓ Concluído</span>
															) : null}
														</div>
													</button>
												</div>
											);
										})}
									</div>
								</div>
							</motion.section>
						)}

						{/* Screen 2: LISTA DE EXERCÍCIOS DO TREINO ESCOLHIDO */}
						{activeScreen === 'workout_detail' && (
							<motion.section
								key="screen-workout-detail"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="space-y-4 flex-1"
							>
								<button
									id="back-to-explore-btn"
									onClick={() => setActiveScreen('explore')}
									className="flex items-center gap-1.5 text-white hover:text-neon-lime transition-colors py-1 shrink-0 cursor-pointer"
								>
									<ArrowLeft className="w-5 h-5 text-white" />
									<span className="text-[13px] font-sans font-medium">Voltar</span>
								</button>

								{activeWorkout && (
									<div className="bg-card-bg rounded-[20px] p-5 border border-white/5 relative overflow-hidden">
										<span className="text-[10px] uppercase font-sans font-bold tracking-wider text-white/40">Ficha Ativa</span>
										{/* Screen Title: font 21px bold */}
										<h1 className="text-[21px] font-sans font-bold text-white mt-1 mb-1.5 leading-tight">
											{activeWorkout.name}
										</h1>
										<p className="text-[11px] text-zinc-300 font-sans leading-[150%] mb-3">
											{activeWorkout.description}
										</p>

										{/* Progress details bento structure (Field data format) */}
										{/* <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
											<div className="flex flex-col gap-1.5">
												<span className="text-[8px] text-white/40 uppercase">EXERCÍCIOS</span>
												<span className="text-[11px] text-white font-semibold">
													{activeWorkout.exercises.length} metas
												</span>
											</div>
											<div className="flex flex-col gap-1.5">
												<span className="text-[8px] text-white/40 uppercase">ESTADO DIÁRIO</span>
												<span className="text-[11px] text-[#ccff00] font-semibold">
													{activeWorkout.exercises.filter(ex => completedExercises.includes(ex.id)).length} de {activeWorkout.exercises.length}
												</span>
											</div>
											<div className="flex flex-col gap-1.5">
												<span className="text-[8px] text-white/40 uppercase">FOCO RECRUTADO</span>
												<span className="text-[11px] text-white font-semibold">
													{activeWorkout.exercises[0]?.category || 'Geral'}
												</span>
											</div>
										</div> */}
									</div>
								)}

								{activeWorkout && activeWorkout.exercises.length > 0 && activeWorkout.exercises.every(ex => completedExercises.includes(ex.id)) && (
									<motion.div
										initial={{ scale: 0.95, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										className="p-5 bg-neon-lime/10 border border-neon-lime/30 rounded-2xl text-white text-center space-y-2 mt-4 shadow-md"
									>
										<Trophy className="w-8 h-8 mx-auto text-neon-lime" />
										<h3 className="font-sans font-bold text-[16px] text-neon-lime">Treino completo!</h3>
										<p className="text-[11px] text-zinc-300 font-sans leading-[150%]">
											Você deu o seu máximo no treino {activeWorkout.name}. Hidrate-se e descanse a musculatura.
										</p>
									</motion.div>
								)}

								<div className="space-y-3 pt-2">
									<h2 className="text-[18px] font-sans font-bold text-white flex items-center justify-between px-2">
										Exercícios
									</h2>

									<div className="flex flex-col gap-3">
										{activeWorkout?.exercises.map((exercise, index) => {
											const isCompleted = completedExercises.includes(exercise.id);

											return (
												<ExerciseItem
													key={exercise.id}
													exercise={exercise}
													isCompleted={isCompleted}
													index={index}
													onSelect={() => handleSelectExercise(index)}
												/>
											);
										})}

										{/* {activeWorkout?.exercises.length === 0 && (
											<div className="text-center py-10 bg-[#121815] rounded-xl border border-dashed border-white/10">
												<span className="text-[11px] font-sans text-white/40 block mb-3">Nenhum exercício cadastrado nesta ficha.</span>
												<button
													onClick={() => {
														setFormWorkoutId(selectedWorkoutId || 'treino-a');
														setActiveScreen('add_workout');
													}}
													className="bg-[#000000] text-[#FFFFFF] text-[13px] px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 border border-white/5 hover:bg-zinc-900 cursor-pointer"
												>
													<Plus className="w-4 h-4 text-white" /> Adicionar Exercício
												</button>
											</div>
										)} */}
									</div>
								</div>
							</motion.section>
						)}

						{/* Screen 3: DAILY PROGRESS & RESET STATS */}
						{activeScreen === 'progress' && (
							<motion.section
								key="screen-progress"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="space-y-4 flex-1 flex flex-col"
							>
								{/* Headers */}
								<div>
									<span className="text-[10px] uppercase tracking-wide text-white/50 font-sans font-medium">Relatórios</span>
									<h1 className="text-[21px] font-sans font-bold text-white uppercase tracking-tight">
										Progresso pessoal
									</h1>
								</div>

								<div className="grid grid-cols-[2fr_3fr] gap-3">
									<div className="bg-card-bg p-4 rounded-xl border border-white/5 flex flex-col gap-2">
										<span className="text-[8px] text-white/40 uppercase font-medium">Treinos feitos</span>
										<span className="text-[21px] font-sans font-bold text-neon-lime">{workoutHistoryLast30Days.length}</span>
										<span className="text-[10px] font-sans text-white/50">Nos últimos 30 dias</span>
									</div>

									<div className="bg-card-bg p-4 rounded-xl border border-white/5 flex flex-col gap-2">
										<span className="text-[8px] text-white/40 uppercase font-medium">Frequência Semanal</span>
										{workoutHistoryLast7Days && (
											<span className="text-[21px] font-sans font-bold text-neon-lime">
												{workoutHistoryLast7Days.length > 4 ? 'Elevada 🔥' : workoutHistoryLast7Days.length > 2 ? 'Firme 🤙' : 'Baixa'}
											</span>
										)}
										<span className="text-[10px] font-sans text-white/50">Você tem {workoutHistoryLast7Days.length} treinos na última semana</span>
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
																		<span className="text-[8px] text-neon-lime uppercase font-sans font-semibold mb-0.5">{format(new Date(w.date), 'dd/MM/yyyy HH:mm')}</span>
																		<span className="text-[11px] font-bold text-white truncate">{w.workout.name}</span>
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
									<button
										onClick={() => setActiveScreen('explore')}
										className="w-full bg-[#000000] text-[#FFFFFF] border border-white/10 hover:bg-zinc-900 px-4 py-2.5 rounded-[10px] font-sans font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
									>
										Voltar para treinos
									</button>
								</div>
							</motion.section>
						)}

						{/* Screen 5: VISÃO GERAL TABULAR DE DADOS */}
						{activeScreen === 'overview_table' && (
							<motion.section
								key="screen-overview-table"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="space-y-4 flex-1 flex flex-col"
							>
								<div>
									<span className="text-[10px] uppercase tracking-wide text-white/50 font-sans font-medium">Todos os exercícios</span>
									<h1 className="text-[21px] font-sans font-bold text-white uppercase tracking-tight">
										Tabela de Consulta
									</h1>
								</div>

								<p className="text-[11px] text-zinc-300 font-sans leading-[150%]">
									Consulte abaixo a listagem de todos os exercícios, categorizados por grupo muscular.
								</p>

								<div className="flex-1 overflow-x-auto">
									<div className="min-w-81.25 bg-[#FBFBFB] text-[#000000] border border-stone-800 rounded-[10px] overflow-hidden">
										<table className="w-full border-collapse bg-stone-900">
											<thead>
												<tr className="bg-black/5 border-b border-stone-700">
													<th className="p-1.5 text-[13px] font-semibold text-center font-sans text-white">Grupo(s)</th>
													<th className="p-1.5 text-[13px] font-semibold text-center font-sans text-white">Exercício</th>
													<th className="p-1.5 text-[13px] font-semibold text-center font-sans text-white">Meta</th>
													<th className="p-1.5 text-[13px] font-semibold text-center font-sans text-white">Treino</th>
												</tr>
											</thead>
											{/* body rows: font 11px, regular, alignment center */}
											<tbody>
												{workouts.map((wk) =>
													wk.exercises.map((ex, i) => (
														<tr
															key={`${wk.id}-${ex.id}-${i}`}
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
																{wk.name.split(' - ')[0]}
															</td>
														</tr>
													))
												)}
												{workouts.reduce((acc, curr) => acc + curr.exercises.length, 0) === 0 && (
													<tr>
														<td colSpan={4} className="p-3 text-center text-black/40 font-sans text-[11px]">
															Nenhum exercício para mostrar na tabela.
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>
								</div>

								<div className="shrink-0 pt-4">
									<button
										onClick={() => setActiveScreen('explore')}
										className="w-full bg-[#000000] text-[#FFFFFF] text-[16px] font-sans font-bold py-2.5 px-4 rounded-[10px] border border-white/10 flex items-center justify-center hover:bg-zinc-900 active:scale-[0.98] transition-all cursor-pointer text-xs"
									>
										Voltar para Início
									</button>
								</div>
							</motion.section>
						)}
					</AnimatePresence>
				</main>

				{/* Persistent side navigation Drawer */}
				<RightDrawer
					isOpen={isDrawerOpen}
					onClose={() => setIsDrawerOpen(false)}
					activeScreen={activeScreen}
					onNavigate={(screen) => setActiveScreen(screen)}
					userName={user.name || ''}
				/>

				{/* Swipe screen detailed player (Modal is opened full screen) */}
				{activeWorkout && activeExercise && (
					<ExerciseModal
						isOpen={isExercisePlayerOpen}
						onClose={() => setIsExercisePlayerOpen(false)}
						exercise={activeExercise}
						currentIndex={currentExerciseIndex}
						totalCount={activeWorkout.exercises.length}
						isCompleted={completedExercises.includes(activeExercise.id)}
						hasNext={currentExerciseIndex < activeWorkout.exercises.length - 1}
						hasPrev={currentExerciseIndex > 0}
						onNext={handleNextExercise}
						onPrev={handlePrevExercise}
						onMarkCompleted={handleMarkCompleted}
					/>
				)}

				{/* Global state-driven Toast */}
				<Toast
					message={toastMessage}
					isOpen={isToastOpen}
					onClose={() => setIsToastOpen(false)}
				/>
			</div>
		</div>
	)
}
