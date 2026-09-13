import { AppData, Task } from "@/types/task";
import { defaultTasks } from "./default-tasks";

const STORAGE_KEY = "erasmus-mundus-booster";

export function loadData(): AppData {
  if (typeof window === "undefined") {
    return { tasks: defaultTasks, lastUpdated: new Date().toISOString() };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialData: AppData = {
      tasks: defaultTasks,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return { tasks: defaultTasks, lastUpdated: new Date().toISOString() };
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  data.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getTaskById(id: string): Task | null {
  const data = loadData();
  return data.tasks.find((t) => t.id === id) || null;
}

export function updateTask(updatedTask: Task): void {
  const data = loadData();
  const index = data.tasks.findIndex((t) => t.id === updatedTask.id);
  if (index !== -1) {
    data.tasks[index] = updatedTask;
  } else {
    data.tasks.push(updatedTask);
  }
  saveData(data);
}

export function addTask(task: Task): void {
  const data = loadData();
  data.tasks.push(task);
  saveData(data);
}

export function deleteTask(id: string): void {
  const data = loadData();
  data.tasks = data.tasks.filter((t) => t.id !== id);
  saveData(data);
}

export function getProgressStats() {
  const data = loadData();
  const tasks = data.tasks;
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const notStarted = tasks.filter((t) => t.status === "not_started").length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, inProgress, notStarted, percentage };
}
