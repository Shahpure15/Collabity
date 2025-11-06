import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, User, FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { searchUsers } from "@/lib/user-service";
import { getLatestPosts } from "@/lib/post-service";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["search-users", debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm) return [];
      return await searchUsers(debouncedTerm);
    },
    enabled: debouncedTerm.length > 0,
  });

  const { data: allPosts } = useQuery({
    queryKey: ["search-posts", debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm) return [];
      const posts = await getLatestPosts();
      // Filter posts by content or tags
      return posts.filter(
        (post) =>
          post.content.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          post.authorName.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(debouncedTerm.toLowerCase()))
      );
    },
    enabled: debouncedTerm.length > 0,
  });

  const handleClose = useCallback(() => {
    setSearchTerm("");
    setDebouncedTerm("");
    onOpenChange(false);
  }, [onOpenChange]);

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    handleClose();
  };

  const handlePostClick = (_postId: string) => {
    // For now, just navigate to dashboard
    // In future, you could implement a post detail view
    navigate("/dashboard");
    handleClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Search Modal */}
      <div className="fixed inset-x-0 top-20 z-50 mx-auto max-w-2xl px-4">
        <Card className="border border-border bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-muted/20 p-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for people, posts, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <button
              onClick={handleClose}
              className="rounded-full p-1 transition-colors hover:bg-muted"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!debouncedTerm ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Start typing to search for people, posts, and more...
              </div>
            ) : usersLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Users Section */}
                {users && users.length > 0 && (
                  <div className="border-b border-muted/20 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <User className="h-4 w-4" />
                      People ({users.length})
                    </h3>
                    <div className="space-y-2">
                      {users.slice(0, 5).map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserClick(user.id)}
                          className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50"
                        >
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <img src={user.avatar} alt={user.name} />
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{user.name}</p>
                            {user.headline && (
                              <p className="truncate text-xs text-muted-foreground">
                                {user.headline}
                              </p>
                            )}
                          </div>
                          {user.college && (
                            <Badge variant="outline" className="text-xs">
                              {user.college}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts Section */}
                {allPosts && allPosts.length > 0 && (
                  <div className="p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Posts ({allPosts.length})
                    </h3>
                    <div className="space-y-2">
                      {allPosts.slice(0, 5).map((post) => (
                        <button
                          key={post.id}
                          onClick={() => handlePostClick(post.id)}
                          className="flex w-full flex-col gap-2 rounded-lg p-2 text-left transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <img src={post.authorAvatar} alt={post.authorName} />
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{post.authorName}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {post.authorTitle}
                              </p>
                            </div>
                          </div>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {post.content}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="glass" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {users?.length === 0 && allPosts?.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No results found for "{debouncedTerm}"
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
