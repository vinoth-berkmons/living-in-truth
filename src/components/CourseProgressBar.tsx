import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';

interface CourseProgressBarProps {
  completed: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}

export const CourseProgressBar = ({ completed, total, className = '', showLabel = true }: CourseProgressBarProps) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = pct === 100;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {completed}/{total} completed
          </span>
          <span className={`font-semibold ${isComplete ? 'text-emerald-500' : 'text-primary'}`}>
            {pct}%
          </span>
        </div>
      )}
      <Progress
        value={pct}
        className={`h-2 ${isComplete ? '[&>div]:bg-emerald-500' : ''}`}
      />
      {isComplete && showLabel && (
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Course completed!
        </div>
      )}
    </div>
  );
};
