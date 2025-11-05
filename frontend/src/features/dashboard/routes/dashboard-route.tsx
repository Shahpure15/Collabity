import { useAuth } from "@/features/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getFirebaseAuth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, Users, Search, Settings } from "lucide-react";

export function DashboardRoute() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      await auth.signOut();
      navigate("/", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Collabity
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24">
                  <img
                    src={userProfile?.avatar || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    alt={userProfile?.name || user.displayName || "User"}
                  />
                </Avatar>
                <h2 className="mt-4 text-2xl font-bold">
                  {userProfile?.name || user.displayName || "Student"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userProfile?.email || user.email}
                </p>
                {userProfile?.college && (
                  <p className="mt-1 text-sm font-medium text-primary">
                    {userProfile.college}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant={userProfile?.availability === "open" ? "default" : "outline"}>
                    {userProfile?.availability || "open"}
                  </Badge>
                  <Badge variant="outline">
                    ⭐ {userProfile?.reputation || 0}
                  </Badge>
                </div>
                {userProfile?.headline && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {userProfile.headline}
                  </p>
                )}
                {userProfile?.skills && userProfile.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {userProfile.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button className="mt-6 w-full" variant="outline">
                  Edit Profile
                </Button>
              </div>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="mb-6 text-xl font-bold">Welcome to Collabity! 🎉</h3>
              <div className="space-y-6">
                <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:from-purple-950/20 dark:to-pink-950/20">
                  <h4 className="font-semibold">Get Started</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Complete your profile to connect with other students, find collaboration opportunities, and build amazing projects together.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Button variant="outline" size="sm">
                      Complete Profile
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate("/discover")}>
                      Discover Students
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Activity</h4>
                  <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                    No activity yet. Start collaborating to see updates here!
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Opportunities</h4>
                  <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                    No opportunities available yet. Check back soon!
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
