export interface User {
  id: number;
  email: string;
  is_verified: boolean;
  full_name?: string | null;
}
