"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task9Progress } from "./Task9Progress";
import { useTask9 } from "@/lib/useTask9";
import { Calendar, Mail } from "lucide-react";
import Link from "next/link";

export function Task9Card() {
  const { task, completedCount, totalCount, percentage, subscribedCount, totalPartners } = useTask9();

  const statusVariant = {
    "not-started": "warning" as const,
    "in-progress": "info" as const,
    "done": "success" as const,
  };

  const statusLabel = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    "done": "Done",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">
            <Link href="/tasks/9" className="hover:underline">
              {task.title}
            </Link>
          </CardTitle>
          <Badge variant={statusVariant[task.status]}>
            {statusLabel[task.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.why}
        </p>
        {task.deadline && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(task.deadline).toLocaleDateString()}
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="h-4 w-4 mr-2" />
          {subscribedCount}/{totalPartners} subscribed
        </div>
        <Task9Progress
          completed={completedCount}
          total={totalCount}
          percentage={percentage}
        />
      </CardContent>
    </Card>
  );
}
