'use client'

import { motion, AnimatePresence } from 'motion/react';
import { X, Dumbbell, Calendar, Table2, DumbbellIcon } from 'lucide-react';

interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  userName: string;
}

export function RightDrawer({
  isOpen,
  onClose,
  activeScreen,
  onNavigate,
  userName,
}: RightDrawerProps) {
  const menuItems = [
    { id: 'explore' as ActiveScreen, label: 'Treinos', icon: Dumbbell },
    { id: 'progress' as ActiveScreen, label: 'Progresso', icon: Calendar },
    // { id: 'add_workout' as ActiveScreen, label: 'Adicionar Exercício', icon: PlusCircle },
    { id: 'overview_table' as ActiveScreen, label: 'Guia de exercícios', icon: Table2 }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay: #000 with opacity 38% */}
          <motion.div
            id="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.38 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000] z-[1000]"
          />

          {/* Drawer content sliding from the right */}
          <motion.div
            id="drawer-container"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[280px] bg-[#0c120f] z-[1001] shadow-2xl p-6 flex flex-col justify-between border-l border-white/5"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-6 border-b border-white/5 mb-6">
                <div className="flex flex-col">
                  <span className="text-[13px] text-white/50 font-sans uppercase">Atleta</span>
                  <span className="text-[16px] font-sans font-medium text-white">{userName}</span>
                </div>
                <button
                  id="drawer-close-btn"
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-4">
                <span className="text-[8px] font-sans font-medium uppercase tracking-wider text-white/40">Navegação</span>
                <nav className="flex flex-col gap-2 mt-2">
                  {menuItems.map((item) => {
                    const IconComponent = DumbbellIcon;
                    const isActive = activeScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-link-${item.id}`}
                        onClick={() => {
                          onNavigate(item.id);
                          onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#ccff00] text-black font-semibold shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                            : 'bg-transparent text-white/80 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <IconComponent className={`w-[18px] h-[18px] ${isActive ? 'text-black' : 'text-white'}`} />
                        <span className="font-sans text-[13px]">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/5 text-center">
              <span className="text-[11px] font-sans text-white/40">GYM Flix v1.0.0</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
