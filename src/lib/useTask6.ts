"use client";

import * as React from "react";
import { LanguageTask, LanguageEntry } from "./types";

const STORAGE_KEY = "erasmus-task-6";

const defaultTask6: LanguageTask = {
  id: "task-6",
  title: "Learn a Language & Get Certified",
  why: "Some Erasmus Mundus programs award points for consortium languages. A certificate proves your level.",
  steps: [
    "Identify the consortium languages of your target Erasmus Mundus program(s).",
    "Assess your current level in each relevant language (use CEFR self-assessment).",
    "Choose one language to focus on and set a target level (e.g., A2 or B1).",
    "Study consistently for 1–3 months using Duolingo, italki, or a local class.",
    "Register for a formal certification exam (DELE, DELF, Goethe, etc.) if time and budget allow.",
    "Take the exam and add the certificate to your proof portfolio.",
    "Update your CV with language levels and certificates.",
  ],
  tools: ["DELE", "DELF", "Goethe-Institut", "Duolingo", "italki", "CEFR self-assessment"],
  timeEstimate: "1–3 months",
  cvTip: 'Add a "Languages" section with language, CEFR level, and certificate name/date.',
  status: "not-started",
  deadline: null,
  notes: "",
  languages: [
    {
      id: "lang-1",
      language: "Spanish",
      currentLevel: "A2",
      targetLevel: "B1",
      certificateName: "DELE B1",
      certificateStatus: "studying",
      examDate: "2027-05-15",
      score: "",
      notes: "Consortium language for WINTOUR.",
    },
    {
      id: "lang-2",
      language: "French",
      currentLevel: "A1",
      targetLevel: "A2",
      certificateName: "DELF A2",
      certificateStatus: "not-started",
      examDate: "",
      score: "",
      notes: "Useful for programs in France/Belgium.",
    },
  ],
  checklist: [
    { id: "c1", text: "Identify the consortium languages of your target Erasmus Mundus program(s).", completed: false },
    { id: "c2", text: "Assess your current level in each relevant language (use CEFR self-assessment).", completed: false },
    { id: "c3", text: "Choose one language to focus on and set a target level (e.g., A2 or B1).", completed: false },
    { id: "c4", text: "Study consistently for 1–3 months using Duolingo, italki, or a local class.", completed: false },
    { id: "c5", text: "Register for a formal certification exam (DELE, DELF, Goethe, etc.) if time and budget allow.", completed: false },
    { id: "c6", text: "Take the exam and add the certificate to your proof portfolio.", completed: false },
    { id: "c7", text: "Update your CV with language levels and certificates.", completed: false },
  ],
};

function loadTask6(): LanguageTask {
  if (typeof window === "undefined") return defaultTask6;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask6));
    return defaultTask6;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask6;
  }
}

function saveTask6(task: LanguageTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function useTask6() {
  const [task, setTask] = React.useState<LanguageTask>(defaultTask6);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask6());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: LanguageTask) => LanguageTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask6(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: LanguageTask["status"]) => {
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

  const addLanguage = React.useCallback(
    (entry: Omit<LanguageEntry, "id">) => {
      update((prev) => ({
        ...prev,
        languages: [
          ...prev.languages,
          { ...entry, id: Date.now().toString() },
        ],
      }));
    },
    [update]
  );

  const updateLanguage = React.useCallback(
    (id: string, updates: Partial<LanguageEntry>) => {
      update((prev) => ({
        ...prev,
        languages: prev.languages.map((l) =>
          l.id === id ? { ...l, ...updates } : l
        ),
      }));
    },
    [update]
  );

  const removeLanguage = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        languages: prev.languages.filter((l) => l.id !== id),
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

  const totalLanguages = task.languages.length;
  const certificatesPassed = task.languages.filter((l) => l.certificateStatus === "passed").length;
  const now = new Date();
  const upcomingExams = task.languages.filter((l) => {
    if (!l.examDate || l.certificateStatus === "passed") return false;
    const d = new Date(l.examDate);
    return d >= now;
  }).length;

  return {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addLanguage,
    updateLanguage,
    removeLanguage,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalLanguages,
    certificatesPassed,
    upcomingExams,
  };
}
