import { getCollegeSlug } from "./college-utils";

// College-specific email domain mappings
// Add your colleges and their allowed email domains here
const COLLEGE_EMAIL_DOMAINS: Record<string, string[]> = {
  mitaoe: ["mitaoe.ac.in", "mitaoe.edu.in"],
  vit: ["vitstudent.ac.in", "vit.ac.in"],
  iitmadras: ["smail.iitm.ac.in", "iitm.ac.in"],
  iitbombay: ["iitb.ac.in"],
  bitspilani: ["pilani.bits-pilani.ac.in", "bits-pilani.ac.in"],
  nit: ["nitt.edu"],
  dtu: ["dtu.ac.in"],
  iisc: ["iisc.ac.in"],
  coep: ["coep.ac.in"],
  pict: ["pict.edu"],
};

/**
 * Extract domain from email address
 */
export function getEmailDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() || "";
}

/**
 * Check if email domain is allowed for the current college
 */
export function validateEmailForCollege(email: string, collegeSlug: string | null): {
  isValid: boolean;
  error?: string;
} {
  if (!collegeSlug) {
    return {
      isValid: false,
      error: "No college context detected. Please access via your college subdomain.",
    };
  }

  const emailDomain = getEmailDomain(email);
  
  if (!emailDomain) {
    return {
      isValid: false,
      error: "Invalid email address.",
    };
  }

  const allowedDomains = COLLEGE_EMAIL_DOMAINS[collegeSlug];

  if (!allowedDomains || allowedDomains.length === 0) {
    // College not configured yet - allow all emails
    console.warn(`[Email Validation] No email domains configured for college: ${collegeSlug}`);
    return { isValid: true };
  }

  const isAllowed = allowedDomains.includes(emailDomain);

  if (!isAllowed) {
    return {
      isValid: false,
      error: `You must use your institutional email (@${allowedDomains[0]}) to register for ${collegeSlug}.`,
    };
  }

  return { isValid: true };
}

/**
 * Get allowed email domains for current college
 */
export function getAllowedEmailDomains(): string[] {
  const collegeSlug = getCollegeSlug();
  
  if (!collegeSlug) {
    return [];
  }

  return COLLEGE_EMAIL_DOMAINS[collegeSlug] || [];
}

/**
 * Get display text for allowed email domains
 */
export function getAllowedEmailDomainsText(): string {
  const domains = getAllowedEmailDomains();
  
  if (domains.length === 0) {
    return "your institutional email";
  }

  if (domains.length === 1) {
    return `@${domains[0]}`;
  }

  return domains.map(d => `@${d}`).join(" or ");
}
