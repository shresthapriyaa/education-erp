// import axios from "axios";
// import type { SessionDTO, SessionFormValues } from "../types/session.types";

// const BASE = "/api/sessions";

// export async function fetchSessions(params?: {
//   classId?:  string;
//   schoolId?: string;
//   open?:     boolean;
// }): Promise<SessionDTO[]> {
//   const search = new URLSearchParams();
//   if (params?.classId)             search.set("classId",  params.classId);
//   if (params?.schoolId)            search.set("schoolId", params.schoolId);
//   if (params?.open !== undefined)  search.set("open",     String(params.open));
//   const { data } = await axios.get<SessionDTO[]>(`${BASE}?${search}`);
//   return data;
// }

// export async function createSession(values: SessionFormValues): Promise<SessionDTO> {
//   const { data } = await axios.post<SessionDTO>(BASE, values);
//   return data;
// }

// export async function updateSession(
//   id: string,
//   values: Partial<SessionFormValues>
// ): Promise<SessionDTO> {
//   const { data } = await axios.patch<SessionDTO>(`${BASE}/${id}`, values);
//   return data;
// }

// export async function toggleSession(id: string, isOpen: boolean): Promise<SessionDTO> {
//   const { data } = await axios.patch<SessionDTO>(`${BASE}/${id}`, { isOpen });
//   return data;
// }

// export async function deleteSession(id: string): Promise<void> {
//   await axios.delete(`${BASE}/${id}`);
// }





import axios from "axios";
import type { SessionDTO, SessionFormValues } from "../types/session.types";

const BASE = "/api/sessions";

export async function fetchSessions(params?: {
  classId?:  string;
  schoolId?: string;
  open?:     boolean;
}): Promise<SessionDTO[]> {
  const search = new URLSearchParams();
  if (params?.classId)            search.set("classId",  params.classId);
  if (params?.schoolId)           search.set("schoolId", params.schoolId);
  if (params?.open !== undefined) search.set("open",     String(params.open));
  const { data } = await axios.get<{ sessions: SessionDTO[] }>(`${BASE}?${search}`);
  return data.sessions ?? [];
}

export async function createSession(values: SessionFormValues): Promise<SessionDTO> {
  const { data } = await axios.post<SessionDTO>(BASE, values);
  return data;
}

export async function updateSession(
  id: string,
  values: Partial<SessionFormValues>
): Promise<SessionDTO> {
  const { data } = await axios.patch<SessionDTO>(`${BASE}/${id}`, values);
  return data;
}

export async function toggleSession(id: string, isOpen: boolean): Promise<SessionDTO> {
  const { data } = await axios.patch<SessionDTO>(`${BASE}/${id}`, { isOpen });
  return data;
}

export async function deleteSession(id: string): Promise<void> {
  await axios.delete(`${BASE}/${id}`);
}
