"use client";

import { Progress } from "@/components/ui/progress";

interface Task9ProgressProps {
  completed: number;
  total: number;
  percentage: number;
}

export function Task9Progress({ completed, total, percentage }: Task9ProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Checklist: {completed}/{total} steps</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-1.5" />
    </div>
  );
}
