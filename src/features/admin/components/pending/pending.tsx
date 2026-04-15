// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
// import { Button } from "@/core/components/ui/button";
// import { Badge } from "@/core/components/ui/badge";
// import { Loader2, CheckCircle2, XCircle, User } from "lucide-react";

// type Profile = {
//   phone: string;
//   address: string;
//   img: string | null;
//   sex?: string;
//   dateOfBirth?: string;
// };

// type PendingUser = {
//   id: string;
//   username: string;
//   email: string;
//   role: string;
//   profile: Profile;
// };

// export function PendingUsers() {
//   const [users, setUsers] = useState<PendingUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [successMsg, setSuccessMsg] = useState<string | null>(null);

//   const fetchPendingUsers = async () => {
//     try {
//       const { data } = await axios.get("/api/admin/pending-users");
//       setUsers(data.users);
//     } catch {
//       setError("Failed to fetch pending users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPendingUsers();
//   }, []);

//   const handleVerify = async (userId: string) => {
//     setActionLoading(userId + "_verify");
//     setError(null);
//     try {
//       await axios.patch(`/api/admin/verify/${userId}`);
//       setUsers((prev) => prev.filter((u) => u.id !== userId));
//       setSuccessMsg("User verified successfully!");
//       setTimeout(() => setSuccessMsg(null), 3000);
//     } catch {
//       setError("Failed to verify user");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleReject = async (userId: string) => {
//     setActionLoading(userId + "_reject");
//     setError(null);
//     try {
//       await axios.delete(`/api/admin/verify/${userId}`);
//       setUsers((prev) => prev.filter((u) => u.id !== userId));
//       setSuccessMsg("User rejected successfully!");
//       setTimeout(() => setSuccessMsg(null), 3000);
//     } catch {
//       setError("Failed to reject user");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
     
//       <div>
//         <h1 className="text-2xl font-semibold">Pending Verifications</h1>
//         <p className="text-sm text-muted-foreground">
//           Review and verify user profiles
//         </p>
//       </div>

      
//       {successMsg && (
//         <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3">
//           <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
//           <p className="text-sm text-green-700 font-medium">{successMsg}</p>
//         </div>
//       )}

     
//       {error && (
//         <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
//           <p className="text-sm text-red-600">{error}</p>
//         </div>
//       )}

     
//       {users.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
//           <CheckCircle2 className="w-12 h-12 mb-2" />
//           <p className="text-sm">No pending users</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {users.map((user) => (
//             <Card key={user.id}>
//               <CardHeader className="flex flex-row items-center gap-4 pb-2">
//                 {user.profile.img ? (
//                   <img
//                     src={user.profile.img}
//                     alt={user.username}
//                     className="w-12 h-12 rounded-full object-cover border"
//                   />
//                 ) : (
//                   <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
//                     <User className="w-6 h-6 text-muted-foreground" />
//                   </div>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <CardTitle className="text-sm truncate">{user.username}</CardTitle>
//                   <p className="text-xs text-muted-foreground truncate">{user.email}</p>
//                   <Badge variant="outline" className="mt-1 text-xs">
//                     {user.role}
//                   </Badge>
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-2">
//                 <div className="text-sm space-y-1">
//                   <p>
//                     <span className="text-muted-foreground">Phone: </span>
//                     {user.profile.phone}
//                   </p>
//                   <p>
//                     <span className="text-muted-foreground">Address: </span>
//                     {user.profile.address}
//                   </p>
//                   {user.profile.sex && (
//                     <p>
//                       <span className="text-muted-foreground">Sex: </span>
//                       {user.profile.sex}
//                     </p>
//                   )}
//                   {user.profile.dateOfBirth && (
//                     <p>
//                       <span className="text-muted-foreground">DOB: </span>
//                       {new Date(user.profile.dateOfBirth).toLocaleDateString()}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex gap-2 pt-2">
//                   <Button
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => handleVerify(user.id)}
//                     disabled={!!actionLoading}
//                   >
//                     {actionLoading === user.id + "_verify" ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-4 h-4 mr-1" />
//                     )}
//                     Verify
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     className="flex-1"
//                     onClick={() => handleReject(user.id)}
//                     disabled={!!actionLoading}
//                   >
//                     {actionLoading === user.id + "_reject" ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <XCircle className="w-4 h-4 mr-1" />
//                     )}
//                     Reject
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { ConfirmDialog } from "@/core/components/ConfirmDialog";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  RefreshCw,
} from "lucide-react";

