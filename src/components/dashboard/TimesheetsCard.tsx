
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Timesheet } from "@/types/dashboard";

interface TimesheetsCardProps {
  timesheets: Timesheet[];
  userRole: "nurse" | "client";
}

export default function TimesheetsCard({ timesheets, userRole }: TimesheetsCardProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-nurse-dark" />
          {userRole === 'nurse' ? 'Your Timesheets' : 'Timesheets to Approve'}
        </CardTitle>
        <CardDescription>
          {userRole === 'nurse' 
            ? 'Submit and track your working hours' 
            : 'Review and approve nurse working hours'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userRole === 'nurse' && (
          <div className="mb-6">
            <Button className="bg-nurse-dark hover:bg-primary-700">
              Submit New Timesheet
            </Button>
          </div>
        )}
        
        {timesheets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>{userRole === 'nurse' ? 'Client' : 'Nurse'}</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet.id}>
                  <TableCell>{new Date(timesheet.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {userRole === 'nurse' ? timesheet.clientName : timesheet.nurseName}
                  </TableCell>
                  <TableCell>{timesheet.totalHours}</TableCell>
                  <TableCell>
                    <Badge className={`
                      ${timesheet.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        timesheet.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}
                    `}>
                      {timesheet.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {userRole === 'client' && timesheet.status === 'Pending' && (
                      <Button size="sm" className="bg-nurse-dark hover:bg-primary-700">
                        Approve & Pay
                      </Button>
                    )}
                    {userRole === 'nurse' && timesheet.status === 'Pending' && (
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    )}
                    {timesheet.status === 'Paid' && (
                      <Button size="sm" variant="outline">
                        View Receipt
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No timesheets found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}