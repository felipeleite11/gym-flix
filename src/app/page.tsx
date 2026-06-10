'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  ArrowLeft,
  ChevronDown,
  PlusCircle,
  Flame
} from 'lucide-react';

import { AppHeader } from '../components/AppHeader';
import { RightDrawer } from '../components/RightDrawer';
import { ExerciseItem } from '../components/ExerciseItem';
import { ExerciseModal } from '../components/ExerciseModal';
import { CustomUpload } from '../components/CustomUpload';
import { Toast } from '../components/Toast';
import { useUser } from '@/hooks/use-customers';
import { useMutation, useQuery } from '@tanstack/react-query';
import { baserow } from '@/lib/baserow';
import { format } from 'date-fns';

export default function Home() {
	const { data: user } = useUser()

	const [workouts, setWorkouts] = useState<Workout[]>(() => {
		return user?.workouts || []
	})

	const [completedExercises, setCompletedExercises] = useState<number[]>([])

	const [activeScreen, setActiveScreen] = useState<ActiveScreen>('explore');
	const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
	const [isExercisePlayerOpen, setIsExercisePlayerOpen] = useState(false);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const [toastMessage, setToastMessage] = useState('');
	const [isToastOpen, setIsToastOpen] = useState(false);

	const [formExerciseName, setFormExerciseName] = useState('');
	const [formCategory, setFormCategory] = useState('Peito');
	const [formSeries, setFormSeries] = useState('4 séries de 12 repetições');
	const [formYoutubeId, setFormYoutubeId] = useState('sqOw2Y6u9as');
	const [formDescription, setFormDescription] = useState('');
	const [formWorkoutId, setFormWorkoutId] = useState('treino-a');
	const [formIsAdvanced, setFormIsAdvanced] = useState(false);
	const [formMediaUrl, setFormMediaUrl] = useState('');

	useEffect(() => {
		if(user) {
			setWorkouts(user.workouts)
		} 
	}, [user])

	const saveWorkouts = (updated: Workout[]) => {
		setWorkouts(updated);
		// localStorage.setItem('gym_flix_workouts_v1', JSON.stringify(updated));
	}

	const showSystemToast = (msg: string) => {
		setToastMessage(msg);
		setIsToastOpen(true);
	}

	const handleSelectWorkout = (workoutId: string) => {
		setSelectedWorkoutId(workoutId);
		setActiveScreen('workout_detail');
	}

	const handleSelectExercise = (index: number) => {
		setCurrentExerciseIndex(index);
		setIsExercisePlayerOpen(true);
	}

	const activeWorkout = workouts.find((w) => w.id === Number(selectedWorkoutId));
	const activeExercise = activeWorkout?.exercises[currentExerciseIndex];

	const { data: workoutHistory } = useQuery({
		queryKey: ['get-workout-history'],
		queryFn: async () => {
			const history = await baserow.helpers.findHistoryItems(user!.id)
			console.log('history', history)
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
			// localStorage.setItem('gym_flix_completed', JSON.stringify(updated));
			showSystemToast('Exercício finalizado com sucesso! 💪');

			if(activeWorkout?.exercises.length === updated.length) {
				// setWorkoutHistory(old => [...old, activeWorkout])

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

	// Reset progress helper
	const handleResetProgress = () => {
		setCompletedExercises([]);
		localStorage.removeItem('gym_flix_completed');
		showSystemToast('Seu progresso diário foi zerado! Estreantes prontos.');
	};

	// Add customized exercise action
	const handleCreateExercise = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formExerciseName.trim() || !formDescription.trim()) {
			showSystemToast('Por favor, preencha o nome do exercício e a instrução!');
			return;
		}

		const newExercise: Exercise = {
			id: `ex-${Date.now()}`,
			name: formExerciseName.trim(),
			category: formCategory,
			series: formSeries,
			focus: ['xxxxx'],
			youtubeId: formYoutubeId.trim() || 'sqOw2Y6u9as',
			description: formDescription.trim(),
		};

		// Append exercise to targeted workout
		const updatedWorkouts = workouts.map((w) => {
			if (w.id === formWorkoutId) {
				return {
					...w,
					exercises: [...w.exercises, newExercise],
				};
			}
			return w;
		});

		saveWorkouts(updatedWorkouts);
		showSystemToast(`Novo exercício "${newExercise.name}" criado!`);

		// Clear state
		setFormExerciseName('');
		setFormDescription('');
		setFormMediaUrl('');
		setFormIsAdvanced(false);

		// Auto-navigate back to workouts to view changes
		setActiveScreen('explore');
	};

	if(!user) {
		return null
	}

	// console.log(workoutHistory)
	
	return (
		<div className="min-h-screen bg-[#040806] flex items-center justify-center p-0 sm:p-4 select-none antialiased">
			<div
				id="mobile-viewport-container"
				className="w-full max-w-105 h-screen sm:h-210 bg-brand-bg text-white sm:rounded-[36px] sm:shadow-2xl sm:border-[8px] sm:border-zinc-900 overflow-hidden flex flex-col relative border border-white/5"
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
									<div className="bg-[#ccff00]/10 text-[#ccff00] px-3 py-1 rounded-full text-[11px] font-sans font-bold flex items-center gap-1 border border-[#ccff00]/20">
										<Flame className="w-4 h-4 text-[#ccff00] fill-[#ccff00] animate-pulse" />
										<span>2 treinos concluídos</span>
									</div>
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

									{/* Gallery of Workouts */}
									<div className="grid grid-cols-1 gap-4">
										{user.workouts.map((wk) => {
											const exerciseIds = wk.exercises.map((e) => e.id);
											const doneTodayCount = exerciseIds.filter((id) =>
												completedExercises.includes(id)
											).length;

											return (
												<div key={wk.id} className="relative">
													<button
														id={`workout-card-btn-${wk.id}`}
														onClick={() => handleSelectWorkout(wk.id)}
														className="w-full text-left bg-[#121815] rounded-[20px] shadow-sm hover:shadow-md border border-white/5 hover:border-[#ccff00]/20 overflow-hidden cursor-pointer flex flex-col justify-between transition-all"
													>
														<div className="p-4 w-full">
															<div className="flex items-center justify-between mb-2">
																<span className="text-[10px] font-sans font-bold tracking-wide text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full inline-block border border-[#ccff00]/20">
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
														<div className="px-4 py-2.5 bg-white/[0.01] border-t border-white/5 flex items-center justify-between w-full">
															<span className="text-[11px] font-sans font-medium text-[#ccff00]">Visualizar Ficha →</span>
															{doneTodayCount === wk.exercises.length && wk.exercises.length > 0 ? (
																<span className="text-[11px] font-sans font-bold text-[#ccff00]">✓ Concluído</span>
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
									<div className="bg-[#121815] rounded-[20px] p-5 border border-white/5 relative overflow-hidden">
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
										className="p-5 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl text-white text-center space-y-2 mt-4 shadow-md"
									>
										<Trophy className="w-8 h-8 mx-auto text-[#ccff00]" />
										<h3 className="font-sans font-bold text-[16px] text-[#ccff00]">Treino completo!</h3>
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

								<div className="grid grid-cols-2 gap-3">
									<div className="bg-[#121815] p-4 rounded-xl border border-white/5 flex flex-col gap-2">
										<span className="text-[8px] text-white/40 uppercase font-medium">Exercícios Feitos</span>
										<span className="text-[21px] font-sans font-bold text-[#ccff00]">{completedExercises.length}</span>
										<span className="text-[10px] font-sans text-white/50">Nos últimos 30 dias</span>
									</div>

									<div className="bg-[#121815] p-4 rounded-xl border border-white/5 flex flex-col gap-2">
										<span className="text-[8px] text-white/40 uppercase font-medium">Frequência Semanal</span>
										<span className="text-[21px] font-sans font-bold text-[#ccff00]">
											{completedExercises.length > 10 ? 'Elevada 🔥' : completedExercises.length > 3 ? 'Firme 🤙' : 'Baixa'}
										</span>
										<span className="text-[10px] font-sans text-white/50">Mantenha a constância</span>
									</div>
								</div>

								{/* Section title: font 18px bold */}
								<div className="space-y-3 pt-2 grow">
									<h2 className="text-[18px] font-sans font-bold text-white px-2">
										Histórico geral
									</h2>

									<div className="space-y-2 max-h-[250px] overflow-y-auto">
										{workoutHistory.length === 0 ? (
											<div className="text-center py-8 bg-[#121815] rounded-xl border border-white/5">
												<span className="text-[11px] text-white/40 font-normal font-sans">Nenhum treino concluído nos últimos 30 dias. Escolha um e comece!</span>
											</div>
										) : (
											workoutHistory.map((w: any) => {
												return (
													<div key={w.id} className="p-3 bg-[#121815] border border-[#ccff00]/20 rounded-xl flex items-center justify-between">
														<div className="flex flex-col min-w-0">
															<span className="text-[8px] text-[#ccff00] uppercase font-sans font-semibold mb-0.5">{format(new Date(w.date), 'dd/MM/yyyy HH:mm')}</span>
															<span className="text-[11px] font-bold text-white truncate">{w.name}</span>
														</div>
														<span className="text-[10px] font-sans text-[#ccff00] font-bold bg-[#ccff00]/10 px-2 py-0.5 border border-[#ccff00]/20 rounded-full shrink-0 flex items-center gap-1">
															Concluído
														</span>
													</div>
												);
											})
										)}
									</div>
								</div>

								{/* Reset system actions: uses Secondary Button styling precisely */}
								<div className="pt-4 border-t border-white/5 flex flex-col gap-2 shrink-0">
									<button
										onClick={handleResetProgress}
										className="w-full bg-[#FFFFFF] text-[#000000] border border-[#D0D0D0] hover:bg-neutral-50 px-4 py-[10px] rounded-[10px] font-sans font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
										id="btn-reset-completed"
									>
										<span>Limpar Registro de Hoje</span>
									</button>
									<button
										onClick={() => setActiveScreen('explore')}
										className="w-full bg-[#000000] text-[#FFFFFF] border border-white/10 hover:bg-zinc-900 px-4 py-[10px] rounded-[10px] font-sans font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
									>
										<span>Voltar para Treinos</span>
									</button>
								</div>
							</motion.section>
						)}

						{/* Screen 4: ADD WORKOUT & CUSTOM EXERCISES FORMS */}
						{activeScreen === 'add_workout' && (
							<motion.section
								key="screen-add-workout"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="space-y-4 flex-1 flex flex-col"
							>
								<div>
									<span className="text-[10px] uppercase tracking-wide text-white/50 font-sans font-medium">Personalizar</span>
									{/* Screen titles: font 21px bold */}
									<h1 className="text-[21px] font-sans font-bold text-white uppercase tracking-tight">
										Adicionar Exercício
									</h1>
								</div>

								{/* Instructions */}
								<p className="text-[11px] text-zinc-300 font-sans leading-[150%]">
									Crie e incorpore novos exercícios personalizados nas suas fichas existentes. Configure o link explicativo do YouTube para visualização correta na tela cheia.
								</p>

								{/* Custom Form implementing specific layout rules */}
								<form onSubmit={handleCreateExercise} className="space-y-3.5 flex-1 select-text">
									<div className="flex flex-col gap-1">
										<label className="text-[13px] font-sans font-normal text-white/60">
											Nome do Exercício
										</label>
										<div className="pt-1">
											<input
												type="text"
												value={formExerciseName}
												onChange={(e) => setFormExerciseName(e.target.value)}
												placeholder="Ex: Crucifixo Inclinado"
												className="w-full bg-[#FFFFFF] text-[#000000] rounded-[10px] text-[16px] p-[6px] border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
												required
												id="form-ex-name"
											/>
										</div>
									</div>

									{/* 2. Select Workout & Category (side by side, utilizing Select input specs) */}
									<div className="grid grid-cols-2 gap-3">
										{/* Choose Workout */}
										<div className="flex flex-col gap-1 relative">
											<label className="text-[13px] font-sans font-normal text-white/60">
												Destino da Ficha
											</label>
											<div className="pt-1 relative">
												<select
													value={formWorkoutId}
													onChange={(e) => setFormWorkoutId(e.target.value)}
													className="w-full bg-[#FFFFFF] text-[#000000] rounded-[10px] text-[16px] p-[6px] border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#ccff00] appearance-none pr-8"
												>
													{workouts.map((w) => (
														<option key={w.id} value={w.id}>{w.name.split(' - ')[0]}</option>
													))}
												</select>
												<ChevronDown className="w-4 h-4 text-black absolute right-3.5 top-[14px] pointer-events-none" />
											</div>
										</div>

										{/* Choose Section Group */}
										<div className="flex flex-col gap-1 relative">
											<label className="text-[13px] font-sans font-normal text-white/60">
												Grupo Muscular
											</label>
											<div className="pt-1 relative">
												<select
													value={formCategory}
													onChange={(e) => setFormCategory(e.target.value)}
													className="w-full bg-[#FFFFFF] text-[#000000] rounded-[10px] text-[16px] p-[6px] border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#ccff00] appearance-none pr-8"
												>
													<option value="Peito">Peito</option>
													<option value="Costas">Costas</option>
													<option value="Bíceps">Bíceps</option>
													<option value="Tríceps">Tríceps</option>
													<option value="Pernas">Pernas</option>
													<option value="Ombros">Ombros</option>
												</select>
												<ChevronDown className="w-4 h-4 text-black absolute right-3.5 top-[14px] pointer-events-none" />
											</div>
										</div>
									</div>

									{/* 3. Series Description Input */}
									<div className="flex flex-col gap-1">
										<label className="text-[13px] font-sans font-normal text-white/60">
											Séries e Carga Estimada
										</label>
										<div className="pt-1">
											<input
												type="text"
												value={formSeries}
												onChange={(e) => setFormSeries(e.target.value)}
												placeholder="Ex: 4 séries de 10-12 repetições"
												className="w-full bg-[#FFFFFF] text-[#000000] rounded-[10px] text-[16px] p-[6px] border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
												required
											/>
										</div>
									</div>

									{/* 4. YouTube Embedded ID input */}
									<div className="flex flex-col gap-1">
										<label className="text-[13px] font-sans font-normal text-white/60">
											ID do Vídeo do YouTube
										</label>
										<div className="pt-1">
											<input
												type="text"
												value={formYoutubeId}
												onChange={(e) => setFormYoutubeId(e.target.value)}
												placeholder="Ex: sqOw2Y6u9as"
												className="w-full bg-[#FFFFFF] text-[#000000] rounded-[10px] text-[16px] p-[6px] border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
												required
											/>
										</div>
									</div>

									{/* 5. Workout Execution multi-line text input */}
									<div className="flex flex-col gap-1">
										<label className="text-[13px] font-sans font-normal text-white/60">
											Explicação do Exercício (Postura)
										</label>
										<div className="pt-1 col-span-2">
											<textarea
												value={formDescription}
												onChange={(e) => setFormDescription(e.target.value)}
												placeholder="Descreva de forma curta e compreensiva as instruções para fazer o exercício..."
												rows={3}
												className="w-full bg-[#FFFFFF] text-[#000000] rounded-[10px] text-[16px] p-[6px] border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
												required
											/>
										</div>
									</div>

									<div className="flex items-center gap-[8px] pt-1">
										<button
											type="button"
											id="checkbox-advanced"
											onClick={() => setFormIsAdvanced(!formIsAdvanced)}
											className={`w-[18px] h-[18px] shrink-0 rounded-[3px] border border-white/10 flex items-center justify-center transition-colors cursor-pointer ${formIsAdvanced ? 'bg-[#000000] text-[#FFFFFF]' : 'bg-[#EFEFEF] text-[#000000]'
												}`}
										>
											{formIsAdvanced && <span className="text-[11px] font-bold">✓</span>}
										</button>
										<label
											onClick={() => setFormIsAdvanced(!formIsAdvanced)}
											className="text-[16px] font-sans font-normal text-white pointer-events-auto cursor-pointer"
										>
											Exercício com Carga Avançada?
										</label>
									</div>

									{/* 7. Upload Box component for thumbnail or video setup support */}
									<div className="pt-2">
										<CustomUpload
											label="Subir imagem demonstrativa"
											instructions="Selecione arquivos JPG ou PNG ou arraste-os para o espaço abaixo."
											onFileSelect={(url) => setFormMediaUrl(url)}
											currentValue={formMediaUrl}
										/>
									</div>

									{/* Submit buttons */}
									<div className="pt-4 space-y-2 shrink-0">
										<button
											type="submit"
											id="submit-ex-btn"
											className="w-full bg-[#000000] text-[#FFFFFF] text-[16px] font-sans font-bold py-[10px] px-4 rounded-[10px] border border-white/10 flex items-center justify-center gap-[6px] hover:bg-zinc-900 active:scale-[0.98] transition-all shadow-md cursor-pointer"
										>
											<PlusCircle className="w-[24px] h-[24px] text-white shrink-0" style={{ width: '24px', height: '24px' }} />
											<span>Cadastrar Exercício</span>
										</button>

										<button
											type="button"
											onClick={() => setActiveScreen('explore')}
											className="w-full bg-[#FFFFFF] text-[#000000] border border-[#D0D0D0] hover:bg-neutral-50 px-4 py-[10px] rounded-[10px] font-sans font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
										>
											<span>Voltar para Início</span>
										</button>
									</div>
								</form>
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
									<div className="min-w-[325px] bg-[#FBFBFB] text-[#000000] border border-stone-800 rounded-[10px] overflow-hidden">
										<table className="w-full border-collapse bg-stone-900">
											<thead>
												<tr className="bg-black/5 border-b border-stone-700">
													<th className="p-[6px] text-[13px] font-semibold text-center font-sans text-white">Grupo(s)</th>
													<th className="p-[6px] text-[13px] font-semibold text-center font-sans text-white">Exercício</th>
													<th className="p-[6px] text-[13px] font-semibold text-center font-sans text-white">Meta</th>
													<th className="p-[6px] text-[13px] font-semibold text-center font-sans text-white">Treino</th>
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
															<td className="p-[6px] text-[11px] font-normal text-center font-sans text-white/80">
																{ex.focus.join(', ')}
															</td>
															<td className="p-[6px] text-[11px] font-bold text-center font-sans">
																{ex.name}
															</td>
															<td className="p-[6px] text-[11px] font-normal text-center font-sans text-white/80">
																{ex.goal}
															</td>
															<td className="p-[6px] text-[11px] font-semibold text-center font-sans text-emerald-500">
																{wk.name.split(' - ')[0]}
															</td>
														</tr>
													))
												)}
												{workouts.reduce((acc, curr) => acc + curr.exercises.length, 0) === 0 && (
													<tr>
														<td colSpan={4} className="p-[12px] text-center text-black/40 font-sans text-[11px]">
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
										className="w-full bg-[#000000] text-[#FFFFFF] text-[16px] font-sans font-bold py-[10px] px-4 rounded-[10px] border border-white/10 flex items-center justify-center hover:bg-zinc-900 active:scale-[0.98] transition-all cursor-pointer"
									>
										<span>Voltar para Início</span>
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
