
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, FileText } from "lucide-react";
import { UserProfile, UserRole } from "@/types/dashboard";

interface AccountSettingsProps {
  profile: UserProfile;
  userRole: UserRole | null;
}

export default function AccountSettings({ profile, userRole }: AccountSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2 text-nurse-dark" />
          Account Settings
        </CardTitle>
        <CardDescription>Manage your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
            <p className="font-medium">
              {profile.first_name} {profile.last_name}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
            <p className="font-medium">{profile.email}</p>
          </div>
          
          {userRole === 'nurse' && (
            <div className="col-span-1 md:col-span-2 mt-4">
              <Separator className="mb-4" />
              <h3 className="font-medium mb-2">RN License</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-2">Upload your RN license for verification</p>
                <Button variant="outline">Upload License</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
