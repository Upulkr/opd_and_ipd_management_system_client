"use client";

import * as React from "react";
import {
  Activity,
  Calendar,
  ClipboardList,
  Clock,
  Heart,
  LineChart,
  Stethoscope,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SidebarInset } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SidebarInset className="bg-background">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-xl font-semibold">Healthcare Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/sign-up">
              <Button variant="outline">Sign Up</Button>
            </Link>

            <Link to="/log-in">
              <Button>Login</Button>
            </Link>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Patients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,853</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Outpatients Today
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">
                  +4 since yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inpatients
                </CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">129</div>
                <p className="text-xs text-muted-foreground">
                  86% occupancy rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Disease Predictions
                </CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  98% accuracy rate
                </p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="outpatients">Outpatients</TabsTrigger>
              <TabsTrigger value="inpatients">Inpatients</TabsTrigger>
              <TabsTrigger value="predictions">Disease Prediction</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Patient Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                      <Activity className="h-24 w-24 text-muted-foreground/50" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>
                      You have 12 appointments today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            John Doe
                          </p>
                          <p className="text-sm text-muted-foreground">
                            General Checkup
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>09:30 AM</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Alice Smith
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Cardiology
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>10:15 AM</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>RJ</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Robert Johnson
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Orthopedics
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>11:00 AM</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Bed Occupancy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">86%</div>
                      <div className="text-sm text-muted-foreground">
                        129/150 beds
                      </div>
                    </div>
                    <Progress value={86} className="mt-2" />
                    <div className="mt-3 grid grid-cols-3 text-center text-sm">
                      <div>
                        <div className="font-medium">ICU</div>
                        <div className="text-muted-foreground">92%</div>
                      </div>
                      <div>
                        <div className="font-medium">General</div>
                        <div className="text-muted-foreground">84%</div>
                      </div>
                      <div>
                        <div className="font-medium">Pediatric</div>
                        <div className="text-muted-foreground">78%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Disease Prediction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-rose-500" />
                          <span className="text-sm font-medium">
                            Cardiovascular
                          </span>
                        </div>
                        <span className="text-sm">32%</span>
                      </div>
                      <Progress value={32} className="h-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">
                            Respiratory
                          </span>
                        </div>
                        <span className="text-sm">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Diabetes</span>
                        </div>
                        <span className="text-sm">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Predictions
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Staff Meeting</p>
                          <p className="text-xs text-muted-foreground">
                            09:00 AM - 10:00 AM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Patient Rounds</p>
                          <p className="text-xs text-muted-foreground">
                            11:00 AM - 12:30 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <ClipboardList className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Case Review</p>
                          <p className="text-xs text-muted-foreground">
                            02:00 PM - 03:30 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Full Schedule
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="outpatients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Outpatient Management</CardTitle>
                  <CardDescription>
                    Manage outpatient appointments and records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Outpatient management content will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inpatients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inpatient Management</CardTitle>
                  <CardDescription>
                    Manage inpatient admissions and care
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Inpatient management content will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="predictions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Disease Prediction</CardTitle>
                  <CardDescription>
                    AI-powered disease prediction and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Disease prediction tools will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarInset>
  );
}
