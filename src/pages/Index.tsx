import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GraduationCap, Shield, Search, Upload, Plus, Trash2, Users, User, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLogin from '@/components/AdminLogin';

// Mock student data
const mockStudents = [
  {
    rollNumber: "CS2021001",
    fullName: "Alice Johnson",
    marks: 92,
    backlogs: 0,
    attendance: 95,
    semester: "6th",
    branch: "Computer Science"
  },
  {
    rollNumber: "CS2021002", 
    fullName: "Bob Smith",
    marks: 78,
    backlogs: 1,
    attendance: 82,
    semester: "6th",
    branch: "Computer Science"
  },
  {
    rollNumber: "EE2021001",
    fullName: "Carol Davis",
    marks: 85,
    backlogs: 0,
    attendance: 90,
    semester: "6th", 
    branch: "Electrical Engineering"
  },
  {
    rollNumber: "ME2021001",
    fullName: "David Wilson",
    marks: 65,
    backlogs: 2,
    attendance: 75,
    semester: "6th",
    branch: "Mechanical Engineering"
  }
];

const IndexContent = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [students, setStudents] = useState(mockStudents);
  const [newStudent, setNewStudent] = useState({
    rollNumber: '',
    fullName: '',
    marks: '',
    backlogs: '',
    attendance: '',
    semester: '',
    branch: ''
  });
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { toast } = useToast();
  const { adminUser, logout } = useAdminAuth();

  const handleSearch = () => {
    const student = students.find(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());
    if (student) {
      setSearchResult(student);
      toast({
        title: "Student Found",
        description: `Details for ${student.fullName} loaded successfully.`,
      });
    } else {
      setSearchResult(null);
      toast({
        title: "Student Not Found",
        description: "No student found with this roll number.",
        variant: "destructive",
      });
    }
  };

  const getPerformanceStatus = (marks, backlogs, attendance) => {
    if (marks >= 85 && backlogs === 0 && attendance >= 90) return { status: 'Excellent', color: 'bg-green-500' };
    if (marks >= 70 && backlogs <= 1 && attendance >= 80) return { status: 'Good', color: 'bg-blue-500' };
    if (marks >= 60 && backlogs <= 2 && attendance >= 70) return { status: 'Average', color: 'bg-yellow-500' };
    return { status: 'Needs Improvement', color: 'bg-red-500' };
  };

  const handleAddStudent = () => {
    if (!adminUser) {
      toast({
        title: "Access Denied",
        description: "Please login as admin to add students.",
        variant: "destructive",
      });
      return;
    }

    if (!newStudent.rollNumber || !newStudent.fullName) {
      toast({
        title: "Error",
        description: "Please fill in at least roll number and full name.",
        variant: "destructive",
      });
      return;
    }

    const studentData = {
      ...newStudent,
      marks: parseInt(newStudent.marks) || 0,
      backlogs: parseInt(newStudent.backlogs) || 0,
      attendance: parseInt(newStudent.attendance) || 0,
    };

    setStudents([...students, studentData]);
    setNewStudent({
      rollNumber: '',
      fullName: '',
      marks: '',
      backlogs: '',
      attendance: '',
      semester: '',
      branch: ''
    });

    toast({
      title: "Student Added",
      description: `${studentData.fullName} has been added successfully.`,
    });
  };

  const handleDeleteStudent = (rollNumber) => {
    if (!adminUser) {
      toast({
        title: "Access Denied",
        description: "Please login as admin to delete students.",
        variant: "destructive",
      });
      return;
    }

    setStudents(students.filter(s => s.rollNumber !== rollNumber));
    toast({
      title: "Student Deleted",
      description: "Student record has been removed.",
    });
  };

  const handleCSVUpload = (event) => {
    if (!adminUser) {
      toast({
        title: "Access Denied",
        description: "Please login as admin to upload CSV files.",
        variant: "destructive",
      });
      event.target.value = '';
      return;
    }

    const file = event.target.files[0];
    if (file) {
      toast({
        title: "CSV Upload",
        description: "CSV file processing would be implemented with Supabase integration.",
      });
    }
  };

  const handleAdminLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Student Management System</h1>
          </div>
          <p className="text-gray-600 text-lg">Manage student records and view academic performance</p>
          
          {/* Admin Status */}
          <div className="flex justify-center mt-4">
            {adminUser ? (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <Shield className="h-4 w-4" />
                <span>Logged in as: {adminUser.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminLogout}
                  className="ml-2 h-6 w-6 p-0 text-green-600 hover:text-green-800"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Admin Authentication</DialogTitle>
                  </DialogHeader>
                  <AdminLogin onClose={() => setIsLoginDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Student Portal
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Panel
            </TabsTrigger>
          </TabsList>

          {/* Student Portal */}
          <TabsContent value="user" className="space-y-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Search className="h-5 w-5" />
                  Student Lookup
                </CardTitle>
                <CardDescription>
                  Enter your roll number to view your academic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Roll Number (e.g., CS2021001)"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} className="px-6">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Student Details Display */}
            {searchResult && (
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Academic Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                        <p className="text-xl font-semibold">{searchResult.fullName}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Roll Number</Label>
                        <p className="text-lg">{searchResult.rollNumber}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Branch</Label>
                        <p className="text-lg">{searchResult.branch}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Semester</Label>
                        <p className="text-lg">{searchResult.semester}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 text-center">
                          <p className="text-2xl font-bold text-blue-600">{searchResult.marks}%</p>
                          <p className="text-sm text-gray-500">Average Marks</p>
                        </Card>
                        
                        <Card className="p-4 text-center">
                          <p className="text-2xl font-bold text-green-600">{searchResult.attendance}%</p>
                          <p className="text-sm text-gray-500">Attendance</p>
                        </Card>
                      </div>

                      <Card className="p-4 text-center">
                        <p className="text-2xl font-bold text-red-600">{searchResult.backlogs}</p>
                        <p className="text-sm text-gray-500">Active Backlogs</p>
                      </Card>

                      <div className="text-center">
                        <Label className="text-sm font-medium text-gray-500">Performance Summary</Label>
                        <div className="mt-2">
                          {(() => {
                            const performance = getPerformanceStatus(searchResult.marks, searchResult.backlogs, searchResult.attendance);
                            return (
                              <Badge className={`${performance.color} text-white px-4 py-2 text-sm`}>
                                {performance.status}
                              </Badge>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Admin Panel */}
          <TabsContent value="admin" className="space-y-8">
            {!adminUser && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-orange-600">
                    <Shield className="h-5 w-5" />
                    Admin Access Required
                  </CardTitle>
                  <CardDescription>
                    Please login as an administrator to access the admin panel and manage student data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Login as Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Admin Authentication</DialogTitle>
                      </DialogHeader>
                      <AdminLogin onClose={() => setIsLoginDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {adminUser && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* CSV Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload Student Data
                      </CardTitle>
                      <CardDescription>
                        Upload a CSV file with student information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={handleCSVUpload}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-gray-500">
                          CSV should include: Roll Number, Full Name, Marks, Backlogs, Attendance, Semester, Branch
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Add New Student */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add New Student
                      </CardTitle>
                      <CardDescription>
                        Manually add a new student record
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Roll Number"
                          value={newStudent.rollNumber}
                          onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
                        />
                        <Input
                          placeholder="Full Name"
                          value={newStudent.fullName}
                          onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
                        />
                        <Input
                          placeholder="Marks"
                          type="number"
                          value={newStudent.marks}
                          onChange={(e) => setNewStudent({...newStudent, marks: e.target.value})}
                        />
                        <Input
                          placeholder="Backlogs"
                          type="number"
                          value={newStudent.backlogs}
                          onChange={(e) => setNewStudent({...newStudent, backlogs: e.target.value})}
                        />
                        <Input
                          placeholder="Attendance %"
                          type="number"
                          value={newStudent.attendance}
                          onChange={(e) => setNewStudent({...newStudent, attendance: e.target.value})}
                        />
                        <Input
                          placeholder="Semester"
                          value={newStudent.semester}
                          onChange={(e) => setNewStudent({...newStudent, semester: e.target.value})}
                        />
                      </div>
                      <Input
                        placeholder="Branch"
                        value={newStudent.branch}
                        onChange={(e) => setNewStudent({...newStudent, branch: e.target.value})}
                      />
                      <Button onClick={handleAddStudent} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Student
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Student Records Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      All Student Records
                    </CardTitle>
                    <CardDescription>
                      Manage existing student data ({students.length} students)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {students.map((student, index) => (
                        <div key={student.rollNumber} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                            <div>
                              <p className="font-semibold">{student.fullName}</p>
                              <p className="text-sm text-gray-500">{student.rollNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Branch</p>
                              <p>{student.branch}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Marks</p>
                              <p className="font-semibold text-blue-600">{student.marks}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Attendance</p>
                              <p className="font-semibold text-green-600">{student.attendance}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Status</p>
                              {(() => {
                                const performance = getPerformanceStatus(student.marks, student.backlogs, student.attendance);
                                return (
                                  <Badge className={`${performance.color} text-white text-xs`}>
                                    {performance.status}
                                  </Badge>
                                );
                              })()}
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteStudent(student.rollNumber)}
                            className="ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AdminAuthProvider>
      <IndexContent />
    </AdminAuthProvider>
  );
};

export default Index;
