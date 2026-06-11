'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, ArrowLeftIcon } from 'lucide-react';

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
}: ExerciseModalProps) {
  const [successTriggered, setSuccessTriggered] = useState(false);

  // Reset success state when exercise changes
  useEffect(() => {
    setSuccessTriggered(false);
  }, [exercise.id]);

  const handleDragEnd = (event: any, info: any) => {
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
  };

  const handleComplete = () => {
    setSuccessTriggered(true);
    onMarkCompleted(exercise.id);

    if (hasNext) {
      onNext();
    } else {
      setTimeout(onClose, 3000)
    }
  };

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
          {/* Sub Header info */}
          <div className="w-full bg-[#0a110e] flex items-center justify-between p-4 border-b border-white/5 shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-white hover:text-neon-lime transition-colors py-1 shrink-0 cursor-pointer"
            >
              <ArrowLeftIcon className="w-5 h-5 text-white" />
              <span className="text-[13px] font-sans font-medium">Voltar</span>
            </button>

            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-sans tracking-wide text-white/40">Execução</span>
              <span className="text-[13px] font-sans font-bold text-neon-lime">
                {currentIndex + 1} de {totalCount}
              </span>
            </div>
            <button
              id="exercise-modal-close-btn"
              onClick={onClose}
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
            className="flex-1 overflow-y-auto px-4 py-3 flex flex-col justify-between cursor-grab active:cursor-grabbing"
          >
            <div className="space-y-4">
              {/* Exercise Titles */}
              <div>
                <span className="text-[8px] font-sans uppercase font-medium tracking-wide text-neon-lime bg-text-neon-lime/10 px-2 py-0.5 rounded-full inline-block mb-1.5 border border-text-neon-lime/20">
                  Foco: {exercise.focus.join(', ')}
                </span>
                <h1 className="text-[21px] font-sans font-bold text-white leading-tight">
                  {exercise.name}
                </h1>
              </div>

              {/* Video Box (YouTube Embed) */}
              <div className="w-full aspect-video rounded-[10px] overflow-hidden bg-black shadow-md relative border border-white/5">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${exercise.videoId}?si=rbpB_16gwJYo0GXR`}
                  title="Vídeo de demonstração"
                  allow="autoplay"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="size-full object-contain"
                />
              </div>

              {/* Description Section */}
              <div className="bg-card-bg p-4 rounded-[10px] border border-white/5 space-y-2">
                <h2 className="text-[18px] font-sans font-bold text-white">
                  Como Executar
                </h2>

                <p className="text-[11px] text-white/80 font-sans leading-[150%] text-justify paragraph-multiline">
                  {exercise.explanation}
                </p>

                <div className="flex flex-col gap-1.5 mt-6">
                  <span className="text-[8px] font-sans uppercase font-medium text-white/40 leading-none">
                    Meta
                  </span>
                  <span className="text-[11px] font-sans font-semibold text-white leading-none">
                    {exercise.goal}
                  </span>
                </div>
                {/* </div> */}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 shrink-0 bg-[#0a110e] -mx-4 -mb-3 px-4 pb-6 rounded-t-3xl shadow-lg">
              {successTriggered || isCompleted ? (
                /* Success animated state showing check and success text */
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full flex flex-col items-center justify-center p-3 text-center text-[#ccff00] space-y-1 bg-[#ccff00]/5 rounded-xl border border-[#ccff00]/20"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle className="w-8 h-8 text-[#ccff00]" />
                  </motion.div>
                  <span className="text-[14px] font-sans font-bold">Excelente trabalho!</span>
                  <p className="text-[11px] font-sans text-white/70 leading-[150%] max-w-[200px]">
                    {hasNext ? 'Passe para o próximo exercício.' : 'Treino completo! Retornando...'}
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
      )}
    </AnimatePresence>
  );
};
