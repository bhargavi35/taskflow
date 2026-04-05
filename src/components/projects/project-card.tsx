import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Users, ListChecks } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ProjectWithCounts } from "@/types";

export function ProjectCard({ project }: { project: ProjectWithCounts }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: project.color + "20" }}
              >
                <FolderKanban className="h-5 w-5" style={{ color: project.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-gray-400">by {project.owner.name}</p>
              </div>
            </div>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <ListChecks className="h-3.5 w-3.5" /> {project._count.tasks} tasks
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {project._count.members} members
            </span>
            <span className="ml-auto">{formatDate(project.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
