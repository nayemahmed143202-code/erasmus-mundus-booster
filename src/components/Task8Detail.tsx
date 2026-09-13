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
import { Task8Progress } from "./Task8Progress";
import { useTask8 } from "@/lib/useTask8";
import { ContributionEntry } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Lightbulb,
  Plus,
  Trash2,
  FileText,
  Pencil,
  Globe,
} from "lucide-react";
import Link from "next/link";

export function Task8Detail() {
  const {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addContribution,
    updateContribution,
    removeContribution,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalContributions,
    publishedCount,
    platformsUsed,
  } = useTask8();

  const [newNote, setNewNote] = React.useState(task.notes);
  const [isAddContribOpen, setIsAddContribOpen] = React.useState(false);
  const [editingContrib, setEditingContrib] = React.useState<ContributionEntry | null>(null);
  const [contribForm, setContribForm] = React.useState({
    title: "",
    platform: "OER Commons" as ContributionEntry["platform"],
    type: "lesson" as ContributionEntry["type"],
    url: "",
    date: "",
    description: "",
    status: "draft" as ContributionEntry["status"],
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

  const resetContribForm = () => {
    setContribForm({
      title: "",
      platform: "OER Commons",
      type: "lesson",
      url: "",
      date: "",
      description: "",
      status: "draft",
    });
    setEditingContrib(null);
  };

  const handleAddContrib = () => {
    if (contribForm.title) {
      addContribution(contribForm);
      resetContribForm();
      setIsAddContribOpen(false);
    }
  };

  const handleEditContrib = (contrib: ContributionEntry) => {
    setEditingContrib(contrib);
    setContribForm({
      title: contrib.title,
      platform: contrib.platform,
      type: contrib.type,
      url: contrib.url,
      date: contrib.date,
      description: contrib.description,
      status: contrib.status,
    });
    setIsAddContribOpen(true);
  };

  const handleUpdateContrib = () => {
    if (editingContrib) {
      updateContribution(editingContrib.id, contribForm);
      resetContribForm();
      setIsAddContribOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetContribForm();
    setIsAddContribOpen(false);
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

  const contribStatusVariant = {
    draft: "secondary" as const,
    uploaded: "warning" as const,
    published: "success" as const,
  };

  const contribStatusLabel = {
    draft: "Draft",
    uploaded: "Uploaded",
    published: "Published",
  };

  const typeLabel = {
    lesson: "Lesson",
    research: "Research",
    dataset: "Dataset",
    code: "Code",
    presentation: "Presentation",
    other: "Other",
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
                <Task8Progress
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
                <FileText className="h-5 w-5" /> Contribution Tracker
              </CardTitle>
              <Dialog open={isAddContribOpen} onOpenChange={setIsAddContribOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetContribForm}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingContrib ? "Edit Contribution" : "Add Contribution"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingContrib
                        ? "Update the contribution entry."
                        : "Log a new OER or project contribution."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={contribForm.title}
                        onChange={(e) =>
                          setContribForm({ ...contribForm, title: e.target.value })
                        }
                        placeholder="e.g., Introduction to Climate Data Analysis"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Platform</Label>
                        <Select
                          value={contribForm.platform}
                          onValueChange={(v) =>
                            setContribForm({ ...contribForm, platform: v as ContributionEntry["platform"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OER Commons">OER Commons</SelectItem>
                            <SelectItem value="GitHub">GitHub</SelectItem>
                            <SelectItem value="Figshare">Figshare</SelectItem>
                            <SelectItem value="Zenodo">Zenodo</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={contribForm.type}
                          onValueChange={(v) =>
                            setContribForm({ ...contribForm, type: v as ContributionEntry["type"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lesson">Lesson</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="dataset">Dataset</SelectItem>
                            <SelectItem value="code">Code</SelectItem>
                            <SelectItem value="presentation">Presentation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={contribForm.url}
                        onChange={(e) =>
                          setContribForm({ ...contribForm, url: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={contribForm.date}
                        onChange={(e) =>
                          setContribForm({ ...contribForm, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={contribForm.status}
                        onValueChange={(v) =>
                          setContribForm({ ...contribForm, status: v as ContributionEntry["status"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="uploaded">Uploaded</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={contribForm.description}
                        onChange={(e) =>
                          setContribForm({ ...contribForm, description: e.target.value })
                        }
                        placeholder="Describe your contribution..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={editingContrib ? handleUpdateContrib : handleAddContrib}>
                      {editingContrib ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.contributions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No contributions logged yet. Add your first one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {task.contributions.map((contrib) => (
                    <div
                      key={contrib.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{contrib.title}</p>
                            <Badge variant={contribStatusVariant[contrib.status]}>
                              {contribStatusLabel[contrib.status]}
                            </Badge>
                            <Badge variant="outline">
                              {contrib.platform}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {typeLabel[contrib.type]}
                            {contrib.date && ` · ${new Date(contrib.date).toLocaleDateString()}`}
                          </p>
                          {contrib.description && (
                            <p className="text-sm text-muted-foreground mt-1">{contrib.description}</p>
                          )}
                          {contrib.url && (
                            <a
                              href={contrib.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                            >
                              <Globe className="h-3 w-3" />
                              {contrib.url}
                            </a>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditContrib(contrib)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeContribution(contrib.id)}
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
                <FileText className="h-5 w-5" /> Contribution Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Contributions</span>
                </div>
                <span className="text-2xl font-bold">{totalContributions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Published</span>
                </div>
                <span className="text-2xl font-bold">{publishedCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Platforms Used</span>
                </div>
                <span className="text-2xl font-bold">{platformsUsed}</span>
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
