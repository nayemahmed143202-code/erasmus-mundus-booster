"use client";

import * as React from "react";
import { CommitteeTask, CommitteeEntry } from "./types";

const STORAGE_KEY = "erasmus-task-5";

const defaultTask5: CommitteeTask = {
  id: "task-5",
  title: "Join a Committee or Advisory Board",
  why: "Show decision-making, governance, and long-term commitment — not just one-off volunteering.",
  steps: [
    'Google "[your city] advisory committee recruitment" and save at least 5 results.',
    'Search "[your field] board of directors volunteer" and save at least 5 results.',
    "Identify committees that match your expertise and target Erasmus Mundus program.",
    "Apply to at least 2 committees or advisory boards.",
    "Attend meetings regularly for at least 6–12 months.",
    "Document your role, decisions, and impact.",
    "Add committee details to your CV and proof portfolio.",
  ],
  tools: ["City Websites", "LinkedIn", "VolunteerMatch", "University Boards"],
  timeEstimate: "2–4 hours per month",
  cvTip: 'Add a "Leadership & Governance" section listing the committee, your role, and key contributions.',
  status: "not-started",
  deadline: null,
  notes: "",
  committees: [
    {
      id: "comm-1",
      name: "Library Advisory Committee",
      organization: "City of Toronto",
      role: "Student Representative",
      type: "advisory",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      meetingFrequency: "Monthly",
      keyContributions: "Represented student needs, proposed new digital resources.",
      status: "applied",
    },
  ],
  checklist: [
    { id: "c1", text: 'Google "[your city] advisory committee recruitment" and save at least 5 results.', completed: false },
    { id: "c2", text: 'Search "[your field] board of directors volunteer" and save at least 5 results.', completed: false },
    { id: "c3", text: "Identify committees that match your expertise and target Erasmus Mundus program.", completed: false },
    { id: "c4", text: "Apply to at least 2 committees or advisory boards.", completed: false },
    { id: "c5", text: "Attend meetings regularly for at least 6–12 months.", completed: false },
    { id: "c6", text: "Document your role, decisions, and impact.", completed: false },
    { id: "c7", text: "Add committee details to your CV and proof portfolio.", completed: false },
  ],
};

function loadTask5(): CommitteeTask {
  if (typeof window === "undefined") return defaultTask5;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask5));
    return defaultTask5;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask5;
  }
}

function saveTask5(task: CommitteeTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function useTask5() {
  const [task, setTask] = React.useState<CommitteeTask>(defaultTask5);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask5());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: CommitteeTask) => CommitteeTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask5(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: CommitteeTask["status"]) => {
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

  const addCommittee = React.useCallback(
    (entry: Omit<CommitteeEntry, "id">) => {
      update((prev) => ({
        ...prev,
        committees: [
          ...prev.committees,
          { ...entry, id: Date.now().toString() },
        ],
      }));
    },
    [update]
  );

  const updateCommittee = React.useCallback(
    (id: string, updates: Partial<CommitteeEntry>) => {
      update((prev) => ({
        ...prev,
        committees: prev.committees.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    [update]
  );

  const removeCommittee = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        committees: prev.committees.filter((c) => c.id !== id),
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

  const totalCommittees = task.committees.length;
  const activeCommittees = task.committees.filter((c) => c.status === "active").length;
  const totalMonths = task.committees.reduce((sum, c) => {
    const start = new Date(c.startDate);
    const end = c.endDate ? new Date(c.endDate) : new Date();
    const months = Math.max(1, Math.round((end.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000)));
    return sum + months;
  }, 0);

  return {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addCommittee,
    updateCommittee,
    removeCommittee,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalCommittees,
    activeCommittees,
    totalMonths,
  };
}
