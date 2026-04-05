import { getDashboardStats } from "@/actions/dashboard.actions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRIORITY_COLORS, STATUS_LABELS, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your projects and tasks</p>
      </div>

      <StatsCards
        totalProjects={stats.totalProjects}
        totalTasks={stats.totalTasks}
        completedThisWeek={stats.completedThisWeek}
        overdueTasks={stats.overdueTasks}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentTasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No tasks yet. Create a project to get started!</p>
          ) : (
            <div className="divide-y">
              {stats.recentTasks.map((task: any) => (
                <div key={task.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.project.color }} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-400">{task.project.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`text-[10px] ${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]}`}>
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {STATUS_LABELS[task.status as keyof typeof STATUS_LABELS]}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-400">{formatDate(task.dueDate)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
