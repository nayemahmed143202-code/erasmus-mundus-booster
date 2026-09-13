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
import { Task3Progress } from "./Task3Progress";
import { useTask3 } from "@/lib/useTask3";
import { Opportunity } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Lightbulb,
  Plus,
  Trash2,
  Target,
  Pencil,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export function Task3Detail() {
  const {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addOpportunity,
    updateOpportunity,
    removeOpportunity,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    submittedCount,
    upcomingDeadlines,
  } = useTask3();

  const [newNote, setNewNote] = React.useState(task.notes);
  const [isAddOppOpen, setIsAddOppOpen] = React.useState(false);
  const [editingOpp, setEditingOpp] = React.useState<Opportunity | null>(null);
  const [oppForm, setOppForm] = React.useState({
    name: "",
    organization: "",
    location: "",
    fundingType: "fully-funded" as Opportunity["fundingType"],
    deadline: "",
    applicationStatus: "researching" as Opportunity["applicationStatus"],
    url: "",
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

  const resetOppForm = () => {
    setOppForm({
      name: "",
      organization: "",
      location: "",
      fundingType: "fully-funded",
      deadline: "",
      applicationStatus: "researching",
      url: "",
      notes: "",
    });
    setEditingOpp(null);
  };

  const handleAddOpp = () => {
    if (oppForm.name) {
      addOpportunity(oppForm);
      resetOppForm();
      setIsAddOppOpen(false);
    }
  };

  const handleEditOpp = (opp: Opportunity) => {
    setEditingOpp(opp);
    setOppForm({
      name: opp.name,
      organization: opp.organization,
      location: opp.location,
      fundingType: opp.fundingType,
      deadline: opp.deadline,
      applicationStatus: opp.applicationStatus,
      url: opp.url,
      notes: opp.notes,
    });
    setIsAddOppOpen(true);
  };

  const handleUpdateOpp = () => {
    if (editingOpp) {
      updateOpportunity(editingOpp.id, oppForm);
      resetOppForm();
      setIsAddOppOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetOppForm();
    setIsAddOppOpen(false);
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

  const fundingVariant = {
    "fully-funded": "success" as const,
    partial: "info" as const,
    "fee-waiver": "outline" as const,
    unknown: "secondary" as const,
  };

  const fundingLabel = {
    "fully-funded": "Fully Funded",
    partial: "Partial",
    "fee-waiver": "Fee Waiver",
    unknown: "Unknown",
  };

  const appStatusVariant = {
    researching: "secondary" as const,
    preparing: "info" as const,
    submitted: "warning" as const,
    accepted: "success" as const,
    rejected: "destructive" as const,
  };

  const appStatusLabel = {
    researching: "Researching",
    preparing: "Preparing",
    submitted: "Submitted",
    accepted: "Accepted",
    rejected: "Rejected",
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
                <Task3Progress
                  completed={completedCount}
                  total={totalCount}
                  percentage={percentage}
                  submitted={submittedCount}
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
                <Target className="h-5 w-5" /> Opportunities Tracker
              </CardTitle>
              <Dialog open={isAddOppOpen} onOpenChange={setIsAddOppOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetOppForm}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingOpp ? "Edit Opportunity" : "Add Opportunity"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingOpp
                        ? "Update the opportunity details."
                        : "Track a new summer school or fellowship."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={oppForm.name}
                        onChange={(e) =>
                          setOppForm({ ...oppForm, name: e.target.value })
                        }
                        placeholder="Program name"
                      />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input
                        value={oppForm.organization}
                        onChange={(e) =>
                          setOppForm({ ...oppForm, organization: e.target.value })
                        }
                        placeholder="Organization name"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={oppForm.location}
                        onChange={(e) =>
                          setOppForm({ ...oppForm, location: e.target.value })
                        }
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <Label>Funding Type</Label>
                      <Select
                        value={oppForm.fundingType}
                        onValueChange={(v) =>
                          setOppForm({ ...oppForm, fundingType: v as Opportunity["fundingType"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fully-funded">Fully Funded</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="fee-waiver">Fee Waiver</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Deadline</Label>
                      <Input
                        type="date"
                        value={oppForm.deadline}
                        onChange={(e) =>
                          setOppForm({ ...oppForm, deadline: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Application Status</Label>
                      <Select
                        value={oppForm.applicationStatus}
                        onValueChange={(v) =>
                          setOppForm({ ...oppForm, applicationStatus: v as Opportunity["applicationStatus"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="researching">Researching</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={oppForm.url}
                        onChange={(e) =>
                          setOppForm({ ...oppForm, url: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={oppForm.notes}
                        onChange={(e) =>
                          setOppForm({ ...oppForm, notes: e.target.value })
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
                    <Button onClick={editingOpp ? handleUpdateOpp : handleAddOpp}>
                      {editingOpp ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.opportunities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No opportunities tracked yet. Add your first one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {task.opportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{opp.name}</p>
                            <Badge variant={appStatusVariant[opp.applicationStatus]}>
                              {appStatusLabel[opp.applicationStatus]}
                            </Badge>
                            <Badge variant={fundingVariant[opp.fundingType]}>
                              {fundingLabel[opp.fundingType]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {opp.organization} · {opp.location}
                            {opp.deadline && ` · Deadline: ${new Date(opp.deadline).toLocaleDateString()}`}
                          </p>
                          {opp.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{opp.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditOpp(opp)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeOpportunity(opp.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {opp.url && (
                        <a
                          href={opp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {opp.url}
                        </a>
                      )}
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
          {upcomingDeadlines.length > 0 && (
            <Card className="border-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" /> Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingDeadlines.map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{opp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(opp.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={appStatusVariant[opp.applicationStatus]}>
                      {appStatusLabel[opp.applicationStatus]}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
