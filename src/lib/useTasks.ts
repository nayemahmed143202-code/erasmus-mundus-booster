"use client";

import * as React from "react";
import {
  Task,
  TaskStatus,
} from "./types";
import {
  loadData,
  saveData,
  updateTask,
  addTask,
  deleteTask,
  getProgressStats,
} from "./tasks";

export function useTasks() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [stats, setStats] = React.useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    percentage: 0,
  });

  const refresh = React.useCallback(() => {
    const data = loadData();
    setTasks(data.tasks);
    setStats(getProgressStats());
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const handleUpdateTask = React.useCallback(
    (task: Task) => {
      updateTask(task);
      refresh();
    },
    [refresh]
  );

  const handleAddTask = React.useCallback(
    (task: Task) => {
      addTask(task);
      refresh();
    },
    [refresh]
  );

  const handleDeleteTask = React.useCallback(
    (id: string) => {
      deleteTask(id);
      refresh();
    },
    [refresh]
  );

  return {
    tasks,
    stats,
    updateTask: handleUpdateTask,
    addTask: handleAddTask,
    deleteTask: handleDeleteTask,
    refresh,
  };
}
