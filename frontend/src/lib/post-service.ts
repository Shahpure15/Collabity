import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  serverTimestamp,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import { getFirestoreInstance } from "@/lib/firebase";

export type FeedAttachmentType = "image" | "link" | "doc";

export interface FeedAttachment {
  type: FeedAttachmentType;
  title: string;
  description?: string;
  url?: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  collegeSlug?: string;
  visibility?: "public" | "community";
  content: string;
  tags?: string[];
  attachments?: FeedAttachment[];
  reactions?: number;
  comments?: number;
  shares?: number;
  createdAt?: Date;
}

/**
 * Fetch the latest posts for the dashboard feed
 * Filtered by college to show only posts from the same institution
 */
export async function getLatestPosts(collegeSlug: string | null, maxResults = 20): Promise<FeedPost[]> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const postsRef = collection(db, "posts");
  
  // Filter by collegeSlug if provided
  const q = collegeSlug
    ? query(postsRef, where("collegeSlug", "==", collegeSlug), orderBy("createdAt", "desc"), limit(maxResults))
    : query(postsRef, orderBy("createdAt", "desc"), limit(maxResults));
    
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as any;
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined;

    return {
      id: docSnap.id,
      authorId: data.authorId ?? "",
      authorName: data.authorName ?? "Unknown builder",
      authorTitle: data.authorTitle ?? "",
      authorAvatar:
        data.authorAvatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.authorId ?? docSnap.id}`,
      collegeSlug: data.collegeSlug,
      visibility: data.visibility ?? "public",
      content: data.content ?? "",
      tags: data.tags ?? [],
      attachments: data.attachments ?? [],
      reactions: data.reactions ?? 0,
      comments: data.comments ?? 0,
      shares: data.shares ?? 0,
      createdAt,
    } satisfies FeedPost;
  });
}

/**
 * Create a new post in Firestore
 */
export async function createPost(post: {
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  collegeSlug?: string;
  content: string;
  visibility?: "public" | "community";
  tags?: string[];
  attachments?: FeedAttachment[];
}): Promise<string> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const postsRef = collection(db, "posts");
  const docRef = await addDoc(postsRef, {
    ...post,
    reactions: 0,
    comments: 0,
    shares: 0,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
