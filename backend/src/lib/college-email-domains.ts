export const COLLEGE_EMAIL_DOMAINS: Record<string, string[]> = {
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

export function getEmailDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() || "";
}

export function validateEmailForCollege(email: string | null | undefined, collegeSlug: string | null | undefined): { isValid: boolean; error?: string } {
  if (!collegeSlug) {
    return { isValid: false, error: "No college specified" };
  }

  if (!email) return { isValid: false, error: "Missing email" };

  const domain = getEmailDomain(email);
  if (!domain) return { isValid: false, error: "Invalid email address" };

  const allowed = COLLEGE_EMAIL_DOMAINS[collegeSlug];
  if (!allowed || allowed.length === 0) {
    // not configured — allow for now
    return { isValid: true };
  }

  if (!allowed.includes(domain)) {
    return { isValid: false, error: `Email domain not allowed for ${collegeSlug}` };
  }

  return { isValid: true };
}
