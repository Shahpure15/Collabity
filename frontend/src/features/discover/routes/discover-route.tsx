import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/auth-context";
import { 
  getAllUsers, 
  searchUsers, 
  getUsersByAvailability,
  getUsersByCollege 
} from "@/lib/user-service";

export function DiscoverRoute() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "college" | "available">("all");

  // Fetch users based on filter type
  const { data: users, isLoading } = useQuery({
    queryKey: ["users", filterType, searchTerm, userProfile?.college],
    queryFn: async () => {
      if (searchTerm) {
        return await searchUsers(searchTerm);
      }
      
      switch (filterType) {
        case "college":
          return userProfile?.college 
            ? await getUsersByCollege(userProfile.college) 
            : await getAllUsers();
        case "available":
          return await getUsersByAvailability("open");
        default:
          return await getAllUsers();
      }
    },
    enabled: !!user,
  });

  if (!user) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur dark:bg-slate-950/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Discover Students</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <Card className="mb-6 p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All
            </Button>
            {userProfile?.college && (
              <Button
                variant={filterType === "college" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("college")}
              >
                My College
              </Button>
            )}
            <Button
              variant={filterType === "available" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("available")}
            >
              Available
            </Button>
          </div>
        </Card>

        {/* User Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users && users.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users
              .filter((u) => u.id !== user.uid) // Don't show current user
              .map((student) => (
                <Card key={student.id} className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20">
                        <img src={student.avatar} alt={student.name} />
                      </Avatar>
                      <h3 className="mt-3 font-semibold">{student.name}</h3>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                      {student.college && (
                        <p className="mt-1 text-xs font-medium text-primary">
                          {student.college}
                        </p>
                      )}
                      {student.headline && (
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                          {student.headline}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap justify-center gap-1">
                        <Badge variant="outline" className="text-xs">
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
                      <Button className="mt-4 w-full" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No students found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
