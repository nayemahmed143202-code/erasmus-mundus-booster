"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadProfile, saveProfile } from "@/lib/profile-storage";
import { defaultProfile } from "@/lib/default-profile";
import { UserProfile, Education, WorkExperience, Skill, Language, ResearchInterest, Certification, Reference } from "@/lib/types";
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Languages,
  BookOpen,
  Award,
  Users,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { ExportProfileButtons } from "@/components/export-profile-buttons";

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<UserProfile>(defaultProfile);
  const [activeTab, setActiveTab] = React.useState("personal");

  React.useEffect(() => {
    const data = loadProfile();
    setProfile(data);
  }, []);

  const handleSave = () => {
    saveProfile(profile);
    alert("Profile saved!");
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setProfile({
      ...profile,
      personalInfo: { ...profile.personalInfo, [field]: value },
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      field: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      relevantCoursework: [],
      achievements: [],
    };
    setProfile({
      ...profile,
      education: [...profile.education, newEdu],
    });
  };

  const removeEducation = (id: string) => {
    setProfile({
      ...profile,
      education: profile.education.filter((e) => e.id !== id),
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      education: profile.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      responsibilities: [],
      achievements: [],
    };
    setProfile({
      ...profile,
      workExperience: [...profile.workExperience, newWork],
    });
  };

  const removeWorkExperience = (id: string) => {
    setProfile({
      ...profile,
      workExperience: profile.workExperience.filter((w) => w.id !== id),
    });
  };

  const updateWorkExperience = (id: string, field: string, value: string | boolean) => {
    setProfile({
      ...profile,
      workExperience: profile.workExperience.map((w) =>
        w.id === id ? { ...w, [field]: value } : w
      ),
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      category: "Hospitality & Tourism",
      level: "Intermediate",
    };
    setProfile({
      ...profile,
      skills: [...profile.skills, newSkill],
    });
  };

  const removeSkill = (id: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s.id !== id),
    });
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      name: "",
      proficiency: "",
      cefrLevel: "",
    };
    setProfile({
      ...profile,
      languages: [...profile.languages, newLang],
    });
  };

  const removeLanguage = (id: string) => {
    setProfile({
      ...profile,
      languages: profile.languages.filter((l) => l.id !== id),
    });
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      languages: profile.languages.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    });
  };

  const addResearchInterest = () => {
    const newRI: ResearchInterest = {
      id: Date.now().toString(),
      topic: "",
    };
    setProfile({
      ...profile,
      researchInterests: [...profile.researchInterests, newRI],
    });
  };

  const removeResearchInterest = (id: string) => {
    setProfile({
      ...profile,
      researchInterests: profile.researchInterests.filter((r) => r.id !== id),
    });
  };

  const updateResearchInterest = (id: string, value: string) => {
    setProfile({
      ...profile,
      researchInterests: profile.researchInterests.map((r) =>
        r.id === id ? { ...r, topic: value } : r
      ),
    });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      description: "",
    };
    setProfile({
      ...profile,
      certifications: [...profile.certifications, newCert],
    });
  };

  const removeCertification = (id: string) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.filter((c) => c.id !== id),
    });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const addReference = () => {
    const newRef: Reference = {
      id: Date.now().toString(),
      name: "",
      title: "",
      institution: "",
      email: "",
      relation: "",
    };
    setProfile({
      ...profile,
      references: [...profile.references, newRef],
    });
  };

  const removeReference = (id: string) => {
    setProfile({
      ...profile,
      references: profile.references.filter((r) => r.id !== id),
    });
  };

  const updateReference = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      references: profile.references.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    });
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "languages", label: "Languages", icon: Languages },
    { id: "research", label: "Research", icon: BookOpen },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "references", label: "References", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Erasmus Mundus application profile
          </p>
        </div>
        <div className="flex gap-2">
          <ExportProfileButtons profile={profile} />
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" /> Save Profile
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-48 flex-shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "personal" && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={profile.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profile.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={profile.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <Input
                      value={profile.personalInfo.nationality}
                      onChange={(e) => updatePersonalInfo("nationality", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={profile.personalInfo.address}
                    onChange={(e) => updatePersonalInfo("address", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Professional Title</Label>
                  <Input
                    value={profile.personalInfo.title}
                    onChange={(e) => updatePersonalInfo("title", e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>LinkedIn URL</Label>
                    <Input
                      value={profile.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <Label>Portfolio URL</Label>
                    <Input
                      value={profile.personalInfo.portfolio}
                      onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
                      placeholder="https://linktr.ee/..."
                    />
                  </div>
                </div>
                <div>
                  <Label>Profile Summary</Label>
                  <Textarea
                    value={profile.profileSummary}
                    onChange={(e) =>
                      setProfile({ ...profile, profileSummary: e.target.value })
                    }
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "education" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button size="sm" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Field</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Start Year</Label>
                          <Input
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Year</Label>
                          <Input
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>GPA</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "experience" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <Button size="sm" onClick={addWorkExperience}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.workExperience.map((work) => (
                  <div key={work.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Position</Label>
                          <Input
                            value={work.position}
                            onChange={(e) => updateWorkExperience(work.id, "position", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Company</Label>
                          <Input
                            value={work.company}
                            onChange={(e) => updateWorkExperience(work.id, "company", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={work.location}
                            onChange={(e) => updateWorkExperience(work.id, "location", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            value={work.startDate}
                            onChange={(e) => updateWorkExperience(work.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            value={work.endDate}
                            onChange={(e) => updateWorkExperience(work.id, "endDate", e.target.value)}
                            placeholder="Present"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => removeWorkExperience(work.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "skills" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button size="sm" onClick={addSkill}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                        placeholder="Skill name"
                      />
                    </div>
                    <div className="w-40">
                      <Select
                        value={skill.category}
                        onValueChange={(v) => updateSkill(skill.id, "category", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hospitality & Tourism">Hospitality & Tourism</SelectItem>
                          <SelectItem value="Research & Academic">Research & Academic</SelectItem>
                          <SelectItem value="Management & Leadership">Management & Leadership</SelectItem>
                          <SelectItem value="Digital & Technical">Digital & Technical</SelectItem>
                          <SelectItem value="Interpersonal">Interpersonal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Select
                        value={skill.level}
                        onValueChange={(v) => updateSkill(skill.id, "level", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "languages" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Languages</CardTitle>
                <Button size="sm" onClick={addLanguage}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.languages.map((lang) => (
                  <div key={lang.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        value={lang.name}
                        onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                        placeholder="Language"
                      />
                    </div>
                    <div className="w-40">
                      <Input
                        value={lang.proficiency}
                        onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                        placeholder="Proficiency"
                      />
                    </div>
                    <div className="w-24">
                      <Select
                        value={lang.cefrLevel}
                        onValueChange={(v) => updateLanguage(lang.id, "cefrLevel", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="CEFR" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1">A1</SelectItem>
                          <SelectItem value="A2">A2</SelectItem>
                          <SelectItem value="B1">B1</SelectItem>
                          <SelectItem value="B2">B2</SelectItem>
                          <SelectItem value="C1">C1</SelectItem>
                          <SelectItem value="C2">C2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLanguage(lang.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "research" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Research Interests</CardTitle>
                <Button size="sm" onClick={addResearchInterest}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.researchInterests.map((ri) => (
                  <div key={ri.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        value={ri.topic}
                        onChange={(e) => updateResearchInterest(ri.id, e.target.value)}
                        placeholder="Research interest"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeResearchInterest(ri.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "certifications" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Certifications & Awards</CardTitle>
                <Button size="sm" onClick={addCertification}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Issuer</Label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => removeCertification(cert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={cert.description}
                        onChange={(e) => updateCertification(cert.id, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "references" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Academic References</CardTitle>
                <Button size="sm" onClick={addReference}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.references.map((ref) => (
                  <div key={ref.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={ref.name}
                            onChange={(e) => updateReference(ref.id, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={ref.title}
                            onChange={(e) => updateReference(ref.id, "title", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Institution</Label>
                          <Input
                            value={ref.institution}
                            onChange={(e) => updateReference(ref.id, "institution", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            value={ref.email}
                            onChange={(e) => updateReference(ref.id, "email", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Relation</Label>
                          <Input
                            value={ref.relation}
                            onChange={(e) => updateReference(ref.id, "relation", e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => removeReference(ref.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
