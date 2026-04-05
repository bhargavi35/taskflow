"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createProject } from "@/actions/project.actions";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
];

export function ProjectForm() {
  const [state, action, pending] = useActionState(createProject, null);

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name *</Label>
        <Input id="name" name="name" placeholder="e.g., Website Redesign" required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="What is this project about?" rows={3} />
      </div>
      <div>
        <Label>Color</Label>
        <div className="flex gap-2 mt-1">
          {COLORS.map((c) => (
            <label key={c} className="cursor-pointer">
              <input type="radio" name="color" value={c} defaultChecked={c === "#6366f1"} className="sr-only peer" />
              <div
                className="h-8 w-8 rounded-full border-2 border-transparent peer-checked:border-gray-900 peer-checked:ring-2 peer-checked:ring-offset-2 transition-all"
                style={{ backgroundColor: c }}
              />
            </label>
          ))}
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full bg-indigo-600 hover:bg-indigo-700">
        {pending ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
