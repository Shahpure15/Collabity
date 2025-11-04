import { getFirebaseAuth } from "./firebase";

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Get the current user's Firebase ID token
 */
async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth();
  if (!auth || !auth.currentUser) {
    return null;
  }

  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error("[API] Failed to get ID token:", error);
    return null;
  }
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getIdToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.error || "API request failed");
  }

  return response.json();
}

/**
 * Verify the current user's token with the backend
 */
export async function verifyToken() {
  return apiRequest("/api/auth/verify", { method: "POST" });
}

/**
 * Get the current user's information from the backend
 */
export async function getCurrentUser() {
  return apiRequest("/api/auth/me", { method: "GET" });
}

/**
 * Health check to verify backend is running
 */
export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return response.json();
}

// Export the generic apiRequest for custom API calls
export { apiRequest };
