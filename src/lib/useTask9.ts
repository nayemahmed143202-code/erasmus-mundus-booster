"use client";

import * as React from "react";
import { PartnersNewsletterTask, PartnerEntry } from "./types";

const STORAGE_KEY = "erasmus-task-9";

const defaultTask9: PartnersNewsletterTask = {
  id: "task-9",
  title: "Subscribe to Associated Partners' Newsletters",
  why: "Understand partners' priorities, projects, and language to strengthen your LOM and interview answers.",
  steps: [
    'Go to your target Erasmus Mundus program\'s website and find the "Associated Partners" page.',
    "List all associated partners (businesses, NGOs, etc.).",
    "Visit each partner's website and locate their newsletter signup form.",
    "Subscribe to each newsletter using your email.",
    "Note key topics, upcoming projects, and priorities from their websites or newsletters.",
    "Follow each partner on LinkedIn for additional updates.",
    "Use the insights you gather in your Letter of Motivation (LOM) and interview preparation.",
  ],
  tools: ["Program Website", "Partner Websites", "LinkedIn", "Email"],
  timeEstimate: "30 minutes",
  cvTip: "Mention specific partner projects or priorities in your LOM to show alignment.",
  status: "not-started",
  deadline: null,
  notes: "",
  partners: [
    {
      id: "partner-1",
      name: "WWF",
      organization: "World Wide Fund for Nature",
      program: "Blue Carbon Science and Policy",
      website: "https://www.worldwildlife.org/",
      newsletterSubscribed: false,
      subscriptionDate: "",
      keyTopics: "Blue carbon, climate policy, marine conservation",
      notes: "Offers scholarships for the St. Andrews summer school.",
      status: "researching",
    },
    {
      id: "partner-2",
      name: "UNESCO",
      organization: "United Nations Educational, Scientific and Cultural Organization",
      program: "European Literary Cultures",
      website: "https://www.unesco.org/",
      newsletterSubscribed: false,
      subscriptionDate: "",
      keyTopics: "Cultural heritage, education, intercultural dialogue",
      notes: "Associated partner for several Erasmus Mundus programs.",
      status: "researching",
    },
  ],
  checklist: [
    { id: "c1", text: 'Go to your target Erasmus Mundus program\'s website and find the "Associated Partners" page.', completed: false },
    { id: "c2", text: "List all associated partners (businesses, NGOs, etc.).", completed: false },
    { id: "c3", text: "Visit each partner's website and locate their newsletter signup form.", completed: false },
    { id: "c4", text: "Subscribe to each newsletter using your email.", completed: false },
    { id: "c5", text: "Note key topics, upcoming projects, and priorities from their websites or newsletters.", completed: false },
    { id: "c6", text: "Follow each partner on LinkedIn for additional updates.", completed: false },
    { id: "c7", text: "Use the insights you gather in your Letter of Motivation (LOM) and interview preparation.", completed: false },
  ],
};

function loadTask9(): PartnersNewsletterTask {
  if (typeof window === "undefined") return defaultTask9;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTask9));
    return defaultTask9;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTask9;
  }
}

function saveTask9(task: PartnersNewsletterTask): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function useTask9() {
  const [task, setTask] = React.useState<PartnersNewsletterTask>(defaultTask9);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTask(loadTask9());
    setLoaded(true);
  }, []);

  const update = React.useCallback((updater: (prev: PartnersNewsletterTask) => PartnersNewsletterTask) => {
    setTask((prev) => {
      const next = updater(prev);
      saveTask9(next);
      return next;
    });
  }, []);

  const updateStatus = React.useCallback(
    (status: PartnersNewsletterTask["status"]) => {
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

  const addPartner = React.useCallback(
    (entry: Omit<PartnerEntry, "id">) => {
      update((prev) => ({
        ...prev,
        partners: [
          ...prev.partners,
          { ...entry, id: Date.now().toString() },
        ],
      }));
    },
    [update]
  );

  const updatePartner = React.useCallback(
    (id: string, updates: Partial<PartnerEntry>) => {
      update((prev) => ({
        ...prev,
        partners: prev.partners.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    [update]
  );

  const removePartner = React.useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        partners: prev.partners.filter((p) => p.id !== id),
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

  const totalPartners = task.partners.length;
  const subscribedCount = task.partners.filter((p) => p.status === "subscribed").length;
  const subscriptionRate = totalPartners > 0 ? Math.round((subscribedCount / totalPartners) * 100) : 0;

  return {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addPartner,
    updatePartner,
    removePartner,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalPartners,
    subscribedCount,
    subscriptionRate,
  };
}
