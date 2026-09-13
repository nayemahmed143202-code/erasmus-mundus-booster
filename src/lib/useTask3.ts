"use client";

import * as React from "react";
import { FundedOpportunityTask, Opportunity } from "./types";

const STORAGE_KEY = "erasmus-task-3";

const defaultTask3: FundedOpportunityTask = {
  id: "task-3",
  title: "Apply for Fully Funded Summer Schools & Fellowships",
  why: "Build a track record of funded opportunities to prove you can win competitive awards.",
  steps: [
    "Search \"fully funded summer school [your field] 2026\" and save at least 5 results.",
    "Search \"fully funded fellowship for undergraduates [your country/field]\" and save at least 5 results.",
    "Check university scholarship pages for summer programs.",
    "Find local (in your country/city) summer programs or fellowships.",
    "Create a deadline tracker in Excel/Google Sheets.",
    "Apply to at least 3 opportunities.",
  ],
  tools: ["Google", "University Websites", "Excel/Google Sheets", "LinkedIn"],
  timeEstimate: "1–2 weeks",
  cvTip: 'Add a "Funded Programs" section listing each opportunity, year, and funding amount.',
  status: "not-started",
  deadline: null,
  notes: "",
  opportunities: [
    {
      id: "opp-1",
      name: "Blue Carbon Science and Policy Summer School",
      organization: "University of St. Andrews",
      location: "St. Andrews, UK",
      fundingType: "fully-funded",
      deadline: "2027-03-31",
      applicationStatus: "researching",
      url: "https://www.st-andrews.ac.uk/",
      notes: "WWF scholarship covers course fee and travel.",
    },
    {
      id: "opp-2",
      name: "Switzerland Research Fellowship",
      organization: "Swiss Universities",
      location: "Switzerland",
      fundingType: "fully-funded",
      deadline: "2027-01-15",
      applicationStatus: "researching",
      url: "",
      notes: "2-month fellowship, stipend + travel + accommodation.",
    },
    {
      id: "opp-3",
      name: "SIPRI Summer Programme",
      organization: "Stockholm International Peace Research Institute",
      location: "Stockholm, Sweden",
      fundingType: "fully-funded",
      deadline: "2027-03-01",
      applicationStatus: "researching",
      url: "https://www.sipri.org/",
      notes: "5-day immersion program, fully funded.",
    },
  ],
  checklist: [
    { id: "c1", text: "Search \"fully funded summer school [your field] 2026\" and save at least 5 results.", completed: false },
    { id: "c2", text: "Search \"fully funded fellowship for undergraduates [your country/field]\" and save at least 5 results.", completed: false },
    { id: "c3", text: "Check university scholarship pages for summer programs.", completed: false },
    { id: "c4", text: "Find local (in your country/city) summer programs or fellowships.", completed: false },
    { id: "c5", text: "Create a deadline tracker in Excel/Google Sheets.", completed: false },
    { id: "c6", text: "Apply to at least 3 opportunities.", completed: false },
  ],
};

function loadTask3(): FundedOpportunityTask {
  if (typeof window === "undefined") return defaultTask3;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask3));
    return defaultTask3;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask3;
  }
}

function saveTask3(task: FundedOpportunityTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function useTask3() {
  const [task, setTask] = React.useState<FundedOpportunityTask>(defaultTask3);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask3());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: FundedOpportunityTask) => FundedOpportunityTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask3(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: FundedOpportunityTask["status"]) => {
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

  const addOpportunity = React.useCallback(
    (opp: Omit<Opportunity, "id">) => {
      update((prev) => ({
        ...prev,
        opportunities: [
          ...prev.opportunities,
          { ...opp, id: Date.now().toString() },
        ],
      }));
    },
    [update]
  );

  const updateOpportunity = React.useCallback(
    (id: string, updates: Partial<Opportunity>) => {
      update((prev) => ({
        ...prev,
        opportunities: prev.opportunities.map((o) =>
          o.id === id ? { ...o, ...updates } : o
        ),
      }));
    },
    [update]
  );

  const removeOpportunity = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        opportunities: prev.opportunities.filter((o) => o.id !== id),
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

  const submittedCount = task.opportunities.filter(
    (o) => o.applicationStatus === "submitted" || o.applicationStatus === "accepted"
  ).length;

  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = task.opportunities.filter((o) => {
    if (!o.deadline) return false;
    const d = new Date(o.deadline);
    return d >= now && d <= thirtyDaysFromNow;
  });

  return {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addOpportunity,
    updateOpportunity,
    removeOpportunity,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    submittedCount,
    upcomingDeadlines,
  };
}
