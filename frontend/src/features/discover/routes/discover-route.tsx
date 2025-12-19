import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Users, Loader2 } from "lucide-react";

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
  getUsersByCollege,
  connectWithUser,
  getConnectionsForUser,
} from "@/lib/user-service";

export function DiscoverRoute() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "college" | "available">("all");

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

  const { data: connectedUserIds = [], isLoading: connectionsLoading } = useQuery({
    queryKey: ["connections", user?.uid],
    queryFn: async () => {
      if (!user) return [] as string[];
      return await getConnectionsForUser(user.uid);
    },
    enabled: !!user,
  });

  const connectionSet = new Set(connectedUserIds);

  const connectMutation = useMutation({
    mutationFn: async (targetUid: string) => {
      if (!user) throw new Error("You must be authenticated to connect.");
      await connectWithUser(user.uid, targetUid);
      return targetUid;
    },
    onSuccess: (_data, targetUid) => {
      queryClient.invalidateQueries({ queryKey: ["connections", user?.uid] });
      console.info(`Connected with ${targetUid}`);
    },
    onError: (error) => {
      console.error("Unable to connect:", error);
    },
  });

  if (!user) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-20 lg:pb-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-white/90 via-sky-100/40 to-transparent blur-2xl dark:from-slate-950/90 dark:via-slate-900/70" />

      <main className="relative container mx-auto px-4 pb-16 pt-12 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-semibold break-words">Discover Students</h1>
              <p className="text-sm text-muted-foreground break-words">
                Search for students by college, availability, and skills.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="hidden md:inline-flex"
          >
            Back to dashboard
          </Button>
        </div>

  <Card className="mb-8 border border-border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
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
          </div>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users && users.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users
              .filter((u) => u.id !== user.uid)
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
                      <ConnectButton
                        isConnected={connectionSet.has(student.id)}
                        isProcessing={
                          connectMutation.isPending &&
                          connectMutation.variables === student.id
                        }
                        isDisabled={connectionsLoading}
                        onConnect={() => {
                          if (!connectionSet.has(student.id)) {
                            connectMutation.mutate(student.id);
                          }
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ) : (
          <Card className="border border-border bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No students found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}

function ConnectButton({
  isConnected,
  isProcessing,
  isDisabled,
  onConnect,
}: {
  isConnected: boolean;
  isProcessing: boolean;
  isDisabled?: boolean;
  onConnect: () => void;
}) {
  const label = isConnected ? "Connected" : isProcessing ? "Connecting..." : "Connect";

  return (
    <Button
      className="mt-4 w-full"
      size="sm"
      variant={isConnected ? "secondary" : "default"}
      disabled={isConnected || isProcessing || isDisabled}
      onClick={onConnect}
    >
      {label}
    </Button>
  );
}
