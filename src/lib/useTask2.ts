"use client";

import * as React from "react";
import { GetPublishedTask, Publication } from "./types";

const STORAGE_KEY = "erasmus-task-2";

const defaultTask2: GetPublishedTask = {
  id: "task-2",
  title: "Get Published in Your Field",
  why: "Prove writing ability and become searchable online. Publications show initiative, expertise, and communication skills to selection committees.",
  steps: [
    "Write 2–3 articles on LinkedIn about your field.",
    "Create a Medium account and publish at least one article.",
    "Pitch a guest post to your university blog or alumni spotlight.",
    "Contribute an article to a local NGO or nonprofit website.",
    "Add links to all published articles in your CV and proof portfolio.",
  ],
  tools: ["LinkedIn", "Medium", "University Blog", "NGO Websites"],
  timeEstimate: "2–4 hours per article",
  cvTip: 'Add a "Publications" section with links to your articles.',
  status: "not-started",
  deadline: null,
  notes: "",
  publications: [],
  checklist: [
    { id: "c1", text: "Write 2–3 articles on LinkedIn about your field.", completed: false },
    { id: "c2", text: "Create a Medium account and publish at least one article.", completed: false },
    { id: "c3", text: "Pitch a guest post to your university blog or alumni spotlight.", completed: false },
    { id: "c4", text: "Contribute an article to a local NGO or nonprofit website.", completed: false },
    { id: "c5", text: "Add links to all published articles in your CV and proof portfolio.", completed: false },
  ],
};

function loadTask2(): GetPublishedTask {
  if (typeof window === "undefined") return defaultTask2;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask2));
    return defaultTask2;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask2;
  }
}

function saveTask2(task: GetPublishedTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function useTask2() {
  const [task, setTask] = React.useState<GetPublishedTask>(defaultTask2);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask2());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: GetPublishedTask) => GetPublishedTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask2(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: GetPublishedTask["status"]) => {
      update((prev) => ({ ...prev, status }));
    },
    [update]
  );

  const toggleChecklistItem = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        checklist: prev.checklist.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        ),
      }));
    },
    [update]
  );

  const addNote = React.useCallback(
    (notes: string) => {
      update((prev) => ({ ...prev, notes }));
    },
    [update]
  );

  const addPublication = React.useCallback(
    (pub: Omit<Publication, "id">) => {
      update((prev) => ({
        ...prev,
        publications: [
          ...prev.publications,
          { ...pub, id: Date.now().toString() },
        ],
      }));
    },
    [update]
  );

  const updatePublication = React.useCallback(
    (id: string, updates: Partial<Publication>) => {
      update((prev) => ({
        ...prev,
        publications: prev.publications.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    [update]
  );

  const removePublication = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        publications: prev.publications.filter((p) => p.id !== id),
      }));
    },
    [update]
  );

  const setDeadline = React.useCallback(
    (deadline: string | null) => {
      update((prev) => ({ ...prev, deadline }));
    },
    [update]
  );

  const completedCount = task.checklist.filter((c) => c.completed).length;
  const totalCount = task.checklist.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addPublication,
    updatePublication,
    removePublication,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
  };
}
