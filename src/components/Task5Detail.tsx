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
import { Task5Progress } from "./Task5Progress";
import { useTask5 } from "@/lib/useTask5";
import { CommitteeEntry } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Lightbulb,
  Plus,
  Trash2,
  Building2,
  Pencil,
  FileText,
} from "lucide-react";
import Link from "next/link";

export function Task5Detail() {
  const {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addCommittee,
    updateCommittee,
    removeCommittee,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalCommittees,
    activeCommittees,
    totalMonths,
  } = useTask5();

  const [newNote, setNewNote] = React.useState(task.notes);
  const [isAddCommOpen, setIsAddCommOpen] = React.useState(false);
  const [editingComm, setEditingComm] = React.useState<CommitteeEntry | null>(null);
  const [commForm, setCommForm] = React.useState({
    name: "",
    organization: "",
    role: "",
    type: "advisory" as CommitteeEntry["type"],
    startDate: "",
    endDate: "",
    meetingFrequency: "",
    keyContributions: "",
    status: "applied" as CommitteeEntry["status"],
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

  const resetCommForm = () => {
    setCommForm({
      name: "",
      organization: "",
      role: "",
      type: "advisory",
      startDate: "",
      endDate: "",
      meetingFrequency: "",
      keyContributions: "",
      status: "applied",
    });
    setEditingComm(null);
  };

  const handleAddComm = () => {
    if (commForm.name) {
      addCommittee(commForm);
      resetCommForm();
      setIsAddCommOpen(false);
    }
  };

  const handleEditComm = (comm: CommitteeEntry) => {
    setEditingComm(comm);
    setCommForm({
      name: comm.name,
      organization: comm.organization,
      role: comm.role,
      type: comm.type,
      startDate: comm.startDate,
      endDate: comm.endDate,
      meetingFrequency: comm.meetingFrequency,
      keyContributions: comm.keyContributions,
      status: comm.status,
    });
    setIsAddCommOpen(true);
  };

  const handleUpdateComm = () => {
    if (editingComm) {
      updateCommittee(editingComm.id, commForm);
      resetCommForm();
      setIsAddCommOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetCommForm();
    setIsAddCommOpen(false);
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

  const commStatusVariant = {
    applied: "info" as const,
    active: "success" as const,
    completed: "secondary" as const,
    rejected: "destructive" as const,
  };

  const commStatusLabel = {
    applied: "Applied",
    active: "Active",
    completed: "Completed",
    rejected: "Rejected",
  };

  const commTypeLabel = {
    "advisory": "Advisory",
    "board-of-directors": "Board of Directors",
    "working-group": "Working Group",
    "committee": "Committee",
    "other": "Other",
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
                <Task5Progress
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
                <Building2 className="h-5 w-5" /> Committee Tracker
              </CardTitle>
              <Dialog open={isAddCommOpen} onOpenChange={setIsAddCommOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetCommForm}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingComm ? "Edit Committee" : "Add Committee"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingComm
                        ? "Update the committee entry."
                        : "Log a new committee or advisory board membership."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Committee Name</Label>
                      <Input
                        value={commForm.name}
                        onChange={(e) =>
                          setCommForm({ ...commForm, name: e.target.value })
                        }
                        placeholder="e.g., Library Advisory Committee"
                      />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input
                        value={commForm.organization}
                        onChange={(e) =>
                          setCommForm({ ...commForm, organization: e.target.value })
                        }
                        placeholder="e.g., City of Toronto"
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={commForm.role}
                        onChange={(e) =>
                          setCommForm({ ...commForm, role: e.target.value })
                        }
                        placeholder="e.g., Student Representative"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={commForm.type}
                        onValueChange={(v) =>
                          setCommForm({ ...commForm, type: v as CommitteeEntry["type"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="advisory">Advisory</SelectItem>
                          <SelectItem value="board-of-directors">Board of Directors</SelectItem>
                          <SelectItem value="working-group">Working Group</SelectItem>
                          <SelectItem value="committee">Committee</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={commForm.startDate}
                          onChange={(e) =>
                            setCommForm({ ...commForm, startDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={commForm.endDate}
                          onChange={(e) =>
                            setCommForm({ ...commForm, endDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Meeting Frequency</Label>
                      <Input
                        value={commForm.meetingFrequency}
                        onChange={(e) =>
                          setCommForm({ ...commForm, meetingFrequency: e.target.value })
                        }
                        placeholder="e.g., Monthly, Bi-weekly"
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={commForm.status}
                        onValueChange={(v) =>
                          setCommForm({ ...commForm, status: v as CommitteeEntry["status"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Key Contributions</Label>
                      <Textarea
                        value={commForm.keyContributions}
                        onChange={(e) =>
                          setCommForm({ ...commForm, keyContributions: e.target.value })
                        }
                        placeholder="Describe your role, decisions, and impact..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={editingComm ? handleUpdateComm : handleAddComm}>
                      {editingComm ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.committees.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No committees logged yet. Add your first one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {task.committees.map((comm) => (
                    <div
                      key={comm.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{comm.name}</p>
                            <Badge variant={commStatusVariant[comm.status]}>
                              {commStatusLabel[comm.status]}
                            </Badge>
                            <Badge variant="outline">
                              {commTypeLabel[comm.type]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {comm.organization} · {comm.role}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {comm.meetingFrequency}
                            {comm.startDate && ` · ${new Date(comm.startDate).toLocaleDateString()}`}
                            {comm.endDate && ` – ${new Date(comm.endDate).toLocaleDateString()}`}
                          </p>
                          {comm.keyContributions && (
                            <p className="text-sm text-muted-foreground mt-1">{comm.keyContributions}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditComm(comm)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeCommittee(comm.id)}
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
                <FileText className="h-5 w-5" /> Committee Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Committees</span>
                </div>
                <span className="text-2xl font-bold">{totalCommittees}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Committees</span>
                </div>
                <span className="text-2xl font-bold">{activeCommittees}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Months</span>
                </div>
                <span className="text-2xl font-bold">{totalMonths}</span>
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
