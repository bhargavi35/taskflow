"use client";

import { useState, useOptimistic, startTransition } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./task-card";
import { TaskFormDialog } from "./task-form";
import { moveTask } from "@/actions/task.actions";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";
import type { TaskWithRelations, TaskStatus } from "@/types";

const COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

interface Props {
  tasks: TaskWithRelations[];
  projectId: string;
  members: { id: string; name: string }[];
}

export function KanbanBoard({ tasks: initialTasks, projectId, members }: Props) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<TaskWithRelations | null>(null);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TaskStatus;
    const newPosition = destination.index * 1000;

    startTransition(() => {
      setOptimisticTasks((prev) =>
        prev.map((t) =>
          t.id === draggableId ? { ...t, status: newStatus, position: newPosition } : t
        )
      );
    });

    await moveTask(draggableId, newStatus, newPosition);
  };

  const handleAddTask = () => {
    setEditTask(null);
    setShowForm(true);
  };

  const tasksByStatus = COLUMNS.reduce((acc, status) => {
    acc[status] = optimisticTasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.position - b.position);
    return acc;
  }, {} as Record<TaskStatus, TaskWithRelations[]>);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]">
          {COLUMNS.map((status) => (
            <div key={status} className="flex-shrink-0 w-72">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[status]}`} />
                  <h3 className="text-sm font-semibold text-gray-700">{STATUS_LABELS[status]}</h3>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {tasksByStatus[status].length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAddTask()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[200px] p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? "bg-indigo-50" : "bg-gray-50"
                    }`}
                  >
                    {tasksByStatus[status].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            style={prov.draggableProps.style}
                            className={snap.isDragging ? "opacity-80 rotate-2" : ""}
                          >
                            <TaskCard
                              task={task}
                              onEdit={(t) => { setEditTask(t); setShowForm(true); }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {tasksByStatus[status].length === 0 && !snapshot.isDraggingOver && (
                      <p className="text-xs text-gray-400 text-center py-8">No tasks</p>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskFormDialog
        projectId={projectId}
        members={members}
        open={showForm}
        onClose={() => { setShowForm(false); setEditTask(null); }}
        editTask={editTask}
      />
    </>
  );
}
