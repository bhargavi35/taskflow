import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <Link href="/projects">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm />
        </CardContent>
      </Card>
    </div>
  );
}
