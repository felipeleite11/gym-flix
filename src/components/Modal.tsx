'use client'

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay: #000, opacity 38% */}
          <motion.div
            id="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.38 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[3000]"
          />

          {/* Main Box: Absolute center, margin X 16px, max height 80%, dark forest background, corner radius 30px, padding 36px */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[3001] px-4">
            <motion.div
              id="modal-main-box"
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="pointer-events-auto w-full max-w-sm bg-[#0c120f] border border-white/5 text-white rounded-[30px] p-9 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0 mb-4">
                <h3 className="text-[18px] font-sans font-bold text-white truncate">
                  {title}
                </h3>
                <button
                  id="modal-close-btn"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-[#ccff00] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Modal Body / Scrollable Content */}
              <div className="flex-1 overflow-y-auto pr-1 text-zinc-300 font-sans text-[11px] leading-[150%]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
