"use client";

import * as React from "react";
import { ProofPortfolioTask } from "./types";

const STORAGE_KEY = "erasmus-task-1";

const defaultTask1: ProofPortfolioTask = {
  id: "task-1",
  title: "Create a Proof Portfolio",
  why: "Show evidence for every claim on your CV. Selection committees want to verify your achievements, and having a portfolio with proof makes your application significantly more credible.",
  steps: [
    "Create a free Linktree, Canva, or caard.co page.",
    "Add sections: Certificates, Publications, Awards, Projects, Media Mentions.",
    "Upload PDFs/images of evidence to Google Drive.",
    "Get shareable links for each file.",
    "Link them on your portfolio page.",
    "Add the portfolio link to your CV under contact info.",
  ],
  tools: ["Linktree", "Canva", "caard.co", "Google Drive"],
  timeEstimate: "1–2 hours",
  cvTip: 'Add "Portfolio: [link]" under contact info in your CV.',
  status: "not-started",
  deadline: null,
  notes: "",
  evidenceFiles: [],
  checklist: [
    { id: "c1", text: "Create a free Linktree, Canva, or caard.co page.", completed: false },
    { id: "c2", text: "Add sections: Certificates, Publications, Awards, Projects, Media Mentions.", completed: false },
    { id: "c3", text: "Upload PDFs/images of evidence to Google Drive.", completed: false },
    { id: "c4", text: "Get shareable links for each file.", completed: false },
    { id: "c5", text: "Link them on your portfolio page.", completed: false },
    { id: "c6", text: "Add the portfolio link to your CV under contact info.", completed: false },
  ],
  portfolioLink: "",
};

function loadTask1(): ProofPortfolioTask {
  if (typeof window === "undefined") return defaultTask1;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask1));
    return defaultTask1;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask1;
  }
}

function saveTask1(task: ProofPortfolioTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function useTask1() {
  const [task, setTask] = React.useState<ProofPortfolioTask>(defaultTask1);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask1());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: ProofPortfolioTask) => ProofPortfolioTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask1(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: ProofPortfolioTask["status"]) => {
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

  const addEvidenceFile = React.useCallback(
    (file: { name: string; url: string }) => {
      update((prev) => ({
        ...prev,
        evidenceFiles: [...prev.evidenceFiles, file],
      }));
    },
    [update]
  );

  const removeEvidenceFile = React.useCallback(
    (index: number) => {
      update((prev) => ({
        ...prev,
        evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index),
      }));
    },
    [update]
  );

  const setPortfolioLink = React.useCallback(
    (portfolioLink: string) => {
      update((prev) => ({ ...prev, portfolioLink }));
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
    addEvidenceFile,
    removeEvidenceFile,
    setPortfolioLink,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
  };
}
