export type TaskStatus = "not_started" | "in_progress" | "done";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  whyItMatters: string;
  stepByStepActions: string[];
  toolsAndLinks: { name: string; url: string }[];
  timeEstimate: string;
  cvPortfolioTip: string;
  status: TaskStatus;
  deadline: string;
  notes: string;
  links: { name: string; url: string }[];
  evidence: { fileName: string; data: string }[];
  checklist: ChecklistItem[];
  isCustom: boolean;
  category: string;
}

export interface AppData {
  tasks: Task[];
  lastUpdated: string;
}
