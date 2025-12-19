import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/auth-context";
import { createPost } from "@/lib/post-service";

interface PostComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collegeSlug: string | null;
}

export function PostComposer({ open, onOpenChange, collegeSlug }: PostComposerProps) {
  const { user, userProfile } = useAuth();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const postMutation = useMutation({
    mutationFn: async () => {
      if (!user || !userProfile) throw new Error("User not authenticated");
      if (!content.trim()) throw new Error("Post content is required");

      return await createPost({
        authorId: user.uid,
        authorName: userProfile.name || user.displayName || "Unknown",
        authorTitle: userProfile.headline || userProfile.email || "",
        authorAvatar:
          userProfile.avatar ||
          user.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        content: content.trim(),
        visibility: "public",
        tags: tags.length > 0 ? tags : undefined,
        collegeSlug: collegeSlug || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", collegeSlug] });
      setContent("");
      setTags([]);
      setTagInput("");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
      alert("Unable to create post. Please try again.");
    },
  });

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    postMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="resize-none"
          />

          <div>
            <label className="mb-2 block text-sm font-medium">Tags (optional)</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g. design, ml)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1 pr-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded-full hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={postMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!content.trim() || postMutation.isPending}>
            {postMutation.isPending ? "Posting..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
