"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";
import { Download, FileText } from "lucide-react";
import { jsPDF } from "jspdf";

interface ExportProfileButtonsProps {
  profile: UserProfile;
}

export function ExportProfileButtons({ profile }: ExportProfileButtonsProps) {
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nayeem-profile-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFontSize(20);
    doc.text(profile.personalInfo.fullName, 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(profile.personalInfo.title, 20, y);
    y += 6;
    doc.text(`${profile.personalInfo.email} | ${profile.personalInfo.phone} | ${profile.personalInfo.nationality}`, 20, y);
    y += 6;
    doc.text(profile.personalInfo.address, 20, y);
    y += 10;

    // Profile Summary
    doc.setFontSize(12);
    doc.text("Profile Summary", 20, y);
    y += 6;
    doc.setFontSize(9);
    const summaryLines = doc.splitTextToSize(profile.profileSummary, 170);
    doc.text(summaryLines, 20, y);
    y += summaryLines.length * 4 + 6;

    // Education
    doc.setFontSize(12);
    doc.text("Education", 20, y);
    y += 6;
    profile.education.forEach((edu) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.text(`${edu.degree} in ${edu.field}`, 20, y);
      y += 5;
      doc.setFontSize(9);
      doc.text(`${edu.institution} | ${edu.startDate} - ${edu.endDate} | GPA: ${edu.gpa}`, 20, y);
      y += 7;
    });

    // Work Experience
    y += 3;
    doc.setFontSize(12);
    doc.text("Work Experience", 20, y);
    y += 6;
    profile.workExperience.forEach((work) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.text(`${work.position} — ${work.company}`, 20, y);
      y += 5;
      doc.setFontSize(9);
      doc.text(`${work.location} | ${work.startDate} - ${work.endDate}`, 20, y);
      y += 5;
      work.achievements.forEach((ach) => {
        if (y > 270) { doc.addPage(); y = 20; }
        const achLines = doc.splitTextToSize(`• ${ach}`, 165);
        doc.text(achLines, 25, y);
        y += achLines.length * 4;
      });
      y += 3;
    });

    // Skills
    y += 3;
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.text("Skills", 20, y);
    y += 6;
    doc.setFontSize(9);
    const categories = Array.from(new Set(profile.skills.map((s) => s.category)));
    categories.forEach((cat) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const skills = profile.skills.filter((s) => s.category === cat);
      doc.text(`${cat}: ${skills.map((s) => s.name).join(", ")}`, 20, y);
      y += 5;
    });

    // Languages
    y += 3;
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.text("Languages", 20, y);
    y += 6;
    doc.setFontSize(9);
    profile.languages.forEach((lang) => {
      doc.text(`${lang.name}: ${lang.proficiency} (${lang.cefrLevel})`, 20, y);
      y += 5;
    });

    // References
    y += 3;
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.text("References", 20, y);
    y += 6;
    doc.setFontSize(9);
    profile.references.forEach((ref) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`${ref.name} — ${ref.title}`, 20, y);
      y += 5;
      doc.text(`${ref.institution} | ${ref.email} | ${ref.relation}`, 20, y);
      y += 7;
    });

    doc.save(`nayeem-profile-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExportJSON}>
        <Download className="h-4 w-4 mr-2" /> JSON
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <FileText className="h-4 w-4 mr-2" /> PDF
      </Button>
    </div>
  );
}
