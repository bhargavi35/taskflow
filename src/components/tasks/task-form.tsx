"use client";

import { useActionState, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createTask, updateTask } from "@/actions/task.actions";
import type { TaskWithRelations } from "@/types";

interface TaskFormProps {
  projectId: string;
  members: { id: string; name: string }[];
  open: boolean;
  onClose: () => void;
  editTask?: TaskWithRelations | null;
}

export function TaskFormDialog({ projectId, members, open, onClose, editTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("unassigned");

  useEffect(() => {
    if (open) {
      setTitle(editTask?.title || "");
      setDescription(editTask?.description || "");
      setPriority(editTask?.priority || "MEDIUM");
      setStatus(editTask?.status || "TODO");
      setDueDate(editTask?.dueDate ? new Date(editTask.dueDate).toISOString().split("T")[0] : "");
      setAssigneeId(editTask?.assigneeId || "unassigned");
    }
  }, [open, editTask]);

  const handleCreate = async (_prev: any, formData: FormData) => {
    formData.set("projectId", projectId);
    formData.set("title", title);
    formData.set("description", description);
    formData.set("priority", priority);
    formData.set("status", status);
    formData.set("dueDate", dueDate);
    formData.set("assigneeId", assigneeId === "unassigned" ? "" : assigneeId);
    const result = await createTask(_prev, formData);
    if (result?.success) onClose();
    return result;
  };

  const handleUpdate = async (_prev: any, _formData: FormData) => {
    if (!editTask) return;
    const result = await updateTask(editTask.id, {
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      assigneeId: assigneeId === "unassigned" ? null : assigneeId,
    });
    if (result?.success) onClose();
    return result;
  };

  const [state, action, pending] = useActionState(editTask ? handleUpdate : handleCreate, null);

  const assigneeName = assigneeId !== "unassigned"
    ? members.find((m) => m.id === assigneeId)?.name || "Unassigned"
    : "Unassigned";

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the task..." rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => v && setPriority(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="IN_REVIEW">In Review</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <Label>Assignee</Label>
              <Select value={assigneeId} onValueChange={(v) => v && setAssigneeId(v)}>
                <SelectTrigger>
                  <SelectValue>{assigneeName}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={pending} className="bg-indigo-600 hover:bg-indigo-700">
              {pending ? "Saving..." : editTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
