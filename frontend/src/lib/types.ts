export type Availability = "open" | "exploring" | "focusing";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  avatar: string;
  headline: string;
  skills: string[];
  interests: string[];
  availability: Availability;
  reputation: number;
  achievements: Achievement[];
  certifications: Certification[];
  currentFocus: string;
  bio: string;
  links: Array<{
    label: string;
    url: string;
  }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number;
  mediaUrl?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuedOn: string;
  credentialUrl?: string;
}

export type OpportunityType =
  | "hackathon"
  | "project"
  | "gig"
  | "startup"
  | "mentorship"
  | "learning";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  postedBy: string;
  postedByAvatar: string;
  college: string;
  deadline: string;
  skills: string[];
  tags: string[];
  link?: string;
  createdAt: string;
}

export interface ServiceTile {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
}

export interface CollaborationPulse {
  id: string;
  title: string;
  summary: string;
  category: string;
  participants: number;
  trending: boolean;
}

export interface DirectMessageSummary {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  updatedAt: string;
}
