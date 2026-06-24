'use client'

import { ExerciseItem } from "@/components/ExerciseItem";
import { ExerciseModal } from "@/components/ExerciseModal";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { baserow } from "@/lib/baserow";
import { useWorkout } from "@/storage/workout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, CheckCircleIcon, DumbbellIcon, RotateCwIcon, TrophyIcon, UserIcon } from "lucide-react";
import { motion } from 'motion/react';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Workout() {
	const { username, id: workoutId } = useParams()

	const qc = useQueryClient()

	const router = useRouter()

	const { addExercise, clearWorkout, setWorkout } = useWorkout(strg => strg)

	const { data: user } = useUser({ username: String(username) })

	const workout = user?.workouts.find((w: any) => w.id === Number(workoutId))

	const [completeExercises, setCompleteExercises] = useState<Exercise[]>([])
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
	const [isExercisePlayerOpen, setIsExercisePlayerOpen] = useState(false)

	function handleSelectExercise(index: number) {
		setCurrentExerciseIndex(index)
		setIsExercisePlayerOpen(true)
	}

	const handleNextExercise = () => {
		if (workout && currentExerciseIndex < workout.exercises.length - 1) {
			setCurrentExerciseIndex(currentExerciseIndex + 1)
		}
	}

	const handlePrevExercise = () => {
		if (currentExerciseIndex > 0) {
			setCurrentExerciseIndex(currentExerciseIndex - 1)
		}
	}

	function handleMarkAsCompleted(exercise: Exercise) {
		if (!completeExercises.some(e => e.id === exercise.id)) {
			const updated = [...completeExercises, exercise]
			setCompleteExercises(updated)

			if(workout) {
				setWorkout(workout)
			}

			addExercise(exercise)
			
			if(workout?.exercises.length === updated.length) {
				registerOnHistory(workout)
			}
		}
	}

	function handleRestartWorkout() {
		clearWorkout()
		setCompleteExercises([])
	}

	const { mutate: registerOnHistory } = useMutation({
		mutationFn: async (workout: Workout) => {
			if(!user) return null

			await baserow.helpers.createHistoryItem({
				userId: user.id,
				workoutId: workout.id
			})

			qc.invalidateQueries({
				queryKey: ['get-workout-history']
			})
		},
		onSuccess() {
			clearWorkout()

			router.push(`/${username}/treinos`)
		}
	})

	if (!workout) {
		return null
	}

	const exercise = workout?.exercises[currentExerciseIndex]

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

			{workout && (
				<div className="bg-card-bg rounded-[20px] p-5 border border-white/5 relative overflow-hidden">
					<span className="text-[10px] uppercase font-sans font-bold tracking-wider text-white/40">Treino</span>
					<h1 className="text-[21px] font-sans font-bold text-white mt-1 mb-1.5 leading-tight">
						{workout.name}
					</h1>
					<p className="text-sm text-zinc-300 font-sans leading-[150%] mb-3">
						{workout.description}
					</p>
				</div>
			)}

			{!workout.supervised && (
				<div className="flex flex-col items-end">
					<Button 
						onClick={handleRestartWorkout}
						className="text-white/60"
						size="xs"
					>
						<RotateCwIcon />
						Reiniciar este treino
					</Button>
				</div>
			)}

			{workout && workout.exercises.length > 0 && workout.exercises.every(ex => completeExercises.some(e => e.id === ex.id)) && (
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="p-5 bg-neon-lime/10 border border-neon-lime/30 rounded-2xl text-white text-center space-y-2 mt-4 shadow-md"
				>
					<TrophyIcon className="w-8 h-8 mx-auto text-neon-lime" />
					<h3 className="font-sans font-bold text-[16px] text-neon-lime">Treino completo!</h3>
					<p className="text-xs text-zinc-300 font-sans leading-[150%]">
						Você deu o seu máximo no treino {workout.name}. Hidrate-se e descanse a musculatura.
					</p>
					
					<Button asChild size="sm" className="bg-white/20 hover:bg-white/30">
						<Link href={`/${username}/treinos`}>
							<ArrowLeftIcon />
							Voltar
						</Link>
					</Button>
				</motion.div>
			)}

			{!workout?.supervised ? (
				<div className="space-y-3 pt-2">
					<h2 className="text-[18px] font-sans font-bold text-white flex items-center justify-between px-2">
						Exercícios
					</h2>

					<div className="flex flex-col gap-3">
						{workout?.exercises.map((exercise, index) => {
							const isCompleted = completeExercises.some(e => e.id === exercise.id);

							return (
								<ExerciseItem
									key={exercise.id}
									exercise={exercise}
									isCompleted={isCompleted}
									index={index}
									onSelect={() => handleSelectExercise(index)}
								/>
							)
						})}
					</div>
				</div>
			) : ( // Treino supervisionado
				<div className="flex flex-col gap-6 items-center mt-6">
					<div className="flex text-white/80">
						<UserIcon className="size-12" />
						<DumbbellIcon className="size-7" />
					</div>

					<span className="text-white/80 text-sm text-center">Este treino será acompanhado pelo seu treinador. Marque abaixo quando estiver concluído.</span>

					<Button
						onClick={() => {
							toast.success('Treino finalizado com sucesso! 💪')

							registerOnHistory(workout)
						}}
						className="w-full bg-[#000000] text-lime-500 text-[16px] font-sans font-bold py-5 px-4 rounded-[10px] border border-neon-lime/20 flex items-center justify-center gap-1.5 hover:bg-zinc-950 hover:scale-[102%] active:scale-[0.98] transition-all shadow-md cursor-pointer"
					>
						<CheckCircleIcon className="size-6 shrink-0" style={{ width: '24px', height: '24px' }} />
						Marcar como Concluído
					</Button>
				</div>
			)}

			{workout && exercise && (
				<ExerciseModal
					isOpen={isExercisePlayerOpen}
					onClose={() => setIsExercisePlayerOpen(false)}
					exercise={exercise}
					currentIndex={currentExerciseIndex}
					totalCount={workout.exercises.length}
					isCompleted={completeExercises.some(e => e.id === exercise.id)}
					hasNext={currentExerciseIndex < workout.exercises.length - 1}
					hasPrev={currentExerciseIndex > 0}
					onNext={handleNextExercise}
					onPrev={handlePrevExercise}
					onMarkCompleted={handleMarkAsCompleted}
					isWorkoutComplete={workout.exercises.every(e => completeExercises.some(ce => ce.id === e.id))}
				/>
			)}
		</motion.section>
	)
}