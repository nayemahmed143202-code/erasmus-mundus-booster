"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { StatusBadge } from "./StatusBadge";
import { useTasks } from "@/lib/useTasks";
import { Task, TaskStatus, ChecklistItem } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Upload,
  Trash2,
  Plus,
  FileText,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

export function TaskDetail() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const { tasks, updateTask, deleteTask } = useTasks();

  const [task, setTask] = React.useState<Task | null>(null);
  const [notes, setNotes] = React.useState("");
  const [newLink, setNewLink] = React.useState({ name: "", url: "" });
  const [newChecklistItem, setNewChecklistItem] = React.useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const foundTask = tasks.find((t) => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setNotes(foundTask.notes);
    }
  }, [tasks, taskId]);

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Task not found.</p>
        <Link href="/tasks">
          <Button variant="ghost" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tasks
          </Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    const updatedTask = { ...task, status: newStatus };
    updateTask(updatedTask);
    setTask(updatedTask);
  };

  const handleSaveNotes = () => {
    const updatedTask = { ...task, notes };
    updateTask(updatedTask);
    setTask(updatedTask);
  };

  const handleAddLink = () => {
    if (newLink.name && newLink.url) {
      const updatedTask = {
        ...task,
        links: [...task.links, newLink],
      };
      updateTask(updatedTask);
      setTask(updatedTask);
      setNewLink({ name: "", url: "" });
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedTask = {
      ...task,
      links: task.links.filter((_, i) => i !== index),
    };
    updateTask(updatedTask);
    setTask(updatedTask);
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedTask = {
      ...task,
      checklist: task.checklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    };
    updateTask(updatedTask);
    setTask(updatedTask);
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem,
        completed: false,
      };
      const updatedTask = {
        ...task,
        checklist: [...task.checklist, newItem],
      };
      updateTask(updatedTask);
      setTask(updatedTask);
      setNewChecklistItem("");
    }
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    const updatedTask = {
      ...task,
      checklist: task.checklist.filter((item) => item.id !== itemId),
    };
    updateTask(updatedTask);
    setTask(updatedTask);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const updatedTask = {
          ...task,
          evidence: [
            ...task.evidence,
            { fileName: file.name, data: base64 },
          ],
        };
        updateTask(updatedTask);
        setTask(updatedTask);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveEvidence = (index: number) => {
    const updatedTask = {
      ...task,
      evidence: task.evidence.filter((_, i) => i !== index),
    };
    updateTask(updatedTask);
    setTask(updatedTask);
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    router.push("/tasks");
  };

  const completedChecklistItems = task.checklist.filter(
    (item) => item.completed
  ).length;
  const totalChecklistItems = task.checklist.length;

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
            <StatusBadge status={task.status} />
          </div>
          <p className="text-muted-foreground mt-1">{task.category}</p>
        </div>
        <Select value={task.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        {task.isCustom && (
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteTask}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{task.description}</p>
              {task.longDescription && (
                <p className="mt-4">{task.longDescription}</p>
              )}
            </CardContent>
          </Card>

          {task.whyItMatters && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" /> Why It Matters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{task.whyItMatters}</p>
              </CardContent>
            </Card>
          )}

          {task.stepByStepActions && task.stepByStepActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Step-by-Step Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  {task.stepByStepActions.map((action, index) => (
                    <li key={index} className="text-muted-foreground">
                      {action}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
              {totalChecklistItems > 0 && (
                <p className="text-sm text-muted-foreground">
                  {completedChecklistItems} of {totalChecklistItems} completed
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {task.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleChecklistItem(item.id)}
                  />
                  <span
                    className={`flex-1 ${
                      item.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add checklist item..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddChecklistItem();
                    }
                  }}
                />
                <Button size="icon" onClick={handleAddChecklistItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(task.deadline).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
              {task.timeEstimate && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time Estimate</p>
                    <p className="text-sm text-muted-foreground">
                      {task.timeEstimate}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {task.cvPortfolioTip && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" /> CV/Portfolio Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {task.cvPortfolioTip}
                </p>
              </CardContent>
            </Card>
          )}

          {task.toolsAndLinks && task.toolsAndLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tools & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {task.toolsAndLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {link.name}
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button onClick={handleSaveNotes} size="sm">
                Save Notes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline flex-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {link.name}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="space-y-2">
                <Input
                  placeholder="Link name"
                  value={newLink.name}
                  onChange={(e) =>
                    setNewLink({ ...newLink, name: e.target.value })
                  }
                />
                <Input
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                />
                <Button onClick={handleAddLink} size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.evidence.map((ev, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="text-sm truncate">{ev.fileName}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveEvidence(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-accent transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Upload Evidence</span>
                  </div>
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
