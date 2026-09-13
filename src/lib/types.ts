export type TaskStatus = "not_started" | "in_progress" | "done";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ProofPortfolioTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  evidenceFiles: { name: string; url: string }[];
  checklist: { id: string; text: string; completed: boolean }[];
  portfolioLink: string;
}

export interface Publication {
  id: string;
  title: string;
  platform: string;
  url: string;
  date: string;
  status: "draft" | "submitted" | "published";
}

export interface GetPublishedTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  publications: Publication[];
  checklist: { id: string; text: string; completed: boolean }[];
}

export interface Opportunity {
  id: string;
  name: string;
  organization: string;
  location: string;
  fundingType: "fully-funded" | "partial" | "fee-waiver" | "unknown";
  deadline: string;
  applicationStatus: "researching" | "preparing" | "submitted" | "accepted" | "rejected";
  url: string;
  notes: string;
}

export interface MentorshipEntry {
  id: string;
  programName: string;
  organization: string;
  role: string;
  menteeCount: number;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  outcomes: string;
  status: "active" | "completed" | "planned";
}

export interface MentorshipTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  mentorships: MentorshipEntry[];
  checklist: { id: string; text: string; completed: boolean }[];
}

export interface CommitteeEntry {
  id: string;
  name: string;
  organization: string;
  role: string;
  type: "advisory" | "board-of-directors" | "working-group" | "committee" | "other";
  startDate: string;
  endDate: string;
  meetingFrequency: string;
  keyContributions: string;
  status: "applied" | "active" | "completed" | "rejected";
}

export interface CommitteeTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  committees: CommitteeEntry[];
  checklist: { id: string; text: string; completed: boolean }[];
}

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface LanguageEntry {
  id: string;
  language: string;
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  certificateName: string;
  certificateStatus: "not-started" | "studying" | "registered" | "passed";
  examDate: string;
  score: string;
  notes: string;
}

export interface LanguageTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  languages: LanguageEntry[];
  checklist: { id: string; text: string; completed: boolean }[];
}

export interface AssociationEntry {
  id: string;
  name: string;
  industry: string;
  membershipType: "student" | "young-professional" | "full" | "other";
  fee: string;
  startDate: string;
  endDate: string;
  role: string;
  committees: string;
  status: "researching" | "applied" | "active" | "expired";
}

export interface AssociationTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  associations: AssociationEntry[];
  checklist: { id: string; text: string; completed: boolean }[];
}

export interface ContributionEntry {
  id: string;
  title: string;
  platform: "OER Commons" | "GitHub" | "Figshare" | "Zenodo" | "Other";
  type: "lesson" | "research" | "dataset" | "code" | "presentation" | "other";
  url: string;
  date: string;
  description: string;
  status: "draft" | "uploaded" | "published";
}

export interface OERProjectTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  contributions: ContributionEntry[];
  checklist: { id: string; text: string; completed: boolean }[];
}

export interface PartnerEntry {
  id: string;
  name: string;
  organization: string;
  program: string;
  website: string;
  newsletterSubscribed: boolean;
  subscriptionDate: string;
  keyTopics: string;
  notes: string;
  status: "researching" | "subscribed" | "not-subscribed";
}

export interface PartnersNewsletterTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  partners: PartnerEntry[];
  checklist: { id: string; text: string; completed: boolean }[];
}

export interface ComponentEntry {
  id: string;
  name: string;
  currentStrength: "weak" | "moderate" | "strong" | "excellent";
  targetStrength: "weak" | "moderate" | "strong" | "excellent";
  evidence: string;
  improvementsNeeded: string;
  status: "not-started" | "in-progress" | "done";
  notes: string;
}

export interface StressTestTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  components: ComponentEntry[];
  checklist: { id: string; text: string; completed: boolean }[];
}

export interface FundedOpportunityTask {
  id: string;
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  timeEstimate: string;
  cvTip: string;
  status: "not-started" | "in-progress" | "done";
  deadline: string | null;
  notes: string;
  opportunities: Opportunity[];
  checklist: { id: string; text: string; completed: boolean }[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  whyItMatters: string;
  stepByStepActions: string[];
  toolsAndLinks: { name: string; url: string }[];
  timeEstimate: string;
  cvPortfolioTip: string;
  status: TaskStatus;
  deadline: string;
  notes: string;
  links: { name: string; url: string }[];
  evidence: { fileName: string; data: string }[];
  checklist: ChecklistItem[];
  isCustom: boolean;
  category: string;
}

export interface AppData {
  tasks: Task[];
  lastUpdated: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  address: string;
  title: string;
  linkedin: string;
  portfolio: string;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  relevantCoursework: string[];
  achievements: string[];
}

export interface WorkExperience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
  cefrLevel: string;
}

export interface ResearchInterest {
  id: string;
  topic: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  institution: string;
  email: string;
  relation: string;
}

export interface UserProfile {
  personalInfo: PersonalInfo;
  profileSummary: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  languages: Language[];
  researchInterests: ResearchInterest[];
  certifications: Certification[];
  references: Reference[];
}
