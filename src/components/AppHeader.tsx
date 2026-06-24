'use client'

import { MenuIcon } from 'lucide-react';
import { Button } from './ui/button';

interface AppHeaderProps {
  userName: string;
  onOpenDrawer: () => void;
}

export function AppHeader({ userName, onOpenDrawer }: AppHeaderProps) {
  return (
    <header className="w-full flex items-center justify-between p-4 bg-[#0a110e] border-b border-white/5 shrink-0 select-none">
      <span className="text-[16px] font-sans font-normal text-white mr-1">
        Olá, <strong className="font-semibold text-neon-lime">{userName}</strong>
      </span>
      
      <Button
        size="icon-lg"
        variant="link"
        onClick={onOpenDrawer}
        className="size-5.5 hover:opacity-80 flex items-center justify-center p-0 text-white hover:text-neon-lime transition-colors active:scale-95"
        style={{ width: '22px', height: '22px' }}
      >
        <MenuIcon className="text-white stroke-2 size-6" />
      </Button>
    </header>
  );
};
