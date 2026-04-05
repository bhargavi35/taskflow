export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Role = "OWNER" | "MEMBER";

export interface TaskWithRelations {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date | null;
  position: number;
  projectId: string;
  creatorId: string;
  assigneeId: string | null;
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignee: { id: string; name: string; image: string | null } | null;
  creator: { id: string; name: string };
}

export interface ProjectWithCounts {
  id: string;
  name: string;
  description: string | null;
  color: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  _count: { tasks: number; members: number };
  owner: { name: string };
}

export interface ActionResult {
  success: boolean;
  error?: string;
}
