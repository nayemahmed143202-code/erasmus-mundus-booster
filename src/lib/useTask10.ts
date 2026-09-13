"use client";

import * as React from "react";
import { StressTestTask, ComponentEntry } from "./types";

const STORAGE_KEY = "erasmus-task-10";

const STRENGTH_ORDER = { weak: 0, moderate: 1, strong: 2, excellent: 3 };

const defaultTask10: StressTestTask = {
  id: "task-10",
  title: "Stress-Test Your Application Without the LOM",
  why: "Avoid relying on one document. Every component must be strong on its own.",
  steps: [
    "List all components of your Erasmus Mundus application (CV, LOM, reference letters, writing sample, video, transcripts, etc.).",
    "For each component, rate its current strength (Weak/Moderate/Strong/Excellent).",
    "For each component, set a target strength.",
    "Identify concrete evidence that supports each component.",
    "List specific improvements needed for each component.",
    "Strengthen your CV by adding concrete achievements with measurable impacts (numbers, action verbs).",
    "Strengthen your reference letters by providing detailed information to your referees.",
    "Strengthen your writing sample by editing and getting feedback.",
    "Ask: If the LOM were removed, would my application still be strong? If not, improve the weakest components.",
    "Update your proof portfolio with evidence for each component.",
  ],
  tools: ["CV Master Class", "Reference Letter Guidance", "Writing Sample Tips"],
  timeEstimate: "2–3 hours",
  cvTip: "Use action verbs + numbers in every bullet point (e.g., 'Mentored 15 students', 'Published 2 articles').",
  status: "not-started",
  deadline: null,
  notes: "",
  components: [
    {
      id: "comp-1",
      name: "CV",
      currentStrength: "moderate",
      targetStrength: "strong",
      evidence: "Contains 3 research projects, 2 internships, 1 publication.",
      improvementsNeeded: "Add more measurable impacts and leadership examples.",
      status: "in-progress",
      notes: "Tailor to Erasmus Mundus values.",
    },
    {
      id: "comp-2",
      name: "Letters of Recommendation",
      currentStrength: "moderate",
      targetStrength: "strong",
      evidence: "Two professors agreed to write letters.",
      improvementsNeeded: "Provide detailed brag sheet to referees; ask for specific examples.",
      status: "not-started",
      notes: "Follow up 2 weeks before deadline.",
    },
    {
      id: "comp-3",
      name: "Writing Sample",
      currentStrength: "weak",
      targetStrength: "strong",
      evidence: "One undergraduate thesis chapter.",
      improvementsNeeded: "Edit for clarity, get feedback, format properly.",
      status: "not-started",
      notes: "Choose a topic relevant to the program.",
    },
    {
      id: "comp-4",
      name: "Video Essay",
      currentStrength: "weak",
      targetStrength: "moderate",
      evidence: "",
      improvementsNeeded: "Script, record, and edit a 2-minute video.",
      status: "not-started",
      notes: "Check if required by the program.",
    },
    {
      id: "comp-5",
      name: "Transcripts",
      currentStrength: "strong",
      targetStrength: "strong",
      evidence: "Official transcripts ready.",
      improvementsNeeded: "None.",
      status: "done",
      notes: "Ensure translations if needed.",
    },
  ],
  checklist: [
    { id: "c1", text: "List all components of your Erasmus Mundus application (CV, LOM, reference letters, writing sample, video, transcripts, etc.).", completed: false },
    { id: "c2", text: "For each component, rate its current strength (Weak/Moderate/Strong/Excellent).", completed: false },
    { id: "c3", text: "For each component, set a target strength.", completed: false },
    { id: "c4", text: "Identify concrete evidence that supports each component.", completed: false },
    { id: "c5", text: "List specific improvements needed for each component.", completed: false },
    { id: "c6", text: "Strengthen your CV by adding concrete achievements with measurable impacts (numbers, action verbs).", completed: false },
    { id: "c7", text: "Strengthen your reference letters by providing detailed information to your referees.", completed: false },
    { id: "c8", text: "Strengthen your writing sample by editing and getting feedback.", completed: false },
    { id: "c9", text: "Ask: If the LOM were removed, would my application still be strong? If not, improve the weakest components.", completed: false },
    { id: "c10", text: "Update your proof portfolio with evidence for each component.", completed: false },
  ],
};

function loadTask10(): StressTestTask {
  if (typeof window === "undefined") return defaultTask10;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask10));
    return defaultTask10;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask10;
  }
}

function saveTask10(task: StressTestTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export interface StressTestResult {
  overallStrength: "strong" | "moderate" | "weak";
  belowTarget: ComponentEntry[];
  weakestComponents: ComponentEntry[];
  atTargetCount: number;
  totalCount: number;
}

export function useTask10() {
  const [task, setTask] = React.useState<StressTestTask>(defaultTask10);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask10());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: StressTestTask) => StressTestTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask10(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: StressTestTask["status"]) => {
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

  const addComponent = React.useCallback(
    (entry: Omit<ComponentEntry, "id">) => {
      update((prev) => ({
        ...prev,
        components: [
          ...prev.components,
          { ...entry, id: Date.now().toString() },
        ],
      }));
    },
    [update]
  );

  const updateComponent = React.useCallback(
    (id: string, updates: Partial<ComponentEntry>) => {
      update((prev) => ({
        ...prev,
        components: prev.components.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    [update]
  );

  const removeComponent = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        components: prev.components.filter((c) => c.id !== id),
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

  const runStressTest = React.useCallback((): StressTestResult => {
    const belowTarget = task.components.filter(
      (c) => STRENGTH_ORDER[c.currentStrength] < STRENGTH_ORDER[c.targetStrength]
    );
    const sorted = [...belowTarget].sort(
      (a, b) => STRENGTH_ORDER[a.currentStrength] - STRENGTH_ORDER[b.currentStrength]
    );
    const weakestComponents = sorted.slice(0, 3);
    const atTargetCount = task.components.filter(
      (c) => STRENGTH_ORDER[c.currentStrength] >= STRENGTH_ORDER[c.targetStrength]
    ).length;
    const totalCount = task.components.length;
    const avgStrength =
      totalCount > 0
        ? task.components.reduce((sum, c) => sum + STRENGTH_ORDER[c.currentStrength], 0) / totalCount
        : 0;
    let overallStrength: "strong" | "moderate" | "weak";
    if (avgStrength >= 2) overallStrength = "strong";
    else if (avgStrength >= 1) overallStrength = "moderate";
    else overallStrength = "weak";
    return { overallStrength, belowTarget, weakestComponents, atTargetCount, totalCount };
  }, [task.components]);

  const completedCount = task.checklist.filter((c) => c.completed).length;
  const totalCount = task.checklist.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalComponents = task.components.length;
  const atTargetCount = task.components.filter(
    (c) => STRENGTH_ORDER[c.currentStrength] >= STRENGTH_ORDER[c.targetStrength]
  ).length;
  const readinessPercentage = totalComponents > 0 ? Math.round((atTargetCount / totalComponents) * 100) : 0;

  return {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addComponent,
    updateComponent,
    removeComponent,
    setDeadline,
    runStressTest,
    completedCount,
    totalCount,
    percentage,
    totalComponents,
    atTargetCount,
    readinessPercentage,
  };
}
