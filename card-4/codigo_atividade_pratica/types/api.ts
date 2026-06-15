export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  error: string;
  status?: number;
}

export interface RawgApiResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}
