import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Sparkle, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogoMark } from "@/features/misc/logo";
import { formatDate } from "@/lib/utils";
import type { Opportunity, ServiceTile } from "@/lib/types";

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "IIT Bombay Hackathon Squad",
    description: "Looking for a full-stack builder to ship a prototype in 48 hours.",
    type: "hackathon",
    postedBy: "Arjun Patel",
    postedByAvatar: "https://i.pravatar.cc/100?img=12",
    college: "IIT Bombay",
    deadline: new Date().toISOString(),
    skills: ["React", "Firebase", "UI"],
    tags: ["weekend", "cash prize"],
    link: "#",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Generative AI Study Circle",
    description: "Weekly micro-builds, reading papers, and sharing experiments.",
    type: "learning",
    postedBy: "Nidhi Sharma",
    postedByAvatar: "https://i.pravatar.cc/100?img=32",
    college: "BITS Pilani",
    deadline: new Date().toISOString(),
    skills: ["ML", "Prompt Engineering"],
    tags: ["remote", "3 hrs/week"],
    link: "#",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Campus Foods MVP Team",
    description: "Need a product designer passionate about student startups.",
    type: "startup",
    postedBy: "Rahul Vora",
    postedByAvatar: "https://i.pravatar.cc/100?img=41",
    college: "Delhi University",
    deadline: new Date().toISOString(),
    skills: ["Design", "User Research"],
    tags: ["equity", "founding team"],
    link: "#",
    createdAt: new Date().toISOString(),
  },
];

const serviceTiles: ServiceTile[] = [
  {
    id: "match",
    title: "Smart teammate matching",
    description: "Filters by skills, timezone, availability, and collab history.",
    icon: "users",
    accent: "from-sky-400/30 to-indigo-400/40",
  },
  {
    id: "mentor",
    title: "Mentor connect (beta)",
    description: "Verified alumni guidance, async intros, booking slots.",
    icon: "sparkle",
    accent: "from-purple-400/30 to-pink-400/40",
  },
  {
    id: "reputation",
    title: "Collab reputation",
    description: "Feedback loops, participation streaks, trust badges.",
    icon: "compass",
    accent: "from-emerald-400/30 to-cyan-400/40",
  },
];

const iconMap = {
  users: Users,
  sparkle: Sparkle,
  compass: Compass,
};

