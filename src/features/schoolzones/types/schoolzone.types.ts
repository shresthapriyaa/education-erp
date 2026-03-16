export interface SchoolZone {
  id: string;
  schoolId: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    name: string;
  };
}

export type SchoolZonePayload = Partial<SchoolZone>;
