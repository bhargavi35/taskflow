"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Sparkles, Trash2 } from "lucide-react";
import { PRIORITY_COLORS, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { deleteTask } from "@/actions/task.actions";
import type { TaskWithRelations } from "@/types";

export function TaskCard({
  task,
  onEdit,
}: {
  task: TaskWithRelations;
  onEdit?: (task: TaskWithRelations) => void;
}) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this task?")) {
      await deleteTask(task.id);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onEdit?.(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">{task.title}</h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5 text-red-500" />
        </Button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </Badge>
          {task.aiGenerated && (
            <Sparkles className="h-3 w-3 text-amber-500" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.assignee && (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[8px] bg-indigo-100 text-indigo-700">
                {task.assignee.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}
