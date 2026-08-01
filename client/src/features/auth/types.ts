export type SystemRole = "SUPER_ADMIN" | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  user: { name: string; email: string; password: string };
  organization: { name: string; slug: string };
}

export function isSuperAdmin(user: AuthUser | null): boolean {
  return user?.role === "SUPER_ADMIN";
}

