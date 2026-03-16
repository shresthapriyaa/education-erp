// // features/grades/services/grade.api.ts
// import { Grade } from "@/generated/prisma/browser";
// import axios from "axios";


// type GradePayload = Partial<Grade> & { studentId?: string; assignmentId?: string };

// export const gradeApi = {
//   getAll: async (filters?: { search?: string }) => {
//     const params = new URLSearchParams();
//     if (filters?.search) params.append("search", filters.search);
//     const res = await axios.get(`/api/grades?${params.toString()}`);
//     return res.data;
//   },
//   create: async (data: GradePayload) => {
//     const res = await axios.post("/api/grades", data);
//     return res.data;
//   },
//   update: async (id: string, data: GradePayload) => {
//     const res = await axios.put(`/api/grades/${id}`, data);
//     return res.data;
//   },
//   patch: async (id: string, data: GradePayload) => {
//     const res = await axios.patch(`/api/grades/${id}`, data);
//     return res.data;
//   },
//   delete: async (id: string) => {
//     const res = await axios.delete(`/api/grades/${id}`);
//     return res.data;
//   },
// };



import axios from "axios";
import type { GradePayload } from "../components/GradeForm";

export const gradeApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/grades?${params.toString()}`);
    return res.data;
  },
  create: async (data: GradePayload) => {
    const res = await axios.post("/api/grades", data);
    return res.data;
  },
  update: async (id: string, data: GradePayload) => {
    const res = await axios.put(`/api/grades/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: GradePayload) => {
    const res = await axios.patch(`/api/grades/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/grades/${id}`);
    return res.data;
  },
};