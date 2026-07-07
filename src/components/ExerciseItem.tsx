'use client'

import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Badge } from './Badge';
import { CircleParticles } from './CircleParticles';
import { Card } from './Card';

interface ExerciseItemProps {
	exercise: Exercise;
	isCompleted: boolean;
	onSelect: () => void;
	index: number;
}

export function ExerciseItem({
	exercise,
	isCompleted,
	onSelect,
	index,
}: ExerciseItemProps) {
	return (
		<Card>
			<div
				onClick={onSelect}
				className={`p-4 bg-[#121815] rounded-xl border transition-all duration-200 cursor-pointer gap-2 flex items-center justify-between group active:scale-[0.99] ${isCompleted
					? 'border-[#ccff00]/30 bg-[#ccff00]/5 shadow-[0_0_10px_rgba(204,255,0,0.05)]'
					: 'border-white/5 hover:border-white/10 hover:bg-[#18211c]'
				}`}
			>
				<div className="absolute inset-0 pointer-events-none">
					<CircleParticles id={String(exercise.id)} />
					<div className="absolute inset-0 bg-black/30" />
				</div>

				<div className="relative z-10 flex flex-col h-full">
					<div className="flex items-center gap-3.5 flex-1 min-w-0">
						<div className="relative shrink-0">
							{isCompleted ? (
								<div className="w-[38px] h-[38px] rounded-lg bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00]">
									<CheckCircle2 className="w-5 h-5 text-[#ccff00]" />
								</div>
							) : (
								<div className="w-[38px] h-[38px] rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-white/60 font-sans font-bold text-[13px] transition-colors">
									{String(index + 1).padStart(2, '0')}
								</div>
							)}
						</div>

						{/* Info */}
						<div className="flex flex-col gap-2">
							<h4 className="text-base font-sans font-bold text-neon-lime group-hover:text-[#a9ce16] transition-colors">
								{exercise.name}
							</h4>
							<div className="flex flex-col gap-2 mb-0.5">
								<div className="flex flex-wrap gap-1 items-center">
									{exercise.focus.map(f => (
										<Badge key={f}>
											<span className="text-[11px] font-sans font-semibold uppercase">
												{f}
											</span>
										</Badge>
									))}
								</div>
								<span className="text-sm font-sans text-white/60 font-normal">
									{exercise.goal}
								</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2 shrink-0 mt-1 self-end">
						{isCompleted && (
							<span className="text-[10px] text-neon-lime font-sans font-semibold bg-neon-lime/10 px-2.5 py-1 rounded-full">
								Concluído
							</span>
						)}
					</div>
				</div>
			</div>
		</Card>
	)
}
