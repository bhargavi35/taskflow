"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { createProjectSchema, updateProjectSchema } from "@/lib/validations/project";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(_prev: any, formData: FormData) {
  const user = await requireAuth();
  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    color: (formData.get("color") as string) || "#6366f1",
  };

  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      ownerId: user.id,
      members: { create: { userId: user.id, role: "OWNER" } },
    },
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function getProjects(search?: string) {
  const user = await requireAuth();
  return prisma.project.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
      ],
      ...(search ? { name: { contains: search } } : {}),
    },
    include: {
      owner: { select: { name: true } },
      _count: { select: { tasks: true, members: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProject(id: string) {
  const user = await requireAuth();
  const project = await prisma.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    },
    include: {
      owner: { select: { id: true, name: true } },
      members: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
      _count: { select: { tasks: true } },
    },
  });
  return project;
}

export async function updateProject(id: string, _prev: any, formData: FormData) {
  const user = await requireAuth();
  const project = await prisma.project.findFirst({ where: { id, ownerId: user.id } });
  if (!project) return { error: "Project not found or unauthorized" };

  const raw = {
    name: (formData.get("name") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    color: (formData.get("color") as string) || undefined,
  };

  const parsed = updateProjectSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.project.update({ where: { id }, data: parsed.data });
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

export async function deleteProject(id: string) {
  const user = await requireAuth();
  const project = await prisma.project.findFirst({ where: { id, ownerId: user.id } });
  if (!project) return { error: "Not authorized" };

  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
  redirect("/projects");
}
