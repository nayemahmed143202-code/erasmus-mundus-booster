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
import { Task4Progress } from "./Task4Progress";
import { useTask4 } from "@/lib/useTask4";
import { MentorshipEntry } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Lightbulb,
  Plus,
  Trash2,
  Users,
  Pencil,
  Heart,
} from "lucide-react";
import Link from "next/link";

export function Task4Detail() {
  const {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addMentorship,
    updateMentorship,
    removeMentorship,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalMentees,
    totalHours,
    activeMentorships,
  } = useTask4();

  const [newNote, setNewNote] = React.useState(task.notes);
  const [isAddMentOpen, setIsAddMentOpen] = React.useState(false);
  const [editingMent, setEditingMent] = React.useState<MentorshipEntry | null>(null);
  const [mentForm, setMentForm] = React.useState({
    programName: "",
    organization: "",
    role: "",
    menteeCount: 0,
    startDate: "",
    endDate: "",
    hoursPerWeek: 0,
    outcomes: "",
    status: "active" as MentorshipEntry["status"],
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

  const resetMentForm = () => {
    setMentForm({
      programName: "",
      organization: "",
      role: "",
      menteeCount: 0,
      startDate: "",
      endDate: "",
      hoursPerWeek: 0,
      outcomes: "",
      status: "active",
    });
    setEditingMent(null);
  };

  const handleAddMent = () => {
    if (mentForm.programName) {
      addMentorship(mentForm);
      resetMentForm();
      setIsAddMentOpen(false);
    }
  };

  const handleEditMent = (ment: MentorshipEntry) => {
    setEditingMent(ment);
    setMentForm({
      programName: ment.programName,
      organization: ment.organization,
      role: ment.role,
      menteeCount: ment.menteeCount,
      startDate: ment.startDate,
      endDate: ment.endDate,
      hoursPerWeek: ment.hoursPerWeek,
      outcomes: ment.outcomes,
      status: ment.status,
    });
    setIsAddMentOpen(true);
  };

  const handleUpdateMent = () => {
    if (editingMent) {
      updateMentorship(editingMent.id, mentForm);
      resetMentForm();
      setIsAddMentOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetMentForm();
    setIsAddMentOpen(false);
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

  const mentStatusVariant = {
    active: "success" as const,
    completed: "info" as const,
    planned: "secondary" as const,
  };

  const mentStatusLabel = {
    active: "Active",
    completed: "Completed",
    planned: "Planned",
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
                <Task4Progress
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
                <Heart className="h-5 w-5" /> Mentorship Log
              </CardTitle>
              <Dialog open={isAddMentOpen} onOpenChange={setIsAddMentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetMentForm}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMent ? "Edit Mentorship" : "Add Mentorship"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingMent
                        ? "Update the mentorship entry."
                        : "Log a new mentorship experience."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Program Name</Label>
                      <Input
                        value={mentForm.programName}
                        onChange={(e) =>
                          setMentForm({ ...mentForm, programName: e.target.value })
                        }
                        placeholder="e.g., University Peer Mentoring"
                      />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input
                        value={mentForm.organization}
                        onChange={(e) =>
                          setMentForm({ ...mentForm, organization: e.target.value })
                        }
                        placeholder="e.g., Rajshahi University"
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={mentForm.role}
                        onChange={(e) =>
                          setMentForm({ ...mentForm, role: e.target.value })
                        }
                        placeholder="e.g., Peer Mentor"
                      />
                    </div>
                    <div>
                      <Label>Mentee Count</Label>
                      <Input
                        type="number"
                        min={0}
                        value={mentForm.menteeCount}
                        onChange={(e) =>
                          setMentForm({ ...mentForm, menteeCount: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={mentForm.startDate}
                          onChange={(e) =>
                            setMentForm({ ...mentForm, startDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={mentForm.endDate}
                          onChange={(e) =>
                            setMentForm({ ...mentForm, endDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Hours per Week</Label>
                      <Input
                        type="number"
                        min={0}
                        value={mentForm.hoursPerWeek}
                        onChange={(e) =>
                          setMentForm({ ...mentForm, hoursPerWeek: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={mentForm.status}
                        onValueChange={(v) =>
                          setMentForm({ ...mentForm, status: v as MentorshipEntry["status"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="planned">Planned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Outcomes</Label>
                      <Textarea
                        value={mentForm.outcomes}
                        onChange={(e) =>
                          setMentForm({ ...mentForm, outcomes: e.target.value })
                        }
                        placeholder="Describe mentee progress and measurable outcomes..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={editingMent ? handleUpdateMent : handleAddMent}>
                      {editingMent ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.mentorships.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No mentorships logged yet. Add your first one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {task.mentorships.map((ment) => (
                    <div
                      key={ment.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{ment.programName}</p>
                            <Badge variant={mentStatusVariant[ment.status]}>
                              {mentStatusLabel[ment.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {ment.organization} · {ment.role}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {ment.menteeCount} mentee{ment.menteeCount !== 1 ? "s" : ""} · {ment.hoursPerWeek}h/week
                            {ment.startDate && ` · ${new Date(ment.startDate).toLocaleDateString()}`}
                            {ment.endDate && ` – ${new Date(ment.endDate).toLocaleDateString()}`}
                          </p>
                          {ment.outcomes && (
                            <p className="text-sm text-muted-foreground mt-1">{ment.outcomes}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditMent(ment)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeMentorship(ment.id)}
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
                <Heart className="h-5 w-5" /> Mentorship Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Mentees</span>
                </div>
                <span className="text-2xl font-bold">{totalMentees}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Hours</span>
                </div>
                <span className="text-2xl font-bold">{totalHours}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Mentorships</span>
                </div>
                <span className="text-2xl font-bold">{activeMentorships}</span>
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
