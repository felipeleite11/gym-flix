'use client'

import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Badge } from './Badge';

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
    <div
      onClick={onSelect}
      className={`p-4 bg-[#121815] rounded-xl border transition-all duration-200 cursor-pointer gap-2 flex items-center justify-between group active:scale-[0.99] ${
        isCompleted
          ? 'border-[#ccff00]/30 bg-[#ccff00]/5 shadow-[0_0_10px_rgba(204,255,0,0.05)]'
          : 'border-white/5 hover:border-white/10 hover:bg-[#18211c]'
      }`}
    >
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
        <div className="flex flex-col gap-2 min-w-0">
          <h4 className="text-base font-sans font-bold text-neon-lime group-hover:text-[#a9ce16] transition-colors truncate">
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
            {/* <span className="w-1 h-1 rounded-full bg-white/10" /> */}
            <span className="text-[11px] font-sans text-white/60 font-normal">
              {exercise.goal}
            </span>
          </div>
        </div>
      </div>

      {/* Play indicators */}
      <div className="flex items-center gap-2 shrink-0">
        {isCompleted && (
          <span className="text-[10px] text-[#ccff00] font-sans font-semibold bg-[#ccff00]/10 px-2.5 py-1 rounded-full">
            Concluído
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
      </div>
    </div>
  );
};
