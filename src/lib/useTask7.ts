"use client";

import * as React from "react";
import { AssociationTask, AssociationEntry } from "./types";

const STORAGE_KEY = "erasmus-task-7";

const defaultTask7: AssociationTask = {
  id: "task-7",
  title: "Join a Professional Association",
  why: "Associations open doors to networks, committees, and working groups you wouldn't access otherwise.",
  steps: [
    'Search "[your field] professional association [your country]" and save at least 5 results.',
    "Check for student discounts, free memberships, or pay-what-you-can options.",
    "Choose 1–2 associations that align with your field and target Erasmus Mundus program.",
    "Join the association(s) and pay any required fees.",
    "Volunteer for a committee, working group, or subgroup within the association.",
    "Attend at least 2 events or meetings per year.",
    "Add membership details to your CV and proof portfolio.",
  ],
  tools: ["LinkedIn", "Association Websites", "Student Discounts", "VolunteerMatch"],
  timeEstimate: "1–2 hours to join, ongoing participation",
  cvTip: 'Add a "Professional Memberships" section with association name, role, and dates.',
  status: "not-started",
  deadline: null,
  notes: "",
  associations: [
    {
      id: "assoc-1",
      name: "Young Canadians in Finance",
      industry: "Finance",
      membershipType: "young-professional",
      fee: "$50/year",
      startDate: "2026-01-01",
      endDate: "2027-01-01",
      role: "Member",
      committees: "",
      status: "researching",
    },
    {
      id: "assoc-2",
      name: "European Association for International Education",
      industry: "International Education",
      membershipType: "young-professional",
      fee: "€130/2 years",
      startDate: "",
      endDate: "",
      role: "Member",
      committees: "",
      status: "researching",
    },
  ],
  checklist: [
    { id: "c1", text: 'Search "[your field] professional association [your country]" and save at least 5 results.', completed: false },
    { id: "c2", text: "Check for student discounts, free memberships, or pay-what-you-can options.", completed: false },
    { id: "c3", text: "Choose 1–2 associations that align with your field and target Erasmus Mundus program.", completed: false },
    { id: "c4", text: "Join the association(s) and pay any required fees.", completed: false },
    { id: "c5", text: "Volunteer for a committee, working group, or subgroup within the association.", completed: false },
    { id: "c6", text: "Attend at least 2 events or meetings per year.", completed: false },
    { id: "c7", text: "Add membership details to your CV and proof portfolio.", completed: false },
  ],
};

function loadTask7(): AssociationTask {
  if (typeof window === "undefined") return defaultTask7;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask7));
    return defaultTask7;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask7;
  }
}

function saveTask7(task: AssociationTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function useTask7() {
  const [task, setTask] = React.useState<AssociationTask>(defaultTask7);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask7());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: AssociationTask) => AssociationTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask7(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: AssociationTask["status"]) => {
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

  const addAssociation = React.useCallback(
    (entry: Omit<AssociationEntry, "id">) => {
      update((prev) => ({
        ...prev,
        associations: [
          ...prev.associations,
          { ...entry, id: Date.now().toString() },
        ],
      }));
    },
    [update]
  );

  const updateAssociation = React.useCallback(
    (id: string, updates: Partial<AssociationEntry>) => {
      update((prev) => ({
        ...prev,
        associations: prev.associations.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      }));
    },
    [update]
  );

  const removeAssociation = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        associations: prev.associations.filter((a) => a.id !== id),
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

  const totalAssociations = task.associations.length;
  const activeAssociations = task.associations.filter((a) => a.status === "active").length;
  const totalFees = task.associations.filter((a) => a.status === "active").length;

  return {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addAssociation,
    updateAssociation,
    removeAssociation,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalAssociations,
    activeAssociations,
    totalFees,
  };
}
