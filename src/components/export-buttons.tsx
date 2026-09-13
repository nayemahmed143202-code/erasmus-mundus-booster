"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { loadData } from "@/lib/tasks";
import { Download, FileText } from "lucide-react";
import { jsPDF } from "jspdf";

export function ExportButtons() {
  const handleExportJSON = () => {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `erasmus-mundus-progress-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const data = loadData();
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Erasmus Mundus Application Booster", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    
    const completed = data.tasks.filter((t) => t.status === "done").length;
    const inProgress = data.tasks.filter((t) => t.status === "in_progress").length;
    const total = data.tasks.length;
    
    doc.text(`Progress: ${completed}/${total} completed, ${inProgress} in progress`, 20, 40);
    
    let y = 60;
    data.tasks.forEach((task, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      const statusText = task.status === "done" ? "[DONE]" : task.status === "in_progress" ? "[IN PROGRESS]" : "[NOT STARTED]";
      
      doc.setFontSize(11);
      doc.text(`${index + 1}. ${task.title} ${statusText}`, 20, y);
      y += 7;
      
      if (task.deadline) {
        doc.setFontSize(9);
        doc.text(`   Deadline: ${new Date(task.deadline).toLocaleDateString()}`, 20, y);
        y += 5;
      }
      
      if (task.notes) {
        doc.setFontSize(9);
        const splitNotes = doc.splitTextToSize(`   Notes: ${task.notes}`, 170);
        doc.text(splitNotes, 20, y);
        y += splitNotes.length * 5;
      }
      
      y += 5;
    });
    
    doc.save(`erasmus-mundus-progress-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExportJSON}>
        <Download className="h-4 w-4 mr-2" /> Export JSON
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <FileText className="h-4 w-4 mr-2" /> Export PDF
      </Button>
    </div>
  );
}
