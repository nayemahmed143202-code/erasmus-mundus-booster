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
import { Task7Progress } from "./Task7Progress";
import { useTask7 } from "@/lib/useTask7";
import { AssociationEntry } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Lightbulb,
  Plus,
  Trash2,
  Building2,
  Pencil,
  Users,
} from "lucide-react";
import Link from "next/link";

export function Task7Detail() {
  const {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addAssociation,
    updateAssociation,
    removeAssociation,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalAssociations,
    activeAssociations,
    totalFees,
  } = useTask7();

  const [newNote, setNewNote] = React.useState(task.notes);
  const [isAddAssocOpen, setIsAddAssocOpen] = React.useState(false);
  const [editingAssoc, setEditingAssoc] = React.useState<AssociationEntry | null>(null);
  const [assocForm, setAssocForm] = React.useState({
    name: "",
    industry: "",
    membershipType: "student" as AssociationEntry["membershipType"],
    fee: "",
    startDate: "",
    endDate: "",
    role: "",
    committees: "",
    status: "researching" as AssociationEntry["status"],
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

  const resetAssocForm = () => {
    setAssocForm({
      name: "",
      industry: "",
      membershipType: "student",
      fee: "",
      startDate: "",
      endDate: "",
      role: "",
      committees: "",
      status: "researching",
    });
    setEditingAssoc(null);
  };

  const handleAddAssoc = () => {
    if (assocForm.name) {
      addAssociation(assocForm);
      resetAssocForm();
      setIsAddAssocOpen(false);
    }
  };

  const handleEditAssoc = (assoc: AssociationEntry) => {
    setEditingAssoc(assoc);
    setAssocForm({
      name: assoc.name,
      industry: assoc.industry,
      membershipType: assoc.membershipType,
      fee: assoc.fee,
      startDate: assoc.startDate,
      endDate: assoc.endDate,
      role: assoc.role,
      committees: assoc.committees,
      status: assoc.status,
    });
    setIsAddAssocOpen(true);
  };

  const handleUpdateAssoc = () => {
    if (editingAssoc) {
      updateAssociation(editingAssoc.id, assocForm);
      resetAssocForm();
      setIsAddAssocOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetAssocForm();
    setIsAddAssocOpen(false);
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

  const assocStatusVariant = {
    researching: "secondary" as const,
    applied: "info" as const,
    active: "success" as const,
    expired: "destructive" as const,
  };

  const assocStatusLabel = {
    researching: "Researching",
    applied: "Applied",
    active: "Active",
    expired: "Expired",
  };

  const membershipTypeLabel = {
    "student": "Student",
    "young-professional": "Young Professional",
    "full": "Full",
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
                <Task7Progress
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
                <Building2 className="h-5 w-5" /> Association Tracker
              </CardTitle>
              <Dialog open={isAddAssocOpen} onOpenChange={setIsAddAssocOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetAssocForm}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAssoc ? "Edit Association" : "Add Association"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingAssoc
                        ? "Update the association entry."
                        : "Log a new professional association membership."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={assocForm.name}
                        onChange={(e) =>
                          setAssocForm({ ...assocForm, name: e.target.value })
                        }
                        placeholder="e.g., IEEE, AMA"
                      />
                    </div>
                    <div>
                      <Label>Industry</Label>
                      <Input
                        value={assocForm.industry}
                        onChange={(e) =>
                          setAssocForm({ ...assocForm, industry: e.target.value })
                        }
                        placeholder="e.g., Engineering, Marketing"
                      />
                    </div>
                    <div>
                      <Label>Membership Type</Label>
                      <Select
                        value={assocForm.membershipType}
                        onValueChange={(v) =>
                          setAssocForm({ ...assocForm, membershipType: v as AssociationEntry["membershipType"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="young-professional">Young Professional</SelectItem>
                          <SelectItem value="full">Full</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Fee</Label>
                      <Input
                        value={assocForm.fee}
                        onChange={(e) =>
                          setAssocForm({ ...assocForm, fee: e.target.value })
                        }
                        placeholder="e.g., $50/year"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={assocForm.startDate}
                          onChange={(e) =>
                            setAssocForm({ ...assocForm, startDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={assocForm.endDate}
                          onChange={(e) =>
                            setAssocForm({ ...assocForm, endDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={assocForm.role}
                        onChange={(e) =>
                          setAssocForm({ ...assocForm, role: e.target.value })
                        }
                        placeholder="e.g., Member, Board Member"
                      />
                    </div>
                    <div>
                      <Label>Committees</Label>
                      <Input
                        value={assocForm.committees}
                        onChange={(e) =>
                          setAssocForm({ ...assocForm, committees: e.target.value })
                        }
                        placeholder="e.g., Events Committee, Young Professionals"
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={assocForm.status}
                        onValueChange={(v) =>
                          setAssocForm({ ...assocForm, status: v as AssociationEntry["status"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="researching">Researching</SelectItem>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={editingAssoc ? handleUpdateAssoc : handleAddAssoc}>
                      {editingAssoc ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.associations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No associations logged yet. Add your first one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {task.associations.map((assoc) => (
                    <div
                      key={assoc.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{assoc.name}</p>
                            <Badge variant={assocStatusVariant[assoc.status]}>
                              {assocStatusLabel[assoc.status]}
                            </Badge>
                            <Badge variant="outline">
                              {membershipTypeLabel[assoc.membershipType]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {assoc.industry} · {assoc.fee}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {assoc.role}
                            {assoc.startDate && ` · ${new Date(assoc.startDate).toLocaleDateString()}`}
                            {assoc.endDate && ` – ${new Date(assoc.endDate).toLocaleDateString()}`}
                          </p>
                          {assoc.committees && (
                            <p className="text-sm text-muted-foreground mt-1">Committees: {assoc.committees}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditAssoc(assoc)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeAssociation(assoc.id)}
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
                <Users className="h-5 w-5" /> Membership Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Associations</span>
                </div>
                <span className="text-2xl font-bold">{totalAssociations}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Memberships</span>
                </div>
                <span className="text-2xl font-bold">{activeAssociations}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Memberships</span>
                </div>
                <span className="text-2xl font-bold">{totalFees}</span>
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
