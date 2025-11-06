import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/auth-context";
import { getUsersByAvailability } from "@/lib/user-service";

export function StudentsRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: availableStudents, isLoading } = useQuery({
    queryKey: ["available-students"],
    queryFn: () => getUsersByAvailability("open"),
    enabled: !!user,
  });

  if (!user) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 lg:pb-0">
      <main className="container mx-auto px-4 pb-8 pt-8 sm:px-6 lg:pb-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-semibold break-words">Available Students</h1>
              <p className="text-sm text-muted-foreground break-words">
                Students who are currently open to collaborate and connect.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : availableStudents && availableStudents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {availableStudents
              .filter((student) => student.id !== user.uid)
              .map((student) => (
                <Card
                  key={student.id}
                  className="group overflow-hidden border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 flex-shrink-0">
                        <img src={student.avatar} alt={student.name} />
                      </Avatar>
                      <h3 className="mt-3 font-semibold break-words w-full">{student.name}</h3>
                      <p className="text-xs text-muted-foreground break-all w-full">{student.email}</p>
                      {student.college && (
                        <p className="mt-1 text-xs font-medium text-primary break-words w-full">{student.college}</p>
                      )}
                      {student.headline && (
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground break-words w-full">
                          {student.headline}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap justify-center gap-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {student.availability}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ⭐ {student.reputation}
                        </Badge>
                      </div>
                      {student.skills && student.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1">
                          {student.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="glass" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {student.skills.length > 3 && (
                            <Badge variant="glass" className="text-xs">
                              +{student.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      <Button
                        className="mt-4 w-full"
                        size="sm"
                        onClick={() => navigate(`/profile/${student.id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ) : (
          <Card className="border border-border bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No available students</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No students have marked themselves as available at the moment.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
