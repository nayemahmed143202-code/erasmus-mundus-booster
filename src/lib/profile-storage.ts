import { UserProfile } from "./types";
import { defaultProfile } from "./default-profile";

const PROFILE_KEY = "erasmus-mundus-profile";

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
