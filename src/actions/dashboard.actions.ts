"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { subDays } from "date-fns";

export async function getDashboardStats() {
  const user = await requireAuth();

  const [totalProjects, totalTasks, completedThisWeek, overdueTasks, recentTasks] =
    await Promise.all([
      prisma.project.count({
        where: { OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] },
      }),
      prisma.task.count({
        where: { project: { OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] } },
      }),
      prisma.task.count({
        where: {
          status: "DONE",
          updatedAt: { gte: subDays(new Date(), 7) },
          project: { OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] },
        },
      }),
      prisma.task.count({
        where: {
          dueDate: { lt: new Date() },
          status: { not: "DONE" },
          project: { OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] },
        },
      }),
      prisma.task.findMany({
        where: { project: { OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] } },
        include: {
          project: { select: { name: true, color: true } },
          assignee: { select: { name: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 8,
      }),
    ]);

  return { totalProjects, totalTasks, completedThisWeek, overdueTasks, recentTasks };
}
