// "use client";

// import { useState, useEffect } from "react";
// import {
//   UserTable,
//   UserDialog,
//   ConfirmDelete,
// } from "@/features/users/components";
// import { useUsers } from "@/features/users/hooks/useUsers";
// import type { User } from "@/features/users/types/user.types";

// export interface UserFiltersState {
//   search: string;
//   role?: string | "all";
//   isVerified?: boolean | "all";
// }

// export default function UsersPage() {
//   const {
//     users,
//     loading,
//     fetchUsers,
//     createUser,
//     updateUser,
//     deleteUser,
//   } = useUsers();

//   const [filters, setFilters] = useState<UserFiltersState>({
//     search: "",
//     role: "all",
//     isVerified: "all",
//   });

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchUsers(filters);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [filters, fetchUsers]);

//   const handleCreate = () => {
//     setEditingUser(null);
//     setIsDialogOpen(true);
//   };

//   const handleEdit = (user: User) => {
//     setEditingUser(user);
//     setIsDialogOpen(true);
//   };

//   const handleDeleteClick = (id: string) => {
//     setDeletingUserId(id);
//   };

//   const handleConfirmDelete = async () => {
//     if (deletingUserId) {
//       await deleteUser(deletingUserId);
//       setDeletingUserId(null);
//       await fetchUsers(filters); // 👈 refetch with current filters
//     }
//   };

//   const handleFormSubmit = async (values: Partial<User>) => {
//     const success = editingUser
//       ? await updateUser(editingUser.id, values)
//       : await createUser(values);

//     if (success) {
//       setIsDialogOpen(false);
//       await fetchUsers(filters); // 👈 refetch with current filters
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Users</h1>
//         <p className="text-muted-foreground">
//           Manage system users, roles, and permissions.
//         </p>
//       </div>

//       <UserTable
//         users={users}
//         loading={loading}
//         onEdit={handleEdit}
//         onDelete={handleDeleteClick}
//         filters={filters}
//         onFilterChange={setFilters}
//         onAddUser={handleCreate}
//       />

//       <UserDialog
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         initialValues={editingUser || undefined}
//         onSubmit={handleFormSubmit}
//         loading={loading}
//         isEdit={!!editingUser}
//       />

//       <ConfirmDelete
//         open={!!deletingUserId}
//         onOpenChange={(open) => !open && setDeletingUserId(null)}
//         onConfirm={handleConfirmDelete}
//         loading={loading}
//       />
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import {
  UserTable,
  UserDialog,
  ConfirmDelete,
} from "@/features/users/components";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { User } from "@/features/users/types/user.types";

export interface UserFiltersState {
  search: string;
  role?: string | "all";
  isVerified?: boolean | "all";
}

export default function UsersPage() {
  const {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [filters, setFilters] = useState<UserFiltersState>({
    search: "",
    role: "all",
    isVerified: "all",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchUsers]);

  const handleCreate = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingUserId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletingUserId) {
      await deleteUser(deletingUserId);
      setDeletingUserId(null);
      await fetchUsers(filters); // 👈 refetch with current filters
    }
  };

  const handleFormSubmit = async (values: Partial<User>) => {
    const success = editingUser
      ? await updateUser(editingUser.id, values)
      : await createUser(values);

    if (success) {
      setIsDialogOpen(false);
      await fetchUsers(filters); // 👈 refetch with current filters
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage system users, roles, and permissions.
        </p>
      </div>

      <UserTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        filters={filters}
        onFilterChange={setFilters}
        onAddUser={handleCreate}
      />

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialValues={editingUser || undefined}
        onSubmit={handleFormSubmit}
        loading={loading}
        isEdit={!!editingUser}
      />

      <ConfirmDelete
        open={!!deletingUserId}
        onOpenChange={(open) => !open && setDeletingUserId(null)}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}