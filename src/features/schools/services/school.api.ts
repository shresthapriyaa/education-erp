import axios from "axios";
import type { SchoolDTO, SchoolFormValues } from "../types/school.types";

const BASE = "/api/schools";

export async function fetchSchools(search = ""): Promise<SchoolDTO[]> {
  const { data } = await axios.get<SchoolDTO[]>(`${BASE}?search=${search}`);
  return data;
}

export async function createSchool(values: SchoolFormValues): Promise<SchoolDTO> {
  const { data } = await axios.post<SchoolDTO>(BASE, {
    name:         values.name.trim(),
    address:      values.address.trim() || null,
    latitude:     Number(values.latitude),
    longitude:    Number(values.longitude),
    radiusMeters: Number(values.radiusMeters) || 200,
  });
  return data;
}

export async function updateSchool(id: string, values: Partial<SchoolFormValues>): Promise<SchoolDTO> {
  const { data } = await axios.patch<SchoolDTO>(`${BASE}/${id}`, {
    ...(values.name         !== undefined && { name:         values.name.trim() }),
    ...(values.address      !== undefined && { address:      values.address.trim() || null }),
    ...(values.latitude     !== undefined && { latitude:     Number(values.latitude) }),
    ...(values.longitude    !== undefined && { longitude:    Number(values.longitude) }),
    ...(values.radiusMeters !== undefined && { radiusMeters: Number(values.radiusMeters) }),
  });
  return data;
}

export async function deleteSchool(id: string): Promise<void> {
  await axios.delete(`${BASE}/${id}`);
}