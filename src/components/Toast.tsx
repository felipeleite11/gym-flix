'use client'

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Toast({ message, isOpen, onClose }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="system-toast"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-9999 w-[calc(100%-32px)] max-w-sm bg-[#000000] text-[#FFFFFF] px-4 py-3 rounded-lg flex items-center gap-3 shadow-xl"
        >
          <div className="bg-white/20 p-1.5 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-[11px] font-sans leading-[150%] flex-1">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
