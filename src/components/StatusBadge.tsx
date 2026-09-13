"use client";

import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "@/lib/types";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "done":
      return (
        <Badge variant="success">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Done
        </Badge>
      );
    case "in_progress":
      return (
        <Badge variant="info">
          <Clock className="h-3 w-3 mr-1" /> In Progress
        </Badge>
      );
    case "not_started":
      return (
        <Badge variant="warning">
          <AlertCircle className="h-3 w-3 mr-1" /> Not Started
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}
