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
