"use client";

import * as React from "react";
import { OERProjectTask, ContributionEntry } from "./types";

const STORAGE_KEY = "erasmus-task-8";

const defaultTask8: OERProjectTask = {
  id: "task-8",
  title: "Create Your Own Project / OER Contribution",
  why: "Get your name and work online — contributing to open resources shows initiative and impact.",
  steps: [
    "Create a free account on oercommons.org (or GitHub/Figshare/Zenodo).",
    "Choose a lesson, research project, dataset, or code you've already created.",
    "Prepare the material for upload (clean up files, write a description).",
    "Upload the material to the platform.",
    "Get the shareable link for your contribution.",
    "Add the link to your CV and proof portfolio.",
    "Share the link on LinkedIn to increase visibility.",
  ],
  tools: ["oercommons.org", "GitHub", "Figshare", "Zenodo", "Google Drive"],
  timeEstimate: "2–3 hours",
  cvTip: 'Add an "Open Educational Resources" section with the resource title, platform, and link.',
  status: "not-started",
  deadline: null,
  notes: "",
  contributions: [
    {
      id: "contrib-1",
      title: "Introduction to Climate Data Analysis (Lesson)",
      platform: "OER Commons",
      type: "lesson",
      url: "",
      date: "2026-08-01",
      description: "A beginner-friendly lesson on analyzing climate data using Python.",
      status: "draft",
    },
  ],
  checklist: [
    { id: "c1", text: "Create a free account on oercommons.org (or GitHub/Figshare/Zenodo).", completed: false },
    { id: "c2", text: "Choose a lesson, research project, dataset, or code you've already created.", completed: false },
    { id: "c3", text: "Prepare the material for upload (clean up files, write a description).", completed: false },
    { id: "c4", text: "Upload the material to the platform.", completed: false },
    { id: "c5", text: "Get the shareable link for your contribution.", completed: false },
    { id: "c6", text: "Add the link to your CV and proof portfolio.", completed: false },
    { id: "c7", text: "Share the link on LinkedIn to increase visibility.", completed: false },
  ],
};

function loadTask8(): OERProjectTask {
  if (typeof window === "undefined") return defaultTask8;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask8));
    return defaultTask8;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask8;
  }
}

function saveTask8(task: OERProjectTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function useTask8() {
  const [task, setTask] = React.useState<OERProjectTask>(defaultTask8);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask8());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: OERProjectTask) => OERProjectTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask8(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: OERProjectTask["status"]) => {
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

  const addContribution = React.useCallback(
    (entry: Omit<ContributionEntry, "id">) => {
      update((prev) => ({
        ...prev,
        contributions: [
          ...prev.contributions,
          { ...entry, id: Date.now().toString() },
        ],
      }));
    },
    [update]
  );

  const updateContribution = React.useCallback(
    (id: string, updates: Partial<ContributionEntry>) => {
      update((prev) => ({
        ...prev,
        contributions: prev.contributions.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    [update]
  );

  const removeContribution = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        contributions: prev.contributions.filter((c) => c.id !== id),
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

  const totalContributions = task.contributions.length;
  const publishedCount = task.contributions.filter((c) => c.status === "published").length;
  const platformsUsed = new Set(task.contributions.map((c) => c.platform)).size;

  return {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addContribution,
    updateContribution,
    removeContribution,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalContributions,
    publishedCount,
    platformsUsed,
  };
}
