"use client";

import { Progress } from "@/components/ui/progress";

interface Task3ProgressProps {
  completed: number;
  total: number;
  percentage: number;
  submitted: number;
}

export function Task3Progress({ completed, total, percentage, submitted }: Task3ProgressProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Checklist: {completed}/{total} steps</span>
          <span>{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-1.5" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Applications submitted: {submitted}/3</span>
          <span>{Math.min(Math.round((submitted / 3) * 100), 100)}%</span>
        </div>
        <Progress value={Math.min((submitted / 3) * 100, 100)} className="h-1.5" />
      </div>
    </div>
  );
}
