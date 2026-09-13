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
import { Task2Progress } from "./Task2Progress";
import { useTask2 } from "@/lib/useTask2";
import { Publication } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Lightbulb,
  Plus,
  Trash2,
  BookOpen,
  Pencil,
} from "lucide-react";
import Link from "next/link";

export function Task2Detail() {
  const {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addPublication,
    updatePublication,
    removePublication,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
  } = useTask2();

  const [newNote, setNewNote] = React.useState(task.notes);
  const [isAddPubOpen, setIsAddPubOpen] = React.useState(false);
  const [editingPub, setEditingPub] = React.useState<Publication | null>(null);
  const [pubForm, setPubForm] = React.useState({
    title: "",
    platform: "LinkedIn",
    url: "",
    date: "",
    status: "draft" as Publication["status"],
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

  const resetPubForm = () => {
    setPubForm({ title: "", platform: "LinkedIn", url: "", date: "", status: "draft" });
    setEditingPub(null);
  };

  const handleAddPub = () => {
    if (pubForm.title) {
      addPublication(pubForm);
      resetPubForm();
      setIsAddPubOpen(false);
    }
  };

  const handleEditPub = (pub: Publication) => {
    setEditingPub(pub);
    setPubForm({
      title: pub.title,
      platform: pub.platform,
      url: pub.url,
      date: pub.date,
      status: pub.status,
    });
    setIsAddPubOpen(true);
  };

  const handleUpdatePub = () => {
    if (editingPub) {
      updatePublication(editingPub.id, pubForm);
      resetPubForm();
      setIsAddPubOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetPubForm();
    setIsAddPubOpen(false);
  };

  const statusVariant = {
    draft: "outline" as const,
    submitted: "info" as const,
    published: "success" as const,
  };

  const statusLabel = {
    draft: "Draft",
    submitted: "Submitted",
    published: "Published",
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
            <Badge
              variant={
                task.status === "done"
                  ? "success"
                  : task.status === "in-progress"
                  ? "info"
                  : "warning"
              }
            >
              {task.status === "not-started"
                ? "Not Started"
                : task.status === "in-progress"
                ? "In Progress"
                : "Done"}
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
                <Task2Progress
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
                <BookOpen className="h-5 w-5" /> Publications
              </CardTitle>
              <Dialog open={isAddPubOpen} onOpenChange={setIsAddPubOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetPubForm}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingPub ? "Edit Publication" : "Add Publication"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPub
                        ? "Update the publication details."
                        : "Add a new article or publication."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={pubForm.title}
                        onChange={(e) =>
                          setPubForm({ ...pubForm, title: e.target.value })
                        }
                        placeholder="Article title"
                      />
                    </div>
                    <div>
                      <Label>Platform</Label>
                      <Select
                        value={pubForm.platform}
                        onValueChange={(v) =>
                          setPubForm({ ...pubForm, platform: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="University Blog">University Blog</SelectItem>
                          <SelectItem value="NGO Website">NGO Website</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={pubForm.url}
                        onChange={(e) =>
                          setPubForm({ ...pubForm, url: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={pubForm.date}
                        onChange={(e) =>
                          setPubForm({ ...pubForm, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={pubForm.status}
                        onValueChange={(v) =>
                          setPubForm({ ...pubForm, status: v as Publication["status"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={editingPub ? handleUpdatePub : handleAddPub}>
                      {editingPub ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.publications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No publications yet. Add your first article above.
                </p>
              ) : (
                task.publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{pub.title}</p>
                          <Badge variant={statusVariant[pub.status]}>
                            {statusLabel[pub.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pub.platform}
                          {pub.date && ` · ${new Date(pub.date).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditPub(pub)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removePublication(pub.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {pub.url}
                      </a>
                    )}
                  </div>
                ))
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
