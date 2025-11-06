import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Mail, MapPin, Briefcase, Award, Link as LinkIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/auth-context";
import { getUserProfile, connectWithUser, getConnectionsForUser } from "@/lib/user-service";

export function ProfileRoute() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");
      return await getUserProfile(userId);
    },
    enabled: !!userId,
  });

  const { data: connectedUserIds = [] } = useQuery({
    queryKey: ["connections", user?.uid],
    queryFn: async () => {
      if (!user) return [] as string[];
      return await getConnectionsForUser(user.uid);
    },
    enabled: !!user,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!user || !userId) throw new Error("Authentication required");
      await connectWithUser(user.uid, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections", user?.uid] });
    },
    onError: (error) => {
      console.error("Connection failed:", error);
      alert("Unable to connect. Please try again.");
    },
  });

  const isConnected = userId ? connectedUserIds.includes(userId) : false;

  if (!user) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background p-8 text-center">
        <h2 className="text-xl font-semibold">Profile not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const isOwnProfile = user.uid === userId;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 lg:pb-0">
      <main className="container mx-auto max-w-6xl px-4 pb-8 pt-8 lg:pb-16">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          <aside className="lg:col-span-1">
            <Card className="overflow-hidden border border-border bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="h-20 bg-gradient-to-r from-sky-200 via-indigo-200 to-purple-200 sm:h-24" />
              <div className="px-4 pb-6 sm:px-6">
                <div className="-mt-10 mb-4 flex justify-center sm:-mt-12">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-sm sm:h-24 sm:w-24">
                    <img src={profile.avatar} alt={profile.name} />
                  </Avatar>
                </div>
                <div className="text-center">
                  <h1 className="text-xl font-bold sm:text-2xl">{profile.name}</h1>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{profile.headline}</p>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  {profile.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="break-all">{profile.email}</span>
                    </div>
                  )}
                  {profile.college && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="break-words">{profile.college}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4 flex-shrink-0" />
                    <Badge variant={profile.availability === "open" ? "default" : "outline"} className="capitalize">
                      {profile.availability}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4 flex-shrink-0" />
                    <span>⭐ {profile.reputation} reputation</span>
                  </div>
                </div>

                {!isOwnProfile && (
                  <Button 
                    className="mt-6 w-full" 
                    onClick={() => connectMutation.mutate()}
                    disabled={isConnected || connectMutation.isPending}
                  >
                    {isConnected ? "Connected" : connectMutation.isPending ? "Connecting..." : "Connect"}
                  </Button>
                )}
                {isOwnProfile && (
                  <Button className="mt-6 w-full" variant="outline">
                    Edit Profile
                  </Button>
                )}
              </div>
            </Card>

            {profile.links && profile.links.length > 0 && (
              <Card className="mt-6 border border-border bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <h3 className="mb-3 text-sm font-semibold">Links</h3>
                <div className="space-y-2">
                  {profile.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </aside>

          <section className="lg:col-span-2 space-y-6">
            {profile.bio && (
              <Card className="border border-border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <h2 className="mb-3 text-lg font-semibold">About</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
              </Card>
            )}

            {profile.currentFocus && (
              <Card className="border border-border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <h2 className="mb-3 text-lg font-semibold">Current Focus</h2>
                <p className="text-sm text-muted-foreground">{profile.currentFocus}</p>
              </Card>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <Card className="border border-border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <h2 className="mb-3 text-lg font-semibold">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <Card className="border border-border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <h2 className="mb-3 text-lg font-semibold">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="glass">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {profile.achievements && profile.achievements.length > 0 && (
              <Card className="border border-border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-semibold">Achievements</h2>
                <div className="space-y-4">
                  {profile.achievements.map((achievement) => (
                    <div key={achievement.id} className="border-b border-muted/20 pb-4 last:border-none last:pb-0">
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{achievement.year}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <Card className="border border-border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-semibold">Certifications</h2>
                <div className="space-y-4">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="border-b border-muted/20 pb-4 last:border-none last:pb-0">
                      <h3 className="font-medium">{cert.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Issued: {cert.issuedOn}</p>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs text-primary hover:underline"
                        >
                          View credential
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
