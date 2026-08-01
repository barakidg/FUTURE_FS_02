import type { auth } from "../lib/auth.js";
import type {
  Member,
  Organization,
  SystemRole,
} from "../generated/prisma/client.js";

type AuthSession = typeof auth.$Infer.Session;

type AuthenticatedUser =
  Omit<AuthSession["user"], "role"> & {
    role: SystemRole | null;
  };

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      session?: AuthSession["session"];
      member?: Member;
      organization?: Organization;
    }
  }
}

export {};