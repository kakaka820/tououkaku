import { Flame } from 'lucide-react';
import type { SpicyLevel } from '@/lib/types';

interface SpicyIndicatorProps {
  level: SpicyLevel;
}

export function SpicyIndicator({ level }: SpicyIndicatorProps) {
  if (level === 0) return null;

  return (
    <div className="flex gap-0.5" data-testid={`spicy-level-${level}`}>
      {Array.from({ length: level }).map((_, i) => (
        <Flame
          key={i}
          className="h-4 w-4 text-red-500 dark:text-red-400"
        />
      ))}
    </div>
  );
}
