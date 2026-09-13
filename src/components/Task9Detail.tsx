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
import { Task9Progress } from "./Task9Progress";
import { useTask9 } from "@/lib/useTask9";
import { PartnerEntry } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Lightbulb,
  Plus,
  Trash2,
  Mail,
  Pencil,
  Globe,
} from "lucide-react";
import Link from "next/link";

export function Task9Detail() {
  const {
    task,
    loaded,
    updateStatus,
    toggleChecklistItem,
    addNote,
    addPartner,
    updatePartner,
    removePartner,
    setDeadline,
    completedCount,
    totalCount,
    percentage,
    totalPartners,
    subscribedCount,
    subscriptionRate,
  } = useTask9();

  const [newNote, setNewNote] = React.useState(task.notes);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = React.useState(false);
  const [editingPartner, setEditingPartner] = React.useState<PartnerEntry | null>(null);
  const [partnerForm, setPartnerForm] = React.useState({
    name: "",
    organization: "",
    program: "",
    website: "",
    newsletterSubscribed: false,
    subscriptionDate: "",
    keyTopics: "",
    notes: "",
    status: "researching" as PartnerEntry["status"],
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

  const resetPartnerForm = () => {
    setPartnerForm({
      name: "",
      organization: "",
      program: "",
      website: "",
      newsletterSubscribed: false,
      subscriptionDate: "",
      keyTopics: "",
      notes: "",
      status: "researching",
    });
    setEditingPartner(null);
  };

  const handleAddPartner = () => {
    if (partnerForm.name) {
      addPartner(partnerForm);
      resetPartnerForm();
      setIsAddPartnerOpen(false);
    }
  };

  const handleEditPartner = (partner: PartnerEntry) => {
    setEditingPartner(partner);
    setPartnerForm({
      name: partner.name,
      organization: partner.organization,
      program: partner.program,
      website: partner.website,
      newsletterSubscribed: partner.newsletterSubscribed,
      subscriptionDate: partner.subscriptionDate,
      keyTopics: partner.keyTopics,
      notes: partner.notes,
      status: partner.status,
    });
    setIsAddPartnerOpen(true);
  };

  const handleUpdatePartner = () => {
    if (editingPartner) {
      updatePartner(editingPartner.id, partnerForm);
      resetPartnerForm();
      setIsAddPartnerOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetPartnerForm();
    setIsAddPartnerOpen(false);
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

  const partnerStatusVariant = {
    researching: "secondary" as const,
    subscribed: "success" as const,
    "not-subscribed": "destructive" as const,
  };

  const partnerStatusLabel = {
    researching: "Researching",
    subscribed: "Subscribed",
    "not-subscribed": "Not Subscribed",
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
                <Task9Progress
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
                <Mail className="h-5 w-5" /> Partner Tracker
              </CardTitle>
              <Dialog open={isAddPartnerOpen} onOpenChange={setIsAddPartnerOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetPartnerForm}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPartner ? "Edit Partner" : "Add Partner"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPartner
                        ? "Update the partner entry."
                        : "Track a new associated partner."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={partnerForm.name}
                        onChange={(e) =>
                          setPartnerForm({ ...partnerForm, name: e.target.value })
                        }
                        placeholder="e.g., WWF, UNESCO"
                      />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input
                        value={partnerForm.organization}
                        onChange={(e) =>
                          setPartnerForm({ ...partnerForm, organization: e.target.value })
                        }
                        placeholder="e.g., World Wide Fund for Nature"
                      />
                    </div>
                    <div>
                      <Label>Program</Label>
                      <Input
                        value={partnerForm.program}
                        onChange={(e) =>
                          setPartnerForm({ ...partnerForm, program: e.target.value })
                        }
                        placeholder="e.g., Blue Carbon Science and Policy"
                      />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={partnerForm.website}
                        onChange={(e) =>
                          setPartnerForm({ ...partnerForm, website: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Subscription Date</Label>
                        <Input
                          type="date"
                          value={partnerForm.subscriptionDate}
                          onChange={(e) =>
                            setPartnerForm({ ...partnerForm, subscriptionDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={partnerForm.status}
                          onValueChange={(v) =>
                            setPartnerForm({ ...partnerForm, status: v as PartnerEntry["status"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="researching">Researching</SelectItem>
                            <SelectItem value="subscribed">Subscribed</SelectItem>
                            <SelectItem value="not-subscribed">Not Subscribed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={partnerForm.newsletterSubscribed}
                        onCheckedChange={(checked) =>
                          setPartnerForm({ ...partnerForm, newsletterSubscribed: checked === true })
                        }
                      />
                      <Label>Newsletter Subscribed</Label>
                    </div>
                    <div>
                      <Label>Key Topics</Label>
                      <Input
                        value={partnerForm.keyTopics}
                        onChange={(e) =>
                          setPartnerForm({ ...partnerForm, keyTopics: e.target.value })
                        }
                        placeholder="e.g., Blue carbon, climate policy"
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={partnerForm.notes}
                        onChange={(e) =>
                          setPartnerForm({ ...partnerForm, notes: e.target.value })
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
                    <Button onClick={editingPartner ? handleUpdatePartner : handleAddPartner}>
                      {editingPartner ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.partners.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No partners tracked yet. Add your first one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {task.partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{partner.name}</p>
                            <Badge variant={partnerStatusVariant[partner.status]}>
                              {partnerStatusLabel[partner.status]}
                            </Badge>
                            {partner.newsletterSubscribed && (
                              <Badge variant="outline">Subscribed</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {partner.organization} · {partner.program}
                          </p>
                          {partner.keyTopics && (
                            <p className="text-sm text-muted-foreground mt-1">Topics: {partner.keyTopics}</p>
                          )}
                          {partner.subscriptionDate && (
                            <p className="text-sm text-muted-foreground">
                              Subscribed: {new Date(partner.subscriptionDate).toLocaleDateString()}
                            </p>
                          )}
                          {partner.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{partner.notes}</p>
                          )}
                          {partner.website && (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                            >
                              <Globe className="h-3 w-3" />
                              {partner.website}
                            </a>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditPartner(partner)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removePartner(partner.id)}
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
                <Mail className="h-5 w-5" /> Subscription Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Partners</span>
                </div>
                <span className="text-2xl font-bold">{totalPartners}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Subscribed</span>
                </div>
                <span className="text-2xl font-bold">{subscribedCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Subscription Rate</span>
                </div>
                <span className="text-2xl font-bold">{subscriptionRate}%</span>
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
