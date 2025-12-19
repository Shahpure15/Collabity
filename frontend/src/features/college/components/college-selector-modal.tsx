import { useState } from "react";
import { Building2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface College {
  slug: string;
  name: string;
  location: string;
}

// Add your colleges here
const COLLEGES: College[] = [
  { slug: "mitaoe", name: "MIT Academy of Engineering", location: "Pune, Maharashtra" },
  { slug: "vit", name: "Vellore Institute of Technology", location: "Vellore, Tamil Nadu" },
  { slug: "iitmadras", name: "IIT Madras", location: "Chennai, Tamil Nadu" },
  { slug: "iitbombay", name: "IIT Bombay", location: "Mumbai, Maharashtra" },
  { slug: "bitspilani", name: "BITS Pilani", location: "Pilani, Rajasthan" },
  { slug: "nit", name: "NIT Trichy", location: "Tiruchirappalli, Tamil Nadu" },
  { slug: "dtu", name: "Delhi Technological University", location: "Delhi" },
  { slug: "iisc", name: "IISc Bangalore", location: "Bangalore, Karnataka" },
  { slug: "coep", name: "College of Engineering Pune", location: "Pune, Maharashtra" },
  { slug: "pict", name: "Pune Institute of Computer Technology", location: "Pune, Maharashtra" },
];

interface CollegeSelectorModalProps {
  open: boolean;
  onClose: () => void;
  mode: "login" | "register";
}

export function CollegeSelectorModal({ open, onClose, mode }: CollegeSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredColleges = COLLEGES.filter(
    (college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCollege = (slug: string) => {
    const targetUrl = `https://${slug}.collabity.tech/auth/${mode}`;
    
    // Check if we're on localhost
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      // For localhost, set override and navigate to local auth page
      localStorage.setItem("collabity_college_override", slug);
      window.location.href = `/auth/${mode}`;
    } else {
      // For production, redirect to college subdomain
      window.location.href = targetUrl;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Select Your College</DialogTitle>
          <DialogDescription>
            Choose your institution to {mode === "login" ? "log in" : "create an account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* College List */}
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="space-y-2 p-4">
              {filteredColleges.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <Building2 className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  No colleges found
                </div>
              ) : (
                filteredColleges.map((college) => (
                  <button
                    key={college.slug}
                    onClick={() => handleSelectCollege(college.slug)}
                    className="w-full rounded-lg border border-border bg-background p-4 text-left transition hover:border-primary hover:bg-accent"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{college.name}</h3>
                        <p className="text-sm text-muted-foreground">{college.location}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {college.slug}.collabity.tech
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Help text */}
          <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Don't see your college?</span>
              <br />
              Contact your placement cell or reach out to us for institution onboarding.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
