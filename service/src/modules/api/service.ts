import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/error.js";
import { logger } from "../../lib/logger.js";

export const LEAD_CAPTURE_PERMISSIONS = { leads: ["create"] };
const KEY_PREFIX = "glh";

export async function findActiveKey(organizationId: string) {
  const apiKey = await prisma.apiKey.findFirst({
    where: { organizationId, enabled: true },
    select: { id: true, name: true, prefix: true, start: true, createdAt: true },
  });
  return apiKey
}

export async function createApiKey(organizationId: string, userId: string, name: string) {
  const existing = await findActiveKey(organizationId);
  if (existing) {
    throw ApiError.conflict("An API key already exists. Rotate it to generate a new one.");
  }

  const apiKey = await auth.api.createApiKey({
    body: {
      organizationId,
      userId,
      name,
      prefix: KEY_PREFIX,
      permissions: LEAD_CAPTURE_PERMISSIONS,
    },
  });

  try {
    await prisma.apiKey.update({ where: { id: apiKey.id }, data: { organizationId } });
  } catch (error) {
    await prisma.apiKey.delete({ where: { id: apiKey.id } }).catch(() => {});
    throw error;
  }

  logger.info({ organizationId, userId }, "Created public capture API key");

  return { key: apiKey.key, id: apiKey.id, prefix: apiKey.prefix, start: apiKey.start };
}

export async function rotateApiKey(organizationId: string, userId: string, name: string) {
  await prisma.apiKey.updateMany({
    where: { organizationId, enabled: true },
    data: { enabled: false },
  });

  const apiKey = await auth.api.createApiKey({
    body: {
      organizationId,
      userId,
      name,
      prefix: KEY_PREFIX,
      permissions: LEAD_CAPTURE_PERMISSIONS,
    },
  });

  try {
    await prisma.apiKey.update({ where: { id: apiKey.id }, data: { organizationId } });
  } catch (error) {
    await prisma.apiKey.delete({ where: { id: apiKey.id } }).catch(() => {});
    throw error;
  }

  logger.info({ organizationId, userId }, "Rotated public capture API key");

  return { key: apiKey.key, id: apiKey.id, prefix: apiKey.prefix, start: apiKey.start };
}