import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/error.js";
import type { RegisterInput } from "./schema.js";


export async function registerGym(input: RegisterInput) {
  const { user, organization } = input;

  const existingOrganization = await prisma.organization.findUnique({
    where: { slug: organization.slug },
    select: { id: true },
  });
  if (existingOrganization) {
    throw ApiError.conflict("Organization slug already exists.");
  }

  const { response: signUp, headers } = await auth.api.signUpEmail({
    body: { name: user.name, email: user.email, password: user.password },
    returnHeaders: true,
  });

  if (!signUp.user) {
    throw ApiError.internal("Failed to create user.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: organization.name, slug: organization.slug },
        select: { id: true },
      });

      await tx.member.create({
        data: { organizationId: org.id, userId: signUp.user.id, role: "ADMIN" },
      });
    });

    return { user: signUp.user, token: signUp.token, headers };

  } catch (error) {
    await prisma.user.delete({ where: { id: signUp.user.id } }).catch(() => {});
    throw error;
  }
}
