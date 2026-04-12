import type { Routine } from "../types/routine.types";

type RoutinePayload = Partial<Routine>;

const BASE = "/api/routines";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.message ?? "Something went wrong");
  }
  return res.json();
}

export const routineService = {
  getAll: (): Promise<Routine[]> =>
    fetch(BASE).then((r) => handleResponse<Routine[]>(r)),

  getById: (id: string): Promise<Routine> =>
    fetch(`${BASE}/${id}`).then((r) => handleResponse<Routine>(r)),

  create: (payload: RoutinePayload): Promise<Routine> =>
    fetch(BASE, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    }).then((r) => handleResponse<Routine>(r)),

  update: (id: string, payload: RoutinePayload): Promise<Routine> =>
    fetch(`${BASE}/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    }).then((r) => handleResponse<Routine>(r)),

  delete: (id: string): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: "DELETE" }).then((r) =>
      handleResponse<void>(r)
    ),
};