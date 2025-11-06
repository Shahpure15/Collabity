import {
  doc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

import { getFirestoreInstance } from "@/lib/firebase";

/**
 * Toggle a like/reaction on a post
 * This is a simplified implementation - in production you'd track individual user reactions
 */
export async function togglePostReaction(postId: string): Promise<void> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    reactions: increment(1),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Increment comment count on a post
 */
export async function incrementCommentCount(postId: string): Promise<void> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    comments: increment(1),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Increment share count on a post
 */
export async function incrementShareCount(postId: string): Promise<void> {
  const db = getFirestoreInstance();
  if (!db) throw new Error("Firestore not initialized");

  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    shares: increment(1),
    updatedAt: serverTimestamp(),
  });
}
