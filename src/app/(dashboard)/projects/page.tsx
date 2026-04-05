import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProjects } from "@/actions/project.actions";
import { ProjectCard } from "@/components/projects/project-card";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const projects = await getProjects(q);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">{projects.length} project(s)</p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" /> New Project
          </Button>
        </Link>
      </div>

      <form className="max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input name="q" defaultValue={q} placeholder="Search projects..." className="pl-9" />
        </div>
      </form>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No projects yet</p>
          <Link href="/projects/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Create your first project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
