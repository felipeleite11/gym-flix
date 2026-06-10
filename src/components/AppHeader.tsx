'use client'

import { Menu } from 'lucide-react';

interface AppHeaderProps {
  userName: string;
  onOpenDrawer: () => void;
}

export function AppHeader({ userName, onOpenDrawer }: AppHeaderProps) {
  return (
    <header className="w-full flex items-center justify-between p-4 bg-[#0a110e] border-b border-white/5 shrink-0 select-none">
      <span className="text-[16px] font-sans font-normal text-white mr-1">
        Olá, <strong className="font-semibold text-[#ccff00]">{userName}</strong>
      </span>
      
      <button
        id="menu-toggle-btn"
        onClick={onOpenDrawer}
        className="w-[22px] h-[22px] flex items-center justify-center p-0 text-white hover:text-[#ccff00] transition-colors active:scale-95"
        style={{ width: '22px', height: '22px' }}
      >
        <Menu className="w-full h-full text-white stroke-2" />
      </button>
    </header>
  );
};
