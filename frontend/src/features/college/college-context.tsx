import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCollegeSlug } from "@/lib/college-utils";

interface CollegeContextValue {
  collegeSlug: string | null;
  isLoading: boolean;
  hasCollege: boolean;
}

const CollegeContext = createContext<CollegeContextValue | undefined>(undefined);

interface CollegeProviderProps {
  children: ReactNode;
}

export function CollegeProvider({ children }: CollegeProviderProps) {
  const [collegeSlug, setCollegeSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract college slug on mount
    const slug = getCollegeSlug();
    setCollegeSlug(slug);
    setIsLoading(false);

    // Log for debugging
    if (slug) {
      console.log(`[College Detection] College slug detected: ${slug}`);
    } else {
      console.warn("[College Detection] No college slug detected. Using localhost override or missing subdomain.");
    }
  }, []);

  const value: CollegeContextValue = {
    collegeSlug,
    isLoading,
    hasCollege: collegeSlug !== null,
  };

  return <CollegeContext.Provider value={value}>{children}</CollegeContext.Provider>;
}

export function useCollege() {
  const context = useContext(CollegeContext);
  
  if (context === undefined) {
    throw new Error("useCollege must be used within CollegeProvider");
  }
  
  return context;
}

/**
 * Hook that throws if college is missing
 * Use this in components that REQUIRE college context
 */
export function useRequireCollege() {
  const { collegeSlug, hasCollege, isLoading } = useCollege();
  
  if (!isLoading && !hasCollege) {
    throw new Error("College context is required but missing");
  }
  
  return collegeSlug as string;
}
