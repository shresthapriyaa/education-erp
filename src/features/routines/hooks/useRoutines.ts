import { useCallback, useState } from "react";
import type { Routine } from "../types/routine.types";
import { routineService } from "../services/routineService";

type RoutinePayload = Partial<Routine>;

interface UseRoutinesReturn {
  routines:      Routine[];
  loading:       boolean;
  error:         string | null;
  fetchRoutines: () => Promise<void>;
  createRoutine: (payload: RoutinePayload) => Promise<void>;
  updateRoutine: (id: string, payload: RoutinePayload) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
}

export function useRoutines(): UseRoutinesReturn {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const fetchRoutines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await routineService.getAll();
      setRoutines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch routines");
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoutine = useCallback(async (payload: RoutinePayload) => {
    setError(null);
    try {
      const created = await routineService.create(payload);
      setRoutines((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create routine");
      throw err; // re-throw so the form can react if needed
    }
  }, []);

  const updateRoutine = useCallback(async (id: string, payload: RoutinePayload) => {
    setError(null);
    try {
      const updated = await routineService.update(id, payload);
      setRoutines((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update routine");
      throw err;
    }
  }, []);

  const deleteRoutine = useCallback(async (id: string) => {
    setError(null);
    try {
      await routineService.delete(id);
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete routine");
      throw err;
    }
  }, []);

  return {
    routines,
    loading,
    error,
    fetchRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
  };
}