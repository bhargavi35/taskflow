import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{session?.user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{session?.user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
