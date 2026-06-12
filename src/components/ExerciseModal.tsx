'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, ArrowLeftIcon } from 'lucide-react';
import YouTube from 'react-youtube';

interface ExerciseModalProps {
	exercise: Exercise;
	isOpen: boolean;
	onClose: () => void;
	onMarkCompleted: (exerciseId: number) => void;
	isCompleted: boolean;
	onNext: () => void;
	onPrev: () => void;
	hasNext: boolean;
	hasPrev: boolean;
	currentIndex: number;
	totalCount: number;
	isWorkoutComplete: boolean
}

export function ExerciseModal({
	exercise,
	isOpen,
	onClose,
	onMarkCompleted,
	isCompleted,
	onNext,
	onPrev,
	hasNext,
	hasPrev,
	currentIndex,
	totalCount,
	isWorkoutComplete = false
}: ExerciseModalProps) {
	const [successTriggered, setSuccessTriggered] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setSuccessTriggered(false)
		}, 2600)
	}, [exercise.id])

	function getRandomCongratulationSentence() {
		const sentences = [
			'Excelente trabalho!',
			'Vamos continuar!',
			'Estamos indo bem!',
			'Não perca o foco',
			'Muito bom!',
			'Continue se desafiando'
		]

		const randomIndex = Math.floor(Math.random() * sentences.length)

		return sentences[randomIndex]
	}

	const handleDragEnd = (_: any, info: any) => {
		const swipeThreshold = 50; // pixels
		if (info.offset.x < -swipeThreshold) {
			// Swiped left -> NEXT
			if (hasNext) {
				onNext();
			}
		} else if (info.offset.x > swipeThreshold) {
			// Swiped right -> PREV
			if (hasPrev) {
				onPrev();
			}
		}
	}

	const handleComplete = () => {
		setSuccessTriggered(true)
		onMarkCompleted(exercise.id)

		if (hasNext) {
			setTimeout(() => {
				// onNext()
				setSuccessTriggered(false)
				onClose()
			}, 1500)
		} else {
			setTimeout(onClose, 1500)
		}
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					id="exercise-modal-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-brand-bg z-2000 flex flex-col h-full overflow-hidden select-none text-white"
				>
					<div className="w-full bg-[#0a110e] flex items-center justify-between p-4 border-b border-white/5 shrink-0">
						<button
							onClick={() => {
								setSuccessTriggered(false)
								onClose()
							}}
							className="flex items-center gap-1.5 text-white hover:text-neon-lime transition-colors py-1 shrink-0 cursor-pointer"
						>
							<ArrowLeftIcon className="w-5 h-5 text-white" />
							<span className="text-[13px] font-sans font-medium">Voltar</span>
						</button>

						<div className="flex flex-col items-center">
							<span className="text-[10px] uppercase font-sans tracking-wide text-white/50">Exercício</span>
							<span className="text-[13px] font-sans font-bold text-neon-lime">
								{currentIndex + 1} de {totalCount}
							</span>
						</div>

						<button
							id="exercise-modal-close-btn"
							onClick={() => {
								setSuccessTriggered(false)
								onClose()
							}}
							className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
						>
							<X className="w-4 h-4 text-white" />
						</button>
					</div>

					{/* Interactive sliding container */}
					<motion.div
						id="exercise-swipe-area"
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={0.4}
						onDragEnd={handleDragEnd}
						key={exercise.id}
						className="flex-1 overflow-y-auto px-4 py-3 flex flex-col justify-between cursor-grab active:cursor-grabbing animate__animated animate__fadeInRight animate__faster"
					>
						<div className="space-y-4">
							<div>
								<span className="text-[8px] font-sans uppercase font-medium tracking-wide text-neon-lime bg-text-neon-lime/10 px-2 py-0.5 rounded-full inline-block mb-1.5 border border-text-neon-lime/20">
									Foco: {exercise.focus.join(', ')}
								</span>
								<h1 className="text-[21px] font-sans font-bold text-white leading-tight">
									{exercise.name}
								</h1>
							</div>

							{/* Video Box (YouTube Embed) */}
							<div className="w-full aspect-video flex items-center rounded-[10px] overflow-hidden bg-black shadow-md relative border border-white/5">
								<YouTube
									videoId={exercise.videoId}
									className="-ml-4"
									opts={{
      									width: String(window.innerWidth),
										playerVars: {
											autoplay: 1,
											controls: 1,
											disablekb: 1,
											modestbranding: 0,
											loop: 1,
											mute: 1
										}
									}}
								/>
							</div>

							{/* Description Section */}
							<div className="bg-card-bg p-4 rounded-[10px] border border-white/5 space-y-2">
								<h2 className="text-[18px] font-sans font-bold text-white">
									Como Executar
								</h2>

								<p className="text-sm text-white/70 font-sans leading-[150%] text-justify paragraph-multiline">
									{exercise.explanation}
								</p>

								<div className="flex flex-col gap-1.5 mt-6">
									<span className="text-xs font-sans uppercase font-medium text-white/40 leading-none">
										Meta
									</span>
									<span className="text-sm leading-5 font-sans font-semibold text-white">
										{exercise.goal}
									</span>
								</div>
							</div>
						</div>

						<div className="mt-6 pt-4 border-t border-white/5 shrink-0 bg-[#0a110e] -mx-4 -mb-3 px-4 pb-6 rounded-t-3xl shadow-lg">
							{successTriggered || isCompleted ? (
								<motion.div
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className="fixed inset-1/2 -translate-1/2 w-[90vw] h-30 bg-[#070d0a] flex flex-col items-center justify-center p-3 text-center text-[#ccff00] space-y-1 rounded-xl border-2 border-neon-lime/20"
								>
									<motion.div
										animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
										transition={{ duration: 0.5 }}
									>
										<CheckCircle className="w-8 h-8 text-[#ccff00]" />
									</motion.div>
									
									<span className="text-base font-sans font-bold">{getRandomCongratulationSentence()}</span>

									<p className="text-xs font-sans text-white/70 leading-[150%] max-w-50">
										{!isWorkoutComplete ? 'Vamos para o próximo exercício...' : 'Treino completo! Aguarde...'}
									</p>
								</motion.div>
							) : (
								<button
									id="btn-mark-exercise-complete"
									onClick={handleComplete}
									className="w-full bg-[#000000] text-lime-500 text-[16px] font-sans font-bold py-2.5 px-4 rounded-[10px] border border-neon-lime/20 flex items-center justify-center gap-1.5 hover:bg-zinc-900 active:scale-[0.98] transition-all shadow-md cursor-pointer"
								>
									<CheckCircle className="size-6 shrink-0" style={{ width: '24px', height: '24px' }} />
									<span>Marcar como Concluído</span>
								</button>
							)}
						</div>
					</motion.div>
				</motion.div>
			)
			}
		</AnimatePresence >
	);
};
