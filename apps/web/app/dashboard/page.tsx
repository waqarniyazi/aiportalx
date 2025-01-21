import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <h2 className="text-xl font-semibold">Welcome to your Dashboard</h2>
        </CardHeader>
        <CardContent>
          <p>Here you can view your activities and manage your account.</p>
          <Button className="mt-4" variant="outline">
            Manage Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
