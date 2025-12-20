import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-context";
import { getFirebaseAuth } from "@/lib/firebase";
import { ArrowLeft, RefreshCw, Trash2, CheckCircle } from "lucide-react";

export function AdminUsersRoute() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  async function getToken() {
    const authInstance = getFirebaseAuth();
    const currentUser = authInstance?.currentUser;
    if (!currentUser) throw new Error("Admin token missing. Re-login as admin.");
    return currentUser.getIdToken();
  }

  async function fetchUsers() {
    setLoading(true);
    setMsg(null);
    try {
      const token = await getToken();
      console.log("Fetching users from:", `${apiBase}/api/admin/list-users`);
      const res = await fetch(`${apiBase}/api/admin/list-users`, {
        method: "GET",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      console.log("Response status:", res.status);
      const payload = await res.json().catch(() => ({}));
      console.log("Response payload:", payload);
      if (!res.ok) throw new Error(payload.error || "Failed to fetch users");
      setUsers(payload.users || []);
      console.log("Users set:", payload.users?.length || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
      setMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(uid: string, email: string) {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;
    setMsg(null);
    try {
      const token = await getToken();
      const res = await fetch(`${apiBase}/api/admin/delete-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ uid }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Failed");
      setMsg(`User ${email} deleted successfully`);
      fetchUsers();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleVerify(uid: string, email: string, currentStatus: boolean) {
    setMsg(null);
    try {
      const token = await getToken();
      const res = await fetch(`${apiBase}/api/admin/set-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ uid, verified: !currentStatus }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Failed");
      setMsg(`User ${email} ${!currentStatus ? "verified" : "unverified"} successfully`);
      fetchUsers();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : String(err));
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage all registered users</p>
          </div>
          <Button
            onClick={fetchUsers}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* User List Card */}
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">All Users</h2>
              <p className="text-sm text-muted-foreground">Total users: {users.length}</p>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold text-sm">Email</th>
                        <th className="text-left p-3 font-semibold text-sm">Display Name</th>
                        <th className="text-center p-3 font-semibold text-sm">Admin Verified</th>
                        <th className="text-left p-3 font-semibold text-sm">Created</th>
                        <th className="text-left p-3 font-semibold text-sm">Last Sign In</th>
                        <th className="text-center p-3 font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.uid} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-3 text-sm font-medium">{user.email}</td>
                          <td className="p-3 text-sm">{user.displayName || "—"}</td>
                          <td className="p-3 text-center">
                            {user.verified ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                Not Verified
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {new Date(user.metadata.creationTime).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {user.metadata.lastSignInTime
                              ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                              : "Never"}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant={user.verified ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleVerify(user.uid, user.email, user.verified || false)}
                                className="flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                {user.verified ? "Unverify" : "Verify"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(user.uid, user.email)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>

          {/* Message Display */}
          {msg && (
            <div className="p-4 bg-muted rounded-lg border">
              <p className="text-sm">{msg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
