"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task6Progress } from "./Task6Progress";
import { useTask6 } from "@/lib/useTask6";
import { LanguageEntry, CEFRLevel } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Lightbulb,
  Plus,
  Trash2,
  Globe,
  Pencil,
  Award,
} from "lucide-react";
import Link from "next/link";

const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"];

export function Task6Detail() {
  const {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addLanguage,
    updateLanguage,
    removeLanguage,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalLanguages,
    certificatesPassed,
    upcomingExams,
  } = useTask6();

  const [newNote, setNewNote] = React.useState(task.notes);
  const [isAddLangOpen, setIsAddLangOpen] = React.useState(false);
  const [editingLang, setEditingLang] = React.useState<LanguageEntry | null>(null);
  const [langForm, setLangForm] = React.useState({
    language: "",
    currentLevel: "A1" as CEFRLevel,
    targetLevel: "A1" as CEFRLevel,
    certificateName: "",
    certificateStatus: "not-started" as LanguageEntry["certificateStatus"],
    examDate: "",
    score: "",
    notes: "",
  });

  React.useEffect(() => {
    if (loaded) {
      setNewNote(task.notes);
    }
  }, [loaded, task.notes]);

  if (!loaded) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  const handleSaveNotes = () => {
    addNote(newNote);
  };

  const resetLangForm = () => {
    setLangForm({
      language: "",
      currentLevel: "A1",
      targetLevel: "A1",
      certificateName: "",
      certificateStatus: "not-started",
      examDate: "",
      score: "",
      notes: "",
    });
    setEditingLang(null);
  };

  const handleAddLang = () => {
    if (langForm.language) {
      addLanguage(langForm);
      resetLangForm();
      setIsAddLangOpen(false);
    }
  };

  const handleEditLang = (lang: LanguageEntry) => {
    setEditingLang(lang);
    setLangForm({
      language: lang.language,
      currentLevel: lang.currentLevel,
      targetLevel: lang.targetLevel,
      certificateName: lang.certificateName,
      certificateStatus: lang.certificateStatus,
      examDate: lang.examDate,
      score: lang.score,
      notes: lang.notes,
    });
    setIsAddLangOpen(true);
  };

  const handleUpdateLang = () => {
    if (editingLang) {
      updateLanguage(editingLang.id, langForm);
      resetLangForm();
      setIsAddLangOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetLangForm();
    setIsAddLangOpen(false);
  };

  const statusVariant = {
    "not-started": "warning" as const,
    "in-progress": "info" as const,
    "done": "success" as const,
  };

  const statusLabel = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    "done": "Done",
  };

  const certStatusVariant = {
    "not-started": "secondary" as const,
    studying: "info" as const,
    registered: "warning" as const,
    passed: "success" as const,
  };

  const certStatusLabel = {
    "not-started": "Not Started",
    studying: "Studying",
    registered: "Registered",
    passed: "Passed",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
            <Badge variant={statusVariant[task.status]}>
              {statusLabel[task.status]}
            </Badge>
          </div>
        </div>
        <Select value={task.status} onValueChange={updateStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Why It Matters</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.why}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Steps</CardTitle>
              <div className="mt-2">
                <Task6Progress
                  completed={completedCount}
                  total={totalCount}
                  percentage={percentage}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.checklist.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem(item.id)}
                    className="mt-0.5"
                  />
                  <span
                    className={`text-sm ${
                      item.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" /> Language Tracker
              </CardTitle>
              <Dialog open={isAddLangOpen} onOpenChange={setIsAddLangOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetLangForm}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingLang ? "Edit Language" : "Add Language"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingLang
                        ? "Update the language entry."
                        : "Track a new language and its certification."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Language</Label>
                      <Input
                        value={langForm.language}
                        onChange={(e) =>
                          setLangForm({ ...langForm, language: e.target.value })
                        }
                        placeholder="e.g., Spanish, French"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Current Level (CEFR)</Label>
                        <Select
                          value={langForm.currentLevel}
                          onValueChange={(v) =>
                            setLangForm({ ...langForm, currentLevel: v as CEFRLevel })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CEFR_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Target Level (CEFR)</Label>
                        <Select
                          value={langForm.targetLevel}
                          onValueChange={(v) =>
                            setLangForm({ ...langForm, targetLevel: v as CEFRLevel })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CEFR_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Certificate Name</Label>
                      <Input
                        value={langForm.certificateName}
                        onChange={(e) =>
                          setLangForm({ ...langForm, certificateName: e.target.value })
                        }
                        placeholder="e.g., DELE B1, DELF A2"
                      />
                    </div>
                    <div>
                      <Label>Certificate Status</Label>
                      <Select
                        value={langForm.certificateStatus}
                        onValueChange={(v) =>
                          setLangForm({ ...langForm, certificateStatus: v as LanguageEntry["certificateStatus"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="studying">Studying</SelectItem>
                          <SelectItem value="registered">Registered</SelectItem>
                          <SelectItem value="passed">Passed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Exam Date</Label>
                        <Input
                          type="date"
                          value={langForm.examDate}
                          onChange={(e) =>
                            setLangForm({ ...langForm, examDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Score</Label>
                        <Input
                          value={langForm.score}
                          onChange={(e) =>
                            setLangForm({ ...langForm, score: e.target.value })
                          }
                          placeholder="e.g., 85%, B1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={langForm.notes}
                        onChange={(e) =>
                          setLangForm({ ...langForm, notes: e.target.value })
                        }
                        placeholder="Additional notes..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={editingLang ? handleUpdateLang : handleAddLang}>
                      {editingLang ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.languages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No languages tracked yet. Add your first one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {task.languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{lang.language}</p>
                            <Badge variant={certStatusVariant[lang.certificateStatus]}>
                              {certStatusLabel[lang.certificateStatus]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lang.currentLevel} → {lang.targetLevel}
                            {lang.certificateName && ` · ${lang.certificateName}`}
                          </p>
                          {lang.examDate && (
                            <p className="text-sm text-muted-foreground">
                              Exam: {new Date(lang.examDate).toLocaleDateString()}
                              {lang.score && ` · Score: ${lang.score}`}
                            </p>
                          )}
                          {lang.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{lang.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditLang(lang)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeLanguage(lang.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add your notes here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
              />
              <Button onClick={handleSaveNotes} size="sm">
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" /> Certificate Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Languages</span>
                </div>
                <span className="text-2xl font-bold">{totalLanguages}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Certificates Passed</span>
                </div>
                <span className="text-2xl font-bold">{certificatesPassed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Upcoming Exams</span>
                </div>
                <span className="text-2xl font-bold">{upcomingExams}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Time Estimate</p>
                  <p className="text-sm text-muted-foreground">{task.timeEstimate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Deadline</p>
                  <Input
                    type="date"
                    value={task.deadline || ""}
                    onChange={(e) => setDeadline(e.target.value || null)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" /> CV Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                {task.cvTip}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {task.tools.map((tool, index) => (
                  <Badge key={index} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
