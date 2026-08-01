import { auth } from "../src/lib/auth.js";
import { prisma } from "../src/lib/prisma.js";
import { logger } from "../src/lib/logger.js";
import { env } from "../src/lib/env.js";

async function main() {
  const email = env.SUPER_ADMIN_EMAIL;
  const password = env.SUPER_ADMIN_PASSWORD;

  logger.info("Starting database seed...");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    logger.info(`Super Admin ${email} already exists — skipping`);
    return;
  }

  const result = await auth.api.signUpEmail({
    body: { name: "Super Admin", email, password },
  });


await prisma.user.update({
    where: { id: result.user.id },
    data: { role: "SUPER_ADMIN" },
})

  logger.info(`Seeded Super Admin: ${email}`);
}

main()
    .catch((error) => {
        logger.error({ err: error }, "Database seed failed");
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

