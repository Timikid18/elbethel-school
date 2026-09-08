import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const rl = createInterface({ input: stdin, output: stdout });

function ask(question: string): Promise<string> {
  return rl.question(question);
}

async function main() {
  const email =
    (process.env.CREATE_ADMIN_EMAIL ?? (await ask("Admin email: "))).trim().toLowerCase();
  const password =
    process.env.CREATE_ADMIN_PASSWORD ?? (await ask("Password (min 8 chars): "));
  const fullName =
    (process.env.CREATE_ADMIN_NAME ?? (await ask("Full name: "))).trim() || "School Administrator";

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    console.error("Invalid email address.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error(`A user with email ${email} already exists.`);
    process.exit(1);
  }

  const role = (process.env.CREATE_ADMIN_ROLE ?? (await ask("Role (ADMIN or SUPER_ADMIN) [SUPER_ADMIN]: "))).trim().toUpperCase() || "SUPER_ADMIN";
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    console.error('Role must be ADMIN or SUPER_ADMIN.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, fullName, role },
  });

  console.log(`\nCreated ${role} account:`);
  console.log(`  email: ${user.email}`);
  console.log(`  name:  ${user.fullName}`);
  console.log("You can sign in at /login now.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });