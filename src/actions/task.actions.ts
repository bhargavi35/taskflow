"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";
import { revalidatePath } from "next/cache";

export async function createTask(_prev: any, formData: FormData) {
  const user = await requireAuth();
  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    status: (formData.get("status") as string) || "TODO",
    priority: (formData.get("priority") as string) || "MEDIUM",
    dueDate: (formData.get("dueDate") as string) || null,
    assigneeId: (formData.get("assigneeId") as string) || null,
    projectId: formData.get("projectId") as string,
  };

  const parsed = createTaskSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const membership = await prisma.projectMember.findFirst({
    where: { userId: user.id, projectId: parsed.data.projectId },
  });
  if (!membership) return { error: "Not a member of this project" };

  const maxPos = await prisma.task.aggregate({
    where: { projectId: parsed.data.projectId, status: parsed.data.status as any },
    _max: { position: true },
  });

  await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status as any,
      priority: parsed.data.priority as any,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      assigneeId: parsed.data.assigneeId || null,
      projectId: parsed.data.projectId,
      creatorId: user.id,
      position: (maxPos._max.position ?? 0) + 1000,
    },
  });

  revalidatePath(`/projects/${parsed.data.projectId}`);
  return { success: true };
}

export async function getTasksByProject(projectId: string) {
  await requireAuth();
  return prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: { select: { id: true, name: true, image: true } },
      creator: { select: { id: true, name: true } },
    },
    orderBy: { position: "asc" },
  });
}

export async function updateTask(id: string, data: Record<string, any>) {
  const user = await requireAuth();

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });
  if (!task) return { error: "Task not found" };

  const isMember = task.project.members.some((m) => m.userId === user.id);
  if (!isMember) return { error: "Not authorized" };

  const parsed = updateTaskSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.task.update({
    where: { id },
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
    },
  });

  revalidatePath(`/projects/${task.projectId}`);
  return { success: true };
}

export async function moveTask(id: string, status: string, position: number) {
  const user = await requireAuth();

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });
  if (!task) return { error: "Task not found" };

  const isMember = task.project.members.some((m) => m.userId === user.id);
  if (!isMember) return { error: "Not authorized" };

  await prisma.task.update({
    where: { id },
    data: { status: status as any, position },
  });

  revalidatePath(`/projects/${task.projectId}`);
  return { success: true };
}

export async function deleteTask(id: string) {
  const user = await requireAuth();

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });
  if (!task) return { error: "Task not found" };

  const isMember = task.project.members.some((m) => m.userId === user.id);
  if (!isMember) return { error: "Not authorized" };

  await prisma.task.delete({ where: { id } });
  revalidatePath(`/projects/${task.projectId}`);
  return { success: true };
}
