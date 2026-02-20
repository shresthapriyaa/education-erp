import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { User } from "../types/user.types";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(async (filters?: any) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters?.search) params.append("search", filters.search);
            if (filters?.role && filters.role !== "all") params.append("role", filters.role);
            if (filters?.isVerified && filters.isVerified !== "all") params.append("isVerified", filters.isVerified);

            const res = await axios.get(`/api/users?${params.toString()}`);
            setUsers(res.data);
        } catch (err: any) {
            console.error("Error fetching users:", err);
            toast.error(err?.response?.data?.error || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = async (data: Partial<User>) => {
        try {
            setLoading(true);
            await axios.post("/api/users", data);
            toast.success("User created successfully");
            await fetchUsers();
            return true;
        } catch (err: any) {
            console.error("Error creating user:", err);
            toast.error(err?.response?.data?.error || "Failed to create user");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id: string, data: Partial<User>) => {
        try {
            setLoading(true);
            await axios.put(`/api/users/${id}`, data);
            toast.success("User updated successfully");
            await fetchUsers();
            return true;
        } catch (err: any) {
            console.error("Error updating user:", err);
            toast.error(err?.response?.data?.error || "Failed to update user");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        try {
            setLoading(true);
            await axios.delete(`/api/users/${id}`);
            toast.success("User deleted successfully");
            setUsers((prev) => prev.filter((u) => u.id !== id));
            return true;
        } catch (err: any) {
            console.error("Error deleting user:", err);
            toast.error(err?.response?.data?.error || "Failed to delete user");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
    };
}
