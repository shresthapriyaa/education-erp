export interface SchoolDTO {
  id:           string;
  name:         string;
  address:      string | null;
  latitude:     number;
  longitude:    number;
  radiusMeters: number;
  createdAt:    string;
  _count?: {
    zones:    number;
    sessions: number;
  };
}

export interface SchoolFormValues {
  name:         string;
  address:      string;
  latitude:     string;
  longitude:    string;
  radiusMeters: string;
}

export interface SchoolFormErrors {
  name?:         string;
  latitude?:     string;
  longitude?:    string;
  radiusMeters?: string;
}