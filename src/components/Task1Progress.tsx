"use client";

import { Progress } from "@/components/ui/progress";

interface Task1ProgressProps {
  completed: number;
  total: number;
  percentage: number;
}

export function Task1Progress({ completed, total, percentage }: Task1ProgressProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{completed}/{total} steps</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-1.5" />
    </div>
  );
}