export function LandingRoute() {
  const opportunityGroups = useMemo(() => {
    return {
      hacker: mockOpportunities.filter((item) => item.type === "hackathon"),
      learning: mockOpportunities.filter((item) => item.type === "learning"),
      startup: mockOpportunities.filter((item) => item.type === "startup"),
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <GradientBackdrop />
  <main className="relative z-10 container space-y-32 pb-24 pt-20">
        <HeroSection />
        <FeatureShowcase />
        <OpportunitySection opportunityGroups={opportunityGroups} />
        <WhyCollabitySection />
        <CallToAction />
      </main>
  <footer className="relative z-10 border-t border-white/10 bg-white/20 py-10 backdrop-blur lg:py-12">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Collabity. Built for student builders.</span>
          <div className="flex items-center gap-6">
            <Link className="hover:text-foreground" to="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-foreground" to="/terms">
              Terms
            </Link>
            <Link className="hover:text-foreground" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GradientBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[620px] w-full bg-gradient-to-b from-white/70 via-sky-100/40 to-transparent blur-2xl" />
      <div className="absolute left-1/2 top-32 -ml-40 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="absolute right-1/3 top-72 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl" />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div className="space-y-8">
        <Badge variant="glass" className="w-fit">
          Builder energy · Trust · Creativity · Growth
        </Badge>
        <h1 className="section-heading text-balance text-5xl md:text-6xl">
          Find your dream teammates, mentors, and opportunities—all in one campus-native hub.
        </h1>
        <p className="section-subheading">
          Collabity merges networking, discovery, and collaboration to help students and alumni build faster. Post hackathons, form startup squads, or spin up learning circles with trust baked in.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button asChild size="lg" variant="gradient">
            <Link to="/auth/register" className="flex items-center gap-2">
              Start collaborating
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="glass">
            <a href="#demo">See how it works</a>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div>
            <span className="text-lg font-semibold text-foreground">3k+</span> verified builders
          </div>
          <div>
            <span className="text-lg font-semibold text-foreground">150+</span> collaborations made every week
          </div>
          <div>
            <span className="text-lg font-semibold text-foreground">20+</span> colleges active on Collabity beta
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="glass-panel relative rounded-3xl p-6 shadow-glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoMark className="h-8 w-8" />
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Live teammate matches</p>
                <p className="text-lg font-medium">Hackathon Builder Pods</p>
              </div>
            </div>
            <Button size="sm" variant="ghost">
              View all
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {mockOpportunities.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/70"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge variant="glow" className="text-xs uppercase tracking-wide">
                    {item.type}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute -left-12 bottom-10 hidden h-24 w-24 animate-pulse-orbit rounded-full border border-white/30 bg-sky-200/40 blur-xl md:block" />
          <div className="absolute -right-10 -top-12 hidden h-36 w-36 rounded-full border border-white/30 bg-purple-200/40 blur-3xl md:block" />
        </div>
      </div>
    </section>
  );
}

function FeatureShowcase() {
  return (
    <section id="features" className="space-y-10">
      <div className="space-y-4 text-center">
        <Badge variant="glow" className="mx-auto w-fit">
          Built for student collaboration
        </Badge>
        <h2 className="section-heading text-balance">All your collab workflows in one desk</h2>
        <p className="section-subheading mx-auto">
          Collabity blends the familiarity of LinkedIn, Unstop, and Discord while staying focused on verified student builders.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {serviceTiles.map((tile) => {
          const Icon = iconMap[tile.icon as keyof typeof iconMap] ?? Users;
          return (
            <Card key={tile.id} className="relative overflow-hidden">
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tile.accent}`}
              />
              <CardHeader className="relative z-10 space-y-4">
                <Badge variant="glass" className="w-fit">
                  <Icon className="h-4 w-4" />
                </Badge>
                <CardTitle className="text-2xl font-display">{tile.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {tile.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="rounded-2xl border border-white/40 bg-white/60 p-4 text-sm font-medium text-muted-foreground shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                  Coming soon: AI teammate suggestions, mentor marketplaces, and collaboration streak badges designed for trust.
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

interface OpportunitySectionProps {
  opportunityGroups: {
    hacker: Opportunity[];
    learning: Opportunity[];
    startup: Opportunity[];
  };
}

function OpportunitySection({ opportunityGroups }: OpportunitySectionProps) {
  return (
    <section id="opportunities" className="grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
      <div>
        <div className="space-y-4">
          <Badge variant="glow" className="w-fit">
            Opportunity radar
          </Badge>
          <h2 className="section-heading text-balance">Discover hackathons, gigs, and startup roles curated for you</h2>
          <p className="section-subheading">
            Filter by skills, timezone, project theme, and availability. Search expands into a full command center with regex matching and instant category filters.
          </p>
        </div>
        <div className="mt-8 rounded-3xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-sky-500/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <Tabs defaultValue="hacker">
            <TabsList>
              <TabsTrigger value="hacker">Hackathons</TabsTrigger>
              <TabsTrigger value="learning">Learning pods</TabsTrigger>
              <TabsTrigger value="startup">Startup teams</TabsTrigger>
            </TabsList>
            {Object.entries(opportunityGroups).map(([key, items]) => (
              <TabsContent key={key} value={key}>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/30 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/80"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Badge variant="glass" className="uppercase tracking-wide">
                          {item.college}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>Posted {formatDate(item.createdAt)}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span>Deadline {formatDate(item.deadline)}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <aside className="space-y-6">
        <div className="rounded-3xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-purple-500/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="text-2xl font-display">Trust layer built-in</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Verified profiles, feedback after collaborations, and a collab score help you find the right people faster.
          </p>
          <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
            <li>• Verification via campus email or document check</li>
            <li>• Collab score based on feedback and participation</li>
            <li>• Badges for hackathon wins, open-source, ML builder, and more</li>
          </ul>
        </div>
        <Card className="space-y-4 bg-gradient-to-br from-sky-400/15 via-purple-400/15 to-indigo-500/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Search that understands builder language</CardTitle>
            <CardDescription className="text-base">
              Regex-friendly, category-aware search expands into a workspace when you tap the bar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl bg-background/70 p-4 text-sm text-muted-foreground shadow-inner">
              Try typing <span className="font-semibold text-foreground">ml &amp; (fintech | climate)</span> to surface matches across projects, gigs, events, and people instantly.
            </div>
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}

function WhyCollabitySection() {
  return (
    <section id="why" className="space-y-12">
      <div className="space-y-4 text-center">
        <Badge variant="glass" className="mx-auto w-fit">
          Designed for trust & builder velocity
        </Badge>
        <h2 className="section-heading text-balance">Why students choose Collabity</h2>
        <p className="section-subheading mx-auto">
          We focus on real collaboration signals, not vanity metrics. Every feature is optimized for finding aligned teammates quickly.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Profiles that actually matter",
            description:
              "Verified identity, skill tags, availability, and collaboration history. Showcase your wins with achievements, media, and streaks.",
          },
          {
            title: "Project-first dashboard",
            description:
              "Centralize your hackathon teams, startup pods, and learning circles in one view with notifications, DMs, and upcoming deadlines.",
          },
          {
            title: "Firebase native + real-time",
            description:
              "Built with Firebase for real-time collab rooms, chat, and secure storage. Scale-ready for campus-wide adoption.",
          },
        ].map((item) => (
          <Card key={item.title} className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl font-display">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-3xl border border-white/30 bg-white/70 p-8 shadow-lg shadow-sky-500/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="text-3xl font-display">Roadmap preview</h3>
        <p className="mt-3 text-muted-foreground">
          AI teammate matching, mentor marketplace, collaboration badges, task boards, GitHub sync, and voice ideation lounges are on the horizon.
        </p>
        <ScrollArea className="mt-6 h-48 rounded-2xl border border-white/20 bg-white/40 p-4 dark:border-white/10 dark:bg-slate-900/50">
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Q1:</span> Advanced matching algorithm, Firebase emulator-driven testing suite.
            </li>
            <li>
              <span className="font-medium text-foreground">Q2:</span> Mentor marketplace beta, collab reputation dashboard, project analytics.
            </li>
            <li>
              <span className="font-medium text-foreground">Q3:</span> Gamified badges, AI teammate recommendations, portfolio sync.
            </li>
            <li>
              <span className="font-medium text-foreground">Q4:</span> Voice rooms, in-app task boards, global campus events.
            </li>
          </ul>
        </ScrollArea>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="glass-panel relative overflow-hidden rounded-3xl p-10 text-center shadow-glass">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-indigo-500/20" />
      <div className="relative z-10 space-y-6">
        <Badge variant="glass" className="mx-auto w-fit">
          Join the beta cohort
        </Badge>
        <h2 className="section-heading text-balance">Ready to build smarter teams?</h2>
        <p className="section-subheading mx-auto max-w-2xl">
          Launch your profile, pick your collaboration vibe, and tap into a network of trusted student builders, alumni, and mentors.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="gradient">
            <Link to="/auth/register">Create your profile</Link>
          </Button>
          <Button asChild size="lg" variant="glass">
            <Link to="/auth/login">I already have access</Link>
          </Button>
        </div>
      </div>
      <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-sky-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-purple-100/50 blur-2xl" />
    </section>
  );
}
