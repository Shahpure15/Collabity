import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Compass, Sparkle, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogoMark } from "@/features/misc/logo";
import { useAuth } from "@/features/auth/auth-context";
import { CollegeSelectorModal } from "@/features/college/components/college-selector-modal";
import type { ServiceTile } from "@/lib/types";

const serviceTiles: ServiceTile[] = [
  {
    id: "match",
    title: "Opportunity discovery",
    description: "Search and filter internships and projects by skills and interests.",
    icon: "users",
    accent: "from-sky-400/30 to-indigo-400/40",
  },
  {
    id: "mentor",
    title: "Application tracking",
    description: "Monitor your application status and deadlines in one place.",
    icon: "sparkle",
    accent: "from-purple-400/30 to-pink-400/40",
  },
  {
    id: "reputation",
    title: "Profile management",
    description: "Showcase your skills, achievements, and academic credentials.",
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <GradientBackdrop />
      <main className="relative z-10 container space-y-32 pb-24 pt-20">
        <HeroSection />
        <FeatureShowcase />
        <WhyCollabitySection />
        <CallToAction />
      </main>
  <footer className="relative z-10 border-t border-white/10 bg-white/20 py-10 backdrop-blur lg:py-12">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Collabity. Academic opportunity portal.</span>
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCollegeSelector, setShowCollegeSelector] = useState(false);
  const [selectorMode, setSelectorMode] = useState<"login" | "register">("register");

  const handleCtaClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      // Always show college selector for non-authenticated users
      setSelectorMode("register");
      setShowCollegeSelector(true);
    }
  };

  return (
    <>
      <CollegeSelectorModal 
        open={showCollegeSelector} 
        onClose={() => setShowCollegeSelector(false)}
        mode={selectorMode}
      />
      <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div className="space-y-8">
        <Badge variant="glass" className="w-fit">
          Academic excellence · Opportunity · Growth · Success
        </Badge>
        <h1 className="section-heading text-balance text-5xl md:text-6xl">
          Academic portal for internships, projects, and career opportunities.
        </h1>
        <p className="section-subheading">
          A centralized platform connecting students with verified academic and professional opportunities from faculty and industry partners.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleCtaClick} size="lg" variant="gradient" className="flex items-center gap-2">
            Get started
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button asChild size="lg" variant="glass">
            <a href="#features">Learn more</a>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div>
            <span className="text-lg font-semibold text-foreground">Platform</span> in development
          </div>
          <div>
            <span className="text-lg font-semibold text-foreground">Features</span> coming soon
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="glass-panel relative rounded-3xl p-6 shadow-glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoMark className="h-8 w-8" />
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Coming soon</p>
                <p className="text-lg font-medium">Opportunity listings</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/40 bg-white/70 p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <p className="text-sm text-muted-foreground">
                Internship and project opportunities will appear here once faculty and partners begin posting.
              </p>
            </div>
          </div>
          <div className="absolute -left-12 bottom-10 hidden h-24 w-24 animate-pulse-orbit rounded-full border border-white/30 bg-sky-200/40 blur-xl md:block" />
          <div className="absolute -right-10 -top-12 hidden h-36 w-36 rounded-full border border-white/30 bg-purple-200/40 blur-3xl md:block" />
        </div>
      </div>
    </section>
    </>
  );
}

function FeatureShowcase() {
  return (
    <section id="features" className="space-y-10">
      <div className="space-y-4 text-center">
        <Badge variant="glow" className="mx-auto w-fit">
          Platform features
        </Badge>
        <h2 className="section-heading text-balance">Academic opportunity management</h2>
        <p className="section-subheading mx-auto">
          A streamlined system for discovering, applying to, and tracking internships and academic projects.
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
                  Feature development in progress
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function WhyCollabitySection() {
  return (
    <section id="why" className="space-y-12">
      <div className="space-y-4 text-center">
        <Badge variant="glass" className="mx-auto w-fit">
          Platform overview
        </Badge>
        <h2 className="section-heading text-balance">Why Collabity</h2>
        <p className="section-subheading mx-auto">
          A dedicated portal designed to streamline the internship and project application process for academic institutions.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Student profiles",
            description:
              "Create and maintain professional profiles showcasing skills, achievements, and academic credentials.",
          },
          {
            title: "Opportunity browser",
            description:
              "Browse and filter internships and projects posted by faculty and industry partners.",
          },
          {
            title: "Application management",
            description:
              "Submit applications and track their status through the review and approval process.",
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
        <h3 className="text-3xl font-display">Development roadmap</h3>
        <p className="mt-3 text-muted-foreground">
          Core features are under active development to support academic opportunity management and application tracking.
        </p>
        <ScrollArea className="mt-6 h-48 rounded-2xl border border-white/20 bg-white/40 p-4 dark:border-white/10 dark:bg-slate-900/50">
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Phase 1:</span> Role-based access control (Student, Faculty, Admin)
            </li>
            <li>
              <span className="font-medium text-foreground">Phase 2:</span> Opportunity posting system with approval workflow
            </li>
            <li>
              <span className="font-medium text-foreground">Phase 3:</span> Application submission and tracking dashboard
            </li>
            <li>
              <span className="font-medium text-foreground">Phase 4:</span> Notification system and analytics for placement office
            </li>
          </ul>
        </ScrollArea>
      </div>
    </section>
  );
}

function CallToAction() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCollegeSelector, setShowCollegeSelector] = useState(false);
  const [selectorMode, setSelectorMode] = useState<"login" | "register">("register");

  const handleCtaClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      // Always show college selector for non-authenticated users
      setSelectorMode("register");
      setShowCollegeSelector(true);
    }
  };

  const handleLoginClick = () => {
    // Always show college selector for login
    setSelectorMode("login");
    setShowCollegeSelector(true);
  };

  return (
    <>
      <CollegeSelectorModal 
        open={showCollegeSelector} 
        onClose={() => setShowCollegeSelector(false)}
        mode={selectorMode}
      />
      <section className="glass-panel relative overflow-hidden rounded-3xl p-10 text-center shadow-glass">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-indigo-500/20" />
      <div className="relative z-10 space-y-6">
        <Badge variant="glass" className="mx-auto w-fit">
          Get started
        </Badge>
        <h2 className="section-heading text-balance">Ready to explore opportunities?</h2>
        <p className="section-subheading mx-auto max-w-2xl">
          Create your profile and start discovering internships and projects from verified faculty and industry partners.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={handleCtaClick} size="lg" variant="gradient">
            {user ? "Go to Dashboard" : "Create your profile"}
          </Button>
          <Button onClick={handleLoginClick} size="lg" variant="glass">
            I already have access
          </Button>
        </div>
      </div>
      <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-sky-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-purple-100/50 blur-2xl" />
    </section>
    </>
  );
}
