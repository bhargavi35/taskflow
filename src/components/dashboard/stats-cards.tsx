import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, ListChecks, CheckCircle2, AlertTriangle } from "lucide-react";

interface Props {
  totalProjects: number;
  totalTasks: number;
  completedThisWeek: number;
  overdueTasks: number;
}

const stats = [
  { key: "totalProjects", label: "Total Projects", icon: FolderKanban, color: "text-indigo-600", bg: "bg-indigo-50" },
  { key: "totalTasks", label: "Total Tasks", icon: ListChecks, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "completedThisWeek", label: "Completed This Week", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  { key: "overdueTasks", label: "Overdue", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
] as const;

export function StatsCards(data: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.key}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data[s.key]}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
