import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProject } from "@/actions/project.actions";
import { getTasksByProject } from "@/actions/task.actions";
import { KanbanBoard } from "@/components/tasks/kanban-board";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const tasks = await getTasksByProject(projectId);
  const members = project.members.map((m) => ({ id: m.user.id, name: m.user.name }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/projects">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
              {project.name}
            </h1>
            <p className="text-xs text-gray-400">{project._count.tasks} tasks &middot; {project.members.length} members</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-1" /> Settings
        </Button>
      </div>

      <KanbanBoard
        tasks={tasks as any}
        projectId={projectId}
        members={members}
      />
    </div>
  );
}
