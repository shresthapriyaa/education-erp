import { Card, CardContent } from "@/core/components/ui/card";
import { Settings } from "lucide-react";

export default function ParentSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings.</p>
      </div>
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          <Settings className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Settings page coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
