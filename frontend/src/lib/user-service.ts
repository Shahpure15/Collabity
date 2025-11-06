import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestoreInstance } from "./firebase";
import type { UserProfile } from "./types";

/**
 * Create or update a user profile in Firestore
 */
export async function createUserProfile(
  uid: string,
  data: {
    email: string;
    name?: string;
    photoURL?: string;
  }
): Promise<void> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(db, "users", uid);
  
  // Check if user already exists
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Create new user profile
    await setDoc(userRef, {
      email: data.email,
      name: data.name || data.email.split("@")[0],
      avatar: data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      college: "",
      headline: "Student looking to collaborate",
      skills: [],
      interests: [],
      availability: "open" as const,
      reputation: 0,
      achievements: [],
      certifications: [],
      currentFocus: "",
      bio: "",
      links: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    // Update last login
    await updateDoc(userRef, {
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Get a user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return {
    id: userSnap.id,
    ...userSnap.data(),
  } as UserProfile;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserProfile, "id">>
): Promise<void> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Search for users by name or email
 */
export async function searchUsers(searchTerm: string, maxResults = 20): Promise<UserProfile[]> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const usersRef = collection(db, "users");
  
  // Search by name (case-insensitive search requires proper indexing)
  const q = query(
    usersRef,
    orderBy("name"),
    limit(maxResults)
  );

  const querySnapshot = await getDocs(q);
  const users: UserProfile[] = [];

  querySnapshot.forEach((doc) => {
    const userData = { id: doc.id, ...doc.data() } as UserProfile;
    // Client-side filtering for search term
    if (
      userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.college.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      users.push(userData);
    }
  });

  return users;
}

/**
 * Get users by college
 */
export async function getUsersByCollege(collegeName: string, maxResults = 20): Promise<UserProfile[]> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("college", "==", collegeName),
    orderBy("reputation", "desc"),
    limit(maxResults)
  );

  const querySnapshot = await getDocs(q);
  const users: UserProfile[] = [];

  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as UserProfile);
  });

  return users;
}

/**
 * Get users by skill
 */
export async function getUsersBySkill(skill: string, maxResults = 20): Promise<UserProfile[]> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("skills", "array-contains", skill),
    orderBy("reputation", "desc"),
    limit(maxResults)
  );

  const querySnapshot = await getDocs(q);
  const users: UserProfile[] = [];

  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as UserProfile);
  });

  return users;
}

/**
 * Get all users (with pagination)
 */
export async function getAllUsers(maxResults = 50): Promise<UserProfile[]> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    orderBy("updatedAt", "desc"),
    limit(maxResults)
  );

  const querySnapshot = await getDocs(q);
  const users: UserProfile[] = [];

  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as UserProfile);
  });

  return users;
}

/**
 * Get users by availability status
 */
export async function getUsersByAvailability(
  availability: "open" | "exploring" | "focusing",
  maxResults = 20
): Promise<UserProfile[]> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("availability", "==", availability),
    orderBy("reputation", "desc"),
    limit(maxResults)
  );

  const querySnapshot = await getDocs(q);
  const users: UserProfile[] = [];

  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as UserProfile);
  });

  return users;
}

/**
 * Connect with another user (idempotent)
 */
export async function connectWithUser(currentUid: string, targetUid: string): Promise<void> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  if (currentUid === targetUid) {
    throw new Error("You cannot connect with yourself.");
  }

  const members = [currentUid, targetUid].sort();
  const connectionId = members.join("__");

  const connectionRef = doc(db, "connections", connectionId);
  await setDoc(
    connectionRef,
    {
      members,
      status: "connected",
      initiator: currentUid,
      connectedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Get all connection partner IDs for a user
 */
export async function getConnectionsForUser(uid: string): Promise<string[]> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const connectionsRef = collection(db, "connections");
  const q = query(connectionsRef, where("members", "array-contains", uid));
  const snapshot = await getDocs(q);

  const connectedIds = new Set<string>();
  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as { members?: string[] };
    const members = data.members ?? [];
    members.forEach((memberId) => {
      if (memberId !== uid) {
        connectedIds.add(memberId);
      }
    });
  });

  return Array.from(connectedIds);
}
