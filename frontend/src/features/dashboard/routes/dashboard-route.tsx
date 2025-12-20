import { useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/auth-context";
import { getFirebaseAuth } from "@/lib/firebase";
import { useCollege } from "@/features/college";
import { getLatestPosts, type FeedPost } from "@/lib/post-service";
import { togglePostReaction } from "@/lib/post-reactions";
import { PostComposer } from "@/features/dashboard/components/post-composer";
import {
  Loader2,
  Users,
  TrendingUp,
  Zap,
  Image as ImageIcon,
  FileText,
  Globe,
  Ellipsis,
  ThumbsUp,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";

const fallbackFeed: FeedPost[] = [
  {
    id: "fallback-1",
    authorId: "ishita-rao",
    authorName: "Ishita Rao",
    authorTitle: "Product designer · IIT Bombay",
    authorAvatar: "https://i.pravatar.cc/100?img=21",
    visibility: "public",
    content:
      "Wrapped up the first sprint for Campus Buddy with a UX audit + clickable prototype. Looking for a frontend dev comfortable with Tailwind + Firebase to pair for the build sprint this weekend.",
    tags: ["design", "campus-startups", "help-wanted"],
    attachments: [
      {
        type: "image",
        title: "Sprint board snapshot",
        description: "Figma screens + flows",
      },
    ],
    reactions: 34,
    comments: 12,
    shares: 4,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "fallback-2",
    authorId: "viaan-kapoor",
    authorName: "Viaan Kapoor",
    authorTitle: "Full-stack @ BITS Pilani",
    authorAvatar: "https://i.pravatar.cc/100?img=35",
    visibility: "public",
    content:
      "Deployed 'HustleHub' MVP on Vercel tonight 🚀 Built with Next.js, Supabase, and shadcn/ui. Need beta testers who host campus events—DM for invite codes.",
    reactions: 59,
    comments: 18,
    shares: 9,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "fallback-3",
    authorId: "stuti-sharma",
    authorName: "Stuti Sharma",
    authorTitle: "AI research • IIIT Hyderabad",
    authorAvatar: "https://i.pravatar.cc/100?img=48",
    visibility: "public",
    content:
      "Sharing notes + starter notebook from our campus ML reading circle on Retrieval-Augmented Generation. We'll be evaluating open-source embeddings next week—drop a comment if you want in.",
    tags: ["ml", "rag", "reading-circle"],
    attachments: [
      {
        type: "doc",
        title: "Week 02 - RAG primer",
        description: "Colab notebook + references",
      },
    ],
    reactions: 41,
    comments: 23,
    shares: 6,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

const suggestedCollaborators = [
  {
    name: "Mihir Bhatt",
    title: "Frontend • VIT • Building Campus Climb",
    email: "mihir@example.com",
    avatar: "https://i.pravatar.cc/100?img=16",
  },
  {
    name: "Sara Ansari",
    title: "Product • SRCC • Startup sprint mentor",
    email: "sara@example.com",
    avatar: "https://i.pravatar.cc/100?img=53",
  },
  {
    name: "Karan Lohia",
    title: "ML engineer • IIIT-D • Open source contributor",
    email: "karan@example.com",
    avatar: "https://i.pravatar.cc/100?img=67",
  },
];

export function DashboardRoute() {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const { collegeSlug } = useCollege();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [composerOpen, setComposerOpen] = useState(false);

  const { data: feedPosts, isLoading: feedLoading } = useQuery({
    queryKey: ["feed", collegeSlug],
    queryFn: () => getLatestPosts(collegeSlug, 20),
    enabled: !!user && !!collegeSlug,
  });

  const reactionMutation = useMutation({
    mutationFn: async (postId: string) => {
      await togglePostReaction(postId);
      return postId;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["feed", collegeSlug] });
      const previousFeed = queryClient.getQueryData<FeedPost[]>(["feed", collegeSlug]);

      queryClient.setQueryData<FeedPost[]>(["feed", collegeSlug], (old) =>
        old?.map((post) =>
          post.id === postId
            ? { ...post, reactions: (post.reactions ?? 0) + 1 }
            : post
        )
      );

      return { previousFeed };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["feed", collegeSlug], context.previousFeed);
      }
    },
  });

  const hasRemotePosts = (feedPosts?.length ?? 0) > 0;
  const feedItems = hasRemotePosts ? feedPosts! : fallbackFeed;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  // Admin panel
  function AdminPanel() {
    const navigate = useNavigate();

    return (
      <Card className="border border-border bg-white p-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold">Admin Panel</h3>
          <p className="text-xs text-muted-foreground">Manage users and system settings</p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => navigate("/admin/users")}
            variant="outline"
            className="w-full justify-start"
          >
            <Users className="w-4 h-4 mr-2" />
            Edit Users
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 lg:pb-0">
      <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-4 pb-8 pt-4 sm:px-6 lg:flex-row lg:pt-8">
        <aside className="hidden lg:flex w-full flex-col gap-6 lg:max-w-[280px]">
          <Card className="overflow-hidden border border-border bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="h-20 bg-gradient-to-r from-sky-200 via-indigo-200 to-purple-200" />
            <div className="px-6 pb-6">
              <div className="-mt-12 mb-3 flex justify-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                  <img
                    src={
                      userProfile?.avatar ||
                      user.photoURL ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
                    }
                    alt={userProfile?.name || user.displayName || "User"}
                  />
                </Avatar>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  {userProfile?.name || user.displayName || "Student"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.headline || userProfile?.email || user.email}
                </p>
              </div>
              <div className="mt-4 space-y-3 border-t border-dashed border-muted-foreground/20 pt-4 text-sm">
                {userProfile?.college && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>College</span>
                    <span className="font-medium text-foreground">{userProfile.college}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Availability</span>
                  <Badge variant={userProfile?.availability === "open" ? "default" : "outline"}>
                    {userProfile?.availability || "open"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Reputation</span>
                  <span className="font-medium">⭐ {userProfile?.reputation || 0}</span>
                </div>
              </div>
              {userProfile?.skills && userProfile.skills.length > 0 && (
                <div className="mt-4 border-t border-muted-foreground/20 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Top skills
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {userProfile.skills.slice(0, 6).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-[11px]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button className="mt-6 w-full" variant="outline" onClick={() => navigate(`/profile/${user.uid}`)}>
                View profile
              </Button>
              {isAdmin && (
                <div className="mt-4">
                  <AdminPanel />
                </div>
              )}
            </div>
          </Card>

          <Card className="border border-border bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="space-y-4 p-5 text-sm">
              <h3 className="text-sm font-semibold">Your metrics</h3>
              <div className="space-y-3 text-muted-foreground">
                <MetricRow label="Projects" value="0" icon={<TrendingUp className="h-4 w-4 text-blue-500" />} />
                <MetricRow label="Connections" value="0" icon={<Users className="h-4 w-4 text-violet-500" />} />
                <MetricRow label="Day streak" value="0" icon={<Zap className="h-4 w-4 text-amber-500" />} />
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-primary">
                View analytics
              </Button>
            </div>
          </Card>
        </aside>

        <section className="flex-1 space-y-4">
          <div className="sticky top-16 z-40 mb-3 flex gap-2 bg-background py-2 lg:static lg:z-auto lg:mb-4 lg:gap-3">
            <Avatar className="h-10 w-10 lg:h-12 lg:w-12 flex-shrink-0">
              <img
                src={
                  userProfile?.avatar ||
                  user.photoURL ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
                }
                alt="Your avatar"
              />
            </Avatar>
            <button 
              onClick={() => setComposerOpen(true)}
              className="w-full rounded-full border border-muted bg-muted/40 px-4 py-2 text-left text-sm text-muted-foreground transition hover:bg-muted"
            >
              Start a post
            </button>
          </div>

          <PostComposer open={composerOpen} onOpenChange={setComposerOpen} collegeSlug={collegeSlug} />

          {feedLoading && !hasRemotePosts && (
            <Card className="border border-border bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Loading posts…
              </div>
            </Card>
          )}

          {feedItems.map((item) => {
            const relativeTime = formatRelativeTime(item.createdAt);

            return (
              <Card key={item.id} className="border border-border bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <img src={item.authorAvatar} alt={item.authorName} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold break-words">{item.authorName}</p>
                          <p className="text-xs text-muted-foreground break-words">{item.authorTitle}</p>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                            <span>{relativeTime}</span>
                            {item.visibility === "public" && (
                              <>
                                <span>•</span>
                                <Globe className="h-3 w-3 flex-shrink-0" />
                              </>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-muted-foreground">
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground break-words">{item.content}</p>

                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-primary/80">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-primary/10 px-3 py-1">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-4 overflow-hidden rounded-lg border border-muted/40">
                      {item.attachments.map((attachment) => (
                        <div key={attachment.title} className="flex items-center gap-3 bg-muted/30 p-4">
                          {attachment.type === "image" && <ImageIcon className="h-5 w-5 flex-shrink-0 text-blue-500" />}
                          {attachment.type === "doc" && <FileText className="h-5 w-5 flex-shrink-0 text-amber-500" />}
                          {attachment.type === "link" && <Share2 className="h-5 w-5 flex-shrink-0 text-primary" />}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground break-words">{attachment.title}</p>
                            {attachment.description && (
                              <p className="text-xs text-muted-foreground break-words">{attachment.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{item.reactions ?? 0} reactions</span>
                    <span className="whitespace-nowrap">{item.comments ?? 0} comments • {item.shares ?? 0} shares</span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 border-y border-muted/20 py-1 text-xs font-medium text-muted-foreground">
                    <PostAction 
                      icon={<ThumbsUp className="h-4 w-4" />} 
                      label="Like" 
                      onClick={() => reactionMutation.mutate(item.id)}
                    />
                    <PostAction icon={<MessageCircle className="h-4 w-4" />} label="Comment" />
                    <PostAction icon={<Share2 className="h-4 w-4" />} label="Share" />
                    <PostAction icon={<Send className="h-4 w-4" />} label="Send" />
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <aside className="hidden w-full flex-col gap-6 xl:flex xl:max-w-[320px]">
          <Card className="hidden border border-border bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h3 className="text-sm font-semibold">Trending topics</h3>
            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <TrendingItem title="IISc x IITM climate micro-builds" subtitle="36 members" />
              <TrendingItem title="Bitsian founders collective" subtitle="18 new posts this week" />
              <TrendingItem title="Open-source-first campus builders" subtitle="Policy discussions • weekly" />
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full justify-start text-xs text-primary">
              View all communities
            </Button>
          </Card>

          <Card className="hidden border border-border bg-white p-5 text-sm shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h3 className="text-sm font-semibold">Suggested students</h3>
            <div className="mt-4 space-y-4">
              {suggestedCollaborators.map((person) => (
                <div key={person.email} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <img src={person.avatar} alt={person.name} />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.title}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}

function PostAction({ icon, label, onClick }: { icon: ReactNode; label: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-center gap-1 sm:gap-2 py-2 transition hover:bg-muted/60"
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="hidden xs:inline sm:inline">{label}</span>
    </button>
  );
}

function TrendingItem({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-dashed border-muted-foreground/20 pb-3 last:border-none last:pb-0">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function MetricRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60">
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function formatRelativeTime(date?: Date): string {
  if (!date) return "just now";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(days / 365);
  return `${years}y`;
}
