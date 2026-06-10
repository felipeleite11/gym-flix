'use client'

import { DumbbellIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface WorkoutCardProps {
  workout: Workout;
  onSelect: (workoutId: string) => void;
  completedCount: number;
}

export function WorkoutCard({ workout, onSelect, completedCount }: WorkoutCardProps) {
  const IconComponent = DumbbellIcon;

  const totalExercises = workout.exercises.length;
  const isFullyCompleted = totalExercises > 0 && completedCount === totalExercises;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-[#121815] rounded-[20px] shadow-sm hover:shadow-md border border-white/5 hover:border-white/10 overflow-hidden cursor-pointer flex flex-col justify-between transition-all"
      onClick={() => onSelect(workout.id)}
    >
      <div className="p-5">
        {/* Category Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#ccff00]/15 text-[#ccff00] rounded-xl border border-[#ccff00]/20">
              <IconComponent className="w-5 h-5 text-[#ccff00]" />
            </div>
            <span className="text-[11px] font-sans font-semibold tracking-wide text-white/50 uppercase">
              {workout.exercises[0]?.category || 'Musculação'}
            </span>
          </div>

          {/* Completion indicator */}
          {totalExercises > 0 && (
            <span className={`text-[9px] font-sans font-medium px-2 py-0.5 rounded-full ${
              isFullyCompleted 
                ? 'bg-[#ccff00]/20 text-[#ccff00] font-bold border border-[#ccff00]/30'
                : completedCount > 0 
                  ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-500/20' 
                  : 'bg-white/5 text-white/70'
            }`}>
              {completedCount}/{totalExercises} concluídos
            </span>
          )}
        </div>

        {/* Workout Title: Section Title design matches 18px Bold */}
        <h3 className="text-[18px] font-sans font-bold text-white mb-1.5 leading-tight">
          {workout.name}
        </h3>

        {/* General texts: font 11px, multiline leading-150% */}
        <p className="text-[11px] text-zinc-300 font-sans leading-[150%] line-clamp-3 mb-4">
          {workout.description}
        </p>

        {/* List preview of exercises inside (Field Data Style) */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[8px] font-sans font-medium uppercase text-white/40">Exercícios inclusos</span>
          <div className="flex flex-col gap-1">
            {workout.exercises.slice(0, 3).map((ex) => (
              <div key={ex.id} className="flex justify-between items-center text-[11px]">
                <span className="font-sans font-medium text-white/80 truncate max-w-[150px]">{ex.name}</span>
                <span className="text-[9px] text-white/40 font-sans font-normal">{ex.series}</span>
              </div>
            ))}
            {workout.exercises.length > 3 && (
              <span className="text-[9px] text-[#ccff00] font-sans font-medium mt-0.5">
                + {workout.exercises.length - 3} outros exercícios
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Action */}
      <div className="px-5 py-3.5 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] font-sans font-medium text-[#ccff00]">Começar Treino →</span>
        {isFullyCompleted && (
          <span className="text-[11px] font-sans font-semibold text-[#ccff00]">🏆 Treino Feito</span>
        )}
      </div>
    </motion.div>
  );
};
