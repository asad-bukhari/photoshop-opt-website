'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('optipack-theme');
    const initial = stored ? stored === 'dark' : true;
    setDark(initial);
    document.documentElement.classList.toggle('dark', initial);
  }, []);

  const toggle = (next: boolean) => {
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('optipack-theme', next ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center rounded-full border border-line dark:border-rule bg-paper-3 dark:bg-ink-3 p-0.5">
      <button
        onClick={() => toggle(false)}
        aria-pressed={!dark}
        aria-label="Switch to light mode"
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
          !dark ? 'bg-paper-2 text-ink shadow-sm' : 'text-ink-soft dark:text-rule hover:text-ink dark:hover:text-paper'
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
        Light
      </button>
      <button
        onClick={() => toggle(true)}
        aria-pressed={dark}
        aria-label="Switch to dark mode"
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
          dark ? 'bg-ink-4 text-paper shadow-sm' : 'text-ink-soft dark:text-rule hover:text-ink dark:hover:text-paper'
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
        Dark
      </button>
    </div>
  );
}
