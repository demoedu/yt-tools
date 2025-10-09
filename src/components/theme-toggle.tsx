'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed top-6 right-6 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
      aria-label="테마 변경"
    >
      {theme === 'dark' ? (
        <LuSun className="w-6 h-6 text-yellow-500" />
      ) : (
        <LuMoon className="w-6 h-6 text-gray-700" />
      )}
    </button>
  );
}
