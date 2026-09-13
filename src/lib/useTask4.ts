"use client";

import * as React from "react";
import { MentorshipTask, MentorshipEntry } from "./types";

const STORAGE_KEY = "erasmus-task-4";

const defaultTask4: MentorshipTask = {
  id: "task-4",
  title: "Become a Mentor",
  why: "Erasmus Mundus values giving back — show you contribute to others, not just consume knowledge.",
  steps: [
    "Join your university's peer mentoring program.",
    "Volunteer as a mentor at a local school or community center.",
    "Sign up on MentorNet or a similar online mentoring platform.",
    "Commit to at least 3–6 months of regular mentoring.",
    "Document each mentee's progress and outcomes.",
    "Add mentorship details to your CV and proof portfolio.",
  ],
  tools: ["University Peer Mentoring", "Local Schools", "MentorNet", "Community Centers"],
  timeEstimate: "1–2 hours per week",
  cvTip: 'Add a "Mentorship" section with number of mentees, duration, and measurable outcomes.',
  status: "not-started",
  deadline: null,
  notes: "",
  mentorships: [],
  checklist: [
    { id: "c1", text: "Join your university's peer mentoring program.", completed: false },
    { id: "c2", text: "Volunteer as a mentor at a local school or community center.", completed: false },
    { id: "c3", text: "Sign up on MentorNet or a similar online mentoring platform.", completed: false },
    { id: "c4", text: "Commit to at least 3–6 months of regular mentoring.", completed: false },
    { id: "c5", text: "Document each mentee's progress and outcomes.", completed: false },
    { id: "c6", text: "Add mentorship details to your CV and proof portfolio.", completed: false },
  ],
};

function loadTask4(): MentorshipTask {
  if (typeof window === "undefined") return defaultTask4;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask4));
    return defaultTask4;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask4;
  }
}

function saveTask4(task: MentorshipTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function useTask4() {
  const [task, setTask] = React.useState<MentorshipTask>(defaultTask4);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask4());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: MentorshipTask) => MentorshipTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask4(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: MentorshipTask["status"]) => {
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

  const addMentorship = React.useCallback(
    (entry: Omit<MentorshipEntry, "id">) => {
      update((prev) => ({
        ...prev,
        mentorships: [
          ...prev.mentorships,
          { ...entry, id: Date.now().toString() },
        ],
      }));
    },
    [update]
  );

  const updateMentorship = React.useCallback(
    (id: string, updates: Partial<MentorshipEntry>) => {
      update((prev) => ({
        ...prev,
        mentorships: prev.mentorships.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        ),
      }));
    },
    [update]
  );

  const removeMentorship = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        mentorships: prev.mentorships.filter((m) => m.id !== id),
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

  const totalMentees = task.mentorships.reduce((sum, m) => sum + m.menteeCount, 0);
  const totalHours = task.mentorships.reduce(
    (sum, m) => {
      const start = new Date(m.startDate);
      const end = m.endDate ? new Date(m.endDate) : new Date();
      const weeks = Math.max(1, Math.round((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)));
      return sum + m.hoursPerWeek * weeks;
    },
    0
  );
  const activeMentorships = task.mentorships.filter((m) => m.status === "active").length;

  return {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addMentorship,
    updateMentorship,
    removeMentorship,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalMentees,
    totalHours,
    activeMentorships,
  };
}
