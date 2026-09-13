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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Task10Progress } from "./Task10Progress";
import { useTask10, StressTestResult } from "@/lib/useTask10";
import { ComponentEntry } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Lightbulb,
  Plus,
  Trash2,
  CheckCircle,
  Pencil,
  Zap,
} from "lucide-react";
import Link from "next/link";

export function Task10Detail() {
  const {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addComponent,
    updateComponent,
    removeComponent,
    setDeadline,
    runStressTest,
    completedCount,
    totalCount,
    percentage,
    totalComponents,
    atTargetCount,
    readinessPercentage,
  } = useTask10();

  const [newNote, setNewNote] = React.useState(task.notes);
  const [isAddCompOpen, setIsAddCompOpen] = React.useState(false);
  const [editingComp, setEditingComp] = React.useState<ComponentEntry | null>(null);
  const [compForm, setCompForm] = React.useState({
    name: "",
    currentStrength: "weak" as ComponentEntry["currentStrength"],
    targetStrength: "strong" as ComponentEntry["targetStrength"],
    evidence: "",
    improvementsNeeded: "",
    status: "not-started" as ComponentEntry["status"],
    notes: "",
  });
  const [stressResult, setStressResult] = React.useState<StressTestResult | null>(null);
  const [isStressTestOpen, setIsStressTestOpen] = React.useState(false);

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

  const resetCompForm = () => {
    setCompForm({
      name: "",
      currentStrength: "weak",
      targetStrength: "strong",
      evidence: "",
      improvementsNeeded: "",
      status: "not-started",
      notes: "",
    });
    setEditingComp(null);
  };

  const handleAddComp = () => {
    if (compForm.name) {
      addComponent(compForm);
      resetCompForm();
      setIsAddCompOpen(false);
    }
  };

  const handleEditComp = (comp: ComponentEntry) => {
    setEditingComp(comp);
    setCompForm({
      name: comp.name,
      currentStrength: comp.currentStrength,
      targetStrength: comp.targetStrength,
      evidence: comp.evidence,
      improvementsNeeded: comp.improvementsNeeded,
      status: comp.status,
      notes: comp.notes,
    });
    setIsAddCompOpen(true);
  };

  const handleUpdateComp = () => {
    if (editingComp) {
      updateComponent(editingComp.id, compForm);
      resetCompForm();
      setIsAddCompOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetCompForm();
    setIsAddCompOpen(false);
  };

  const handleRunStressTest = () => {
    const result = runStressTest();
    setStressResult(result);
    setIsStressTestOpen(true);
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

  const strengthVariant = {
    weak: "destructive" as const,
    moderate: "warning" as const,
    strong: "success" as const,
    excellent: "info" as const,
  };

  const strengthLabel = {
    weak: "Weak",
    moderate: "Moderate",
    strong: "Strong",
    excellent: "Excellent",
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
                <Task10Progress
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
                <CheckCircle className="h-5 w-5" /> Component Tracker
              </CardTitle>
              <Dialog open={isAddCompOpen} onOpenChange={setIsAddCompOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetCompForm}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingComp ? "Edit Component" : "Add Component"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingComp
                        ? "Update the component entry."
                        : "Add an application component to stress-test."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Component Name</Label>
                      <Input
                        value={compForm.name}
                        onChange={(e) =>
                          setCompForm({ ...compForm, name: e.target.value })
                        }
                        placeholder="e.g., CV, LOM, Reference Letter"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Current Strength</Label>
                        <Select
                          value={compForm.currentStrength}
                          onValueChange={(v) =>
                            setCompForm({ ...compForm, currentStrength: v as ComponentEntry["currentStrength"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weak">Weak</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="strong">Strong</SelectItem>
                            <SelectItem value="excellent">Excellent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Target Strength</Label>
                        <Select
                          value={compForm.targetStrength}
                          onValueChange={(v) =>
                            setCompForm({ ...compForm, targetStrength: v as ComponentEntry["targetStrength"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weak">Weak</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="strong">Strong</SelectItem>
                            <SelectItem value="excellent">Excellent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={compForm.status}
                        onValueChange={(v) =>
                          setCompForm({ ...compForm, status: v as ComponentEntry["status"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Evidence</Label>
                      <Textarea
                        value={compForm.evidence}
                        onChange={(e) =>
                          setCompForm({ ...compForm, evidence: e.target.value })
                        }
                        placeholder="What evidence supports this component?"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Improvements Needed</Label>
                      <Textarea
                        value={compForm.improvementsNeeded}
                        onChange={(e) =>
                          setCompForm({ ...compForm, improvementsNeeded: e.target.value })
                        }
                        placeholder="What improvements are needed?"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={compForm.notes}
                        onChange={(e) =>
                          setCompForm({ ...compForm, notes: e.target.value })
                        }
                        placeholder="Additional notes..."
                        rows={2}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={editingComp ? handleUpdateComp : handleAddComp}>
                      {editingComp ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.components.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No components tracked yet. Add your first one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {task.components.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{comp.name}</p>
                            <Badge variant={strengthVariant[comp.currentStrength]}>
                              {strengthLabel[comp.currentStrength]}
                            </Badge>
                            <Badge variant="outline">
                              → {strengthLabel[comp.targetStrength]}
                            </Badge>
                            <Badge variant={statusVariant[comp.status]}>
                              {statusLabel[comp.status]}
                            </Badge>
                          </div>
                          {comp.evidence && (
                            <p className="text-sm text-muted-foreground mt-1">Evidence: {comp.evidence}</p>
                          )}
                          {comp.improvementsNeeded && (
                            <p className="text-sm text-muted-foreground">Improvements: {comp.improvementsNeeded}</p>
                          )}
                          {comp.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{comp.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditComp(comp)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeComponent(comp.id)}
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
                <Zap className="h-5 w-5" /> Stress Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleRunStressTest} className="w-full">
                <Zap className="h-4 w-4 mr-2" /> Run Stress Test
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Readiness Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Components</span>
                </div>
                <span className="text-2xl font-bold">{totalComponents}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">At Target Strength</span>
                </div>
                <span className="text-2xl font-bold">{atTargetCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Readiness</span>
                </div>
                <span className="text-2xl font-bold">{readinessPercentage}%</span>
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

      <Dialog open={isStressTestOpen} onOpenChange={setIsStressTestOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" /> Stress Test Results
            </DialogTitle>
            <DialogDescription>
              Simulating application review without the Letter of Motivation
            </DialogDescription>
          </DialogHeader>
          {stressResult && (
            <div className="space-y-4">
              <Alert variant={stressResult.overallStrength === "strong" ? "default" : "destructive"}>
                <Zap className="h-4 w-4" />
                <AlertTitle>Overall Assessment</AlertTitle>
                <AlertDescription>
                  If the LOM were removed, your application would be{" "}
                  <strong>{stressResult.overallStrength}</strong> based on the remaining components.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold">{stressResult.atTargetCount}/{stressResult.totalCount}</p>
                  <p className="text-sm text-muted-foreground">At Target</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold">{stressResult.belowTarget.length}</p>
                  <p className="text-sm text-muted-foreground">Below Target</p>
                </div>
              </div>
              {stressResult.belowTarget.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Components Below Target Strength:</p>
                  <div className="space-y-2">
                    {stressResult.belowTarget.map((comp) => (
                      <div key={comp.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                        <span className="text-sm font-medium">{comp.name}</span>
                        <Badge variant={strengthVariant[comp.currentStrength]}>
                          {strengthLabel[comp.currentStrength]} → {strengthLabel[comp.targetStrength]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {stressResult.weakestComponents.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Weakest Components to Improve:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {stressResult.weakestComponents.map((comp) => (
                      <li key={comp.id}>
                        <strong>{comp.name}</strong> — {comp.improvementsNeeded || "No improvements noted"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsStressTestOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