type Profile = {
  phone: string;
  address: string;
  img: string | null;
  sex?: string;
  dateOfBirth?: string;
};

type PendingUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  profile: Profile;
};

type ActionState = Record<string, "verify" | "reject" | undefined>;

export function PendingUsers() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<ActionState>({});
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // which user's reject dialog is open — null means closed
  const [rejectTarget, setRejectTarget] = useState<PendingUser | null>(null);

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSuccess = (msg: string) => {
    if (successTimer.current) clearTimeout(successTimer.current);
    setSuccessMsg(msg);
    successTimer.current = setTimeout(() => setSuccessMsg(null), 3000);
  };

  useEffect(() => () => {
    if (successTimer.current) clearTimeout(successTimer.current);
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/admin/pending-users");
      setUsers(data.users);
    } catch {
      setError("Failed to fetch pending users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const setAction = (userId: string, action: "verify" | "reject" | undefined) =>
    setActionState((prev) => ({ ...prev, [userId]: action }));

  const handleVerify = async (userId: string) => {
    setAction(userId, "verify");
    setError(null);
    try {
      await axios.patch(`/api/admin/verify/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showSuccess("User verified successfully.");
    } catch {
      setError("Failed to verify user. Please try again.");
    } finally {
      setAction(userId, undefined);
    }
  };

  const handleReject = async (userId: string) => {
    setAction(userId, "reject");
    setError(null);
    setRejectTarget(null); // close dialog immediately
    try {
      await axios.delete(`/api/admin/verify/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showSuccess("User rejected and removed.");
    } catch {
      setError("Failed to reject user. Please try again.");
    } finally {
      setAction(userId, undefined);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Single ConfirmDialog instance — controlled by rejectTarget */}
      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={(open) => { if (!open) setRejectTarget(null); }}
        title="Reject this user?"
        description={
          rejectTarget
            ? `This will permanently remove ${rejectTarget.username}'s account. This cannot be undone.`
            : ""
        }
        confirmText="Yes, reject"
        variant="destructive"
        isLoading={!!rejectTarget && actionState[rejectTarget.id] === "reject"}
        onConfirm={() => rejectTarget && handleReject(rejectTarget.id)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pending Verifications</h1>
          <p className="text-sm text-muted-foreground">
            Review and verify user profiles before they can access the system.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPendingUsers}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-sm text-green-700 font-medium">{successMsg}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <CheckCircle2 className="w-12 h-12 mb-3" />
          <p className="text-sm font-medium">All caught up</p>
          <p className="text-xs mt-1">No users are waiting for verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => {
            const busy = actionState[user.id];
            return (
              <Card key={user.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  {user.profile.img ? (
                    <img
                      src={user.profile.img}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm truncate">
                      {user.username}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs capitalize">
                      {user.role.toLowerCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Phone: </span>
                      {user.profile.phone}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Address: </span>
                      {user.profile.address}
                    </p>
                    {user.profile.sex && (
                      <p>
                        <span className="text-muted-foreground">Sex: </span>
                        {user.profile.sex}
                      </p>
                    )}
                    {user.profile.dateOfBirth && (
                      <p>
                        <span className="text-muted-foreground">DOB: </span>
                        {new Date(user.profile.dateOfBirth).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleVerify(user.id)}
                      disabled={!!busy}
                    >
                      {busy === "verify" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Verify
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      disabled={!!busy}
                      onClick={() => setRejectTarget(user)}
                    >
                      {busy === "reject" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

