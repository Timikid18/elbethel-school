import "dotenv/config";
import * as fs from "node:fs";
import * as path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SOURCE_DIR = path.join(process.cwd(), "public", "Elbie lesson note");

const SMALL_WORDS = new Set(["and", "of", "the", "for", "a", "an", "in", "on", "to"]);

function titleCase(input: string): string {
  return input
    .toLowerCase()
    .split(" ")
    .map((word, index, arr) => {
      if (index !== 0 && index !== arr.length - 1 && SMALL_WORDS.has(word)) return word;
      if (!word) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/\(\w/g, (m) => `(${m[1].toUpperCase()}`);
}

function extractSubject(fileName: string): string {
  let base = fileName.replace(/\.pdf$/i, "");
  base = base.replace(/\s*\(\d+\)\s*$/i, "");
  base = base.replace(/\s*LESSON NOTES?$/i, "");
  base = base.replace(
    /^(PRENURSERY|NURSERY\s+[1-3]|PRIMARY\s+[1-6]|GRADE\s+[1-6]|JSS\s+[1-3]|SSS\s+[1-3]|CLASS\s+[1-9]|BASIC\s+[1-9])\s+/i,
    "",
  );
  base = base.replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
  return base ? titleCase(base) : base;
}

function inferDivision(className: string): string {
  const upper = className.toUpperCase();
  if (/JSS|SSS|SENIOR|JUNIOR/.test(upper)) return "Secondary";
  if (/NURSERY|PRE/i.test(className)) return "EarlyYears";
  if (/GRADE|PRIMARY|BASIC/.test(upper)) return "Primary";
  return "Primary";
}

async function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((folder) =>
      fs
        .readdirSync(path.join(SOURCE_DIR, folder.name))
        .filter((file) => /\.pdf$/i.test(file))
        .map((file) => ({ folder: folder.name, file })),
    );

  console.log(`Found ${files.length} PDF files across ${new Set(files.map((f) => f.folder)).size} classes.`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const { folder, file } of files) {
    try {
      const fileName = file;
      const className = folder;
      const subject = extractSubject(fileName);
      const filePath = path.join(SOURCE_DIR, folder, file);
      const fileData = fs.readFileSync(filePath);
      const fileSize = fileData.length;

      if (!subject) {
        console.warn(`  ! Skipping ${folder}/${file}: could not derive a subject.`);
        failed += 1;
        continue;
      }

      const existing = await prisma.lessonNote.findFirst({
        where: { className, fileName },
        select: { id: true, subject: true, division: true, title: true },
      });

      if (existing) {
        if (existing.subject !== subject) {
          await prisma.lessonNote.update({
            where: { id: existing.id },
            data: {
              subject,
              title: `${subject} — Lesson Notes`,
              division: inferDivision(className),
            },
          });
          console.log(`  ~ ${className} / ${subject} (re-derived subject)`);
        } else {
          console.log(`  = ${className} / ${subject} (already imported)`);
        }
        skipped += 1;
        continue;
      }

      await prisma.lessonNote.create({
        data: {
          className,
          division: inferDivision(className),
          subject,
          title: `${subject} — Lesson Notes`,
          fileName,
          contentType: "application/pdf",
          fileSize,
          fileData,
        },
      });
      created += 1;
      console.log(`  + ${className} / ${subject} (${(fileSize / 1024).toFixed(0)} KB)`);
    } catch (err) {
      failed += 1;
      console.error(`  x Failed ${folder}/${file}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone. Created: ${created}, skipped: ${skipped}, failed: ${failed}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });