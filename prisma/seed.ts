import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding EL-BETH-EL database...");

  const password = await bcrypt.hash("Password123!", 12);

  // ---------- SUPER ADMIN ----------
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@elbethel.edu" },
    update: {},
    create: {
      email: "admin@elbethel.edu",
      passwordHash: password,
      fullName: "Mrs. Sarah Adewale",
      role: "SUPER_ADMIN",
      phone: "+234 801 234 5678",
    },
  });

  // ---------- ACADEMIC SESSION & TERMS ----------
  let sessionRecord = await prisma.academicSession.findFirst({
    where: { isCurrent: true },
  });
  if (!sessionRecord) {
    sessionRecord = await prisma.academicSession.create({
      data: {
        name: "2026 / 2027 Session",
        startDate: new Date("2026-09-07"),
        endDate: new Date("2027-07-30"),
        isCurrent: true,
      },
    });
  }

  let term = await prisma.term.findFirst({
    where: { sessionId: sessionRecord.id, isCurrent: true },
  });
  if (!term) {
    term = await prisma.term.create({
      data: {
        sessionId: sessionRecord.id,
        type: "FIRST",
        name: "First Term",
        startDate: new Date("2026-09-07"),
        endDate: new Date("2026-12-18"),
        isCurrent: true,
      },
    });
  }

  // ---------- CLASSES ----------
  const classes: Record<string, string> = {};
  const classNames = [
    { name: "Nursery 1", level: "1", division: "EarlyYears" },
    { name: "Nursery 2", level: "2", division: "EarlyYears" },
    { name: "KG 1", level: "3", division: "EarlyYears" },
    { name: "KG 2", level: "4", division: "EarlyYears" },
    { name: "Grade 1", level: "1", division: "Primary" },
    { name: "Grade 2", level: "2", division: "Primary" },
    { name: "Grade 3", level: "3", division: "Primary" },
    { name: "Grade 4", level: "4", division: "Primary" },
    { name: "Grade 5", level: "5", division: "Primary" },
    { name: "Grade 6", level: "6", division: "Primary" },
    { name: "JSS 1", level: "1", division: "Secondary" },
    { name: "JSS 2", level: "2", division: "Secondary" },
    { name: "JSS 3", level: "3", division: "Secondary" },
    { name: "SSS 1", level: "1", division: "Secondary" },
    { name: "SSS 2", level: "2", division: "Secondary" },
    { name: "SSS 3", level: "3", division: "Secondary" },
  ];

  for (const c of classNames) {
    const existing = await prisma.class.findFirst({ where: { name: c.name } });
    if (existing) {
      classes[c.name] = existing.id;
    } else {
      const created = await prisma.class.create({ data: c });
      classes[c.name] = created.id;
    }
  }

  // ---------- SUBJECTS ----------
  const subjects: Record<string, string> = {};
  const subjectList = [
    { name: "Mathematics", code: "MATH" },
    { name: "English Language", code: "ENG" },
    { name: "Basic Science", code: "SCI" },
    { name: "Social Studies", code: "SOC" },
    { name: "Computer Studies", code: "COM" },
    { name: "Religious Knowledge", code: "REL" },
    { name: "Creative Arts", code: "ART" },
    { name: "Physical Education", code: "PE" },
  ];
  for (const s of subjectList) {
    const existing = await prisma.subject.findUnique({ where: { code: s.code } });
    if (existing) {
      subjects[s.name] = existing.id;
    } else {
      const created = await prisma.subject.create({ data: s });
      subjects[s.name] = created.id;
    }
  }

  // Link subjects to all secondary classes
  for (const cName of ["JSS 1", "JSS 2", "SSS 1", "Grade 5", "Grade 6"]) {
    const classId = classes[cName];
    if (!classId) continue;
    for (const sName of ["Mathematics", "English Language", "Basic Science"]) {
      const subjectId = subjects[sName];
      if (!subjectId) continue;
      await prisma.classSubject.upsert({
        where: { classId_subjectId: { classId, subjectId } },
        update: {},
        create: { classId, subjectId },
      });
    }
  }

  // ---------- TEACHER ----------
  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@elbethel.edu" },
    update: {},
    create: {
      email: "teacher@elbethel.edu",
      passwordHash: password,
      fullName: "Mr. Emeka Obi",
      role: "TEACHER",
      phone: "+234 802 345 6789",
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: { email: "teacher@elbethel.edu" },
    update: { userId: teacherUser.id },
    create: {
      userId: teacherUser.id,
      firstName: "Emeka",
      lastName: "Obi",
      email: "teacher@elbethel.edu",
      phone: "+234 802 345 6789",
      designation: "Mathematics Teacher",
      staffId: "TCH-001",
      isActive: true,
    },
  });

  // Set class teacher for a class
  await prisma.class.update({
    where: { id: classes["Grade 5"] },
    data: { classTeacherId: teacher.id },
  });

  // Assign subject to teacher
  await prisma.subjectTeacher.upsert({
    where: { subjectId_teacherId: { subjectId: subjects["Mathematics"], teacherId: teacher.id } },
    update: { classId: classes["Grade 5"] },
    create: { subjectId: subjects["Mathematics"], teacherId: teacher.id, classId: classes["Grade 5"] },
  });

  // ---------- STUDENT + PARENT ----------
  const studentUser = await prisma.user.upsert({
    where: { email: "student@elbethel.edu" },
    update: {},
    create: {
      email: "student@elbethel.edu",
      passwordHash: password,
      fullName: "Adeola Adewale",
      role: "STUDENT",
    },
  });

  const student = await prisma.student.upsert({
    where: { admissionNumber: "ELB/2026/0001" },
    update: { userId: studentUser.id },
    create: {
      userId: studentUser.id,
      admissionNumber: "ELB/2026/0001",
      firstName: "Adeola",
      lastName: "Adewale",
      gender: "Female",
      dateOfBirth: new Date("2014-04-12"),
      classId: classes["Grade 5"],
      address: "12 Unity Road, Ikeja, Lagos",
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { email: "parent@elbethel.edu" },
    update: {},
    create: {
      email: "parent@elbethel.edu",
      passwordHash: password,
      fullName: "Mr. Tunji Adewale",
      role: "PARENT",
      phone: "+234 803 456 7890",
    },
  });

  const parent = await prisma.parentProfile.upsert({
    where: { email: "parent@elbethel.edu" },
    update: { userId: parentUser.id },
    create: {
      userId: parentUser.id,
      firstName: "Tunji",
      lastName: "Adewale",
      email: "parent@elbethel.edu",
      phone: "+234 803 456 7890",
      occupation: "Entrepreneur",
      address: "12 Unity Road, Ikeja, Lagos",
    },
  });

  await prisma.parentChild.upsert({
    where: { parentId_studentId: { parentId: parent.id, studentId: student.id } },
    update: {},
    create: { parentId: parent.id, studentId: student.id },
  });

  // ---------- SECOND STUDENT ----------
  const student2User = await prisma.user.upsert({
    where: { email: "student2@elbethel.edu" },
    update: {},
    create: {
      email: "student2@elbethel.edu",
      passwordHash: password,
      fullName: "Chinedu Okoye",
      role: "STUDENT",
    },
  });

  const student2 = await prisma.student.upsert({
    where: { admissionNumber: "ELB/2026/0002" },
    update: { userId: student2User.id },
    create: {
      userId: student2User.id,
      admissionNumber: "ELB/2026/0002",
      firstName: "Chinedu",
      lastName: "Okoye",
      gender: "Male",
      dateOfBirth: new Date("2015-08-20"),
      classId: classes["Grade 5"],
      address: "5 Peace Avenue, Surulere, Lagos",
    },
  });

  const parent2 = await prisma.parentProfile.upsert({
    where: { email: "okoye@elbethel.edu" },
    update: {},
    create: {
      firstName: "Ngozi",
      lastName: "Okoye",
      email: "okoye@elbethel.edu",
      phone: "+234 804 567 8901",
      occupation: "Nurse",
    },
  });

  await prisma.parentChild.upsert({
    where: { parentId_studentId: { parentId: parent2.id, studentId: student2.id } },
    update: {},
    create: { parentId: parent2.id, studentId: student2.id },
  });

  // ---------- ATTENDANCE (last 10 school days) ----------
  const schoolDays = 10;
  const today = new Date();
  for (let i = 1; i <= schoolDays; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    d.setHours(8, 0, 0, 0);
    for (const st of [student, student2]) {
      const status = i % 7 === 0 ? "ABSENT" : i % 5 === 0 ? "LATE" : "PRESENT";
      try {
        await prisma.attendance.upsert({
          where: { studentId_date: { studentId: st.id, date: d } },
          update: { status },
          create: {
            studentId: st.id,
            classId: st.classId!,
            date: d,
            status,
            recordedById: teacher.userId!,
          },
        });
      } catch {}
    }
  }

  // ---------- RESULTS (for student) ----------
  const existingResult = await prisma.result.findUnique({
    where: { studentId_termId: { studentId: student.id, termId: term.id } },
  });
  if (!existingResult) {
    const result = await prisma.result.create({
      data: {
        studentId: student.id,
        termId: term.id,
        sessionId: sessionRecord.id,
        classId: classes["Grade 5"],
        status: "PUBLISHED",
        teacherId: teacher.id,
        publishedAt: new Date(),
        items: {
          create: [
            { subjectId: subjects["Mathematics"], score: 78, grade: "B", firstCa: 15, secondCa: 18, exam: 45, remark: "Good", position: 2 },
            { subjectId: subjects["English Language"], score: 85, grade: "A", firstCa: 19, secondCa: 16, exam: 50, remark: "Excellent", position: 1 },
            { subjectId: subjects["Basic Science"], score: 72, grade: "B", firstCa: 14, secondCa: 17, exam: 41, remark: "Good", position: 3 },
          ],
        },
      },
    });
    // add studentId on items
    await prisma.resultItem.updateMany({
      where: { resultId: result.id },
      data: { studentId: student.id },
    });
  }

  // ---------- ASSIGNMENTS ----------
  await prisma.assignment.upsert({
    where: { id: "seed-assignment-1" },
    update: {},
    create: {
      id: "seed-assignment-1",
      title: "Fractions Worksheet",
      description: "Complete questions 1 to 15 on fractions and submit before Friday.",
      subjectId: subjects["Mathematics"],
      classId: classes["Grade 5"],
      teacherId: teacher.id,
      dueDate: new Date(today.getTime() + 3 * 86400000),
    },
  });

  // ---------- ANNOUNCEMENTS ----------
  await prisma.announcement.upsert({
    where: { id: "seed-ann-1" },
    update: {},
    create: {
      id: "seed-ann-1",
      title: "Welcome Back to School",
      body: "We are excited to welcome all students and parents to the 2026/2027 academic session. May this be a fruitful year of learning and growth.",
      audience: "EVERYONE",
      isPinned: true,
      createdById: superAdmin.id,
    },
  });

  // ---------- CHANGE REQUESTS (demo for moderation) ----------
  await prisma.changeRequest.upsert({
    where: { id: "seed-request-1" },
    update: {},
    create: {
      id: "seed-request-1",
      entityType: "CLASS_ANNOUNCEMENT",
      actionType: "CREATE",
      summary: "Announcement for Grade 5: Parent-teacher conference",
      payload: {
        title: "Parent-Teacher Conference",
        body: "Parent-teacher conferences will hold on Friday in the Grade 5 classroom. Kindly arrive at the school office by 9am to be signed in.",
        classId: classes["Grade 5"],
        isPinned: false,
      },
      requesterId: teacherUser.id,
      status: "PENDING",
    },
  });

  // ---------- EVENTS ----------
  await prisma.event.upsert({
    where: { id: "seed-event-1" },
    update: {},
    create: {
      id: "seed-event-1",
      title: "Inter-House Sports Day",
      description: "A fun-filled day of athletics, games, and friendly competition across all houses.",
      location: "School Sports Field",
      startDate: new Date(today.getTime() + 18 * 86400000),
      type: "Sports",
      isPublic: true,
    },
  });

  // ---------- ADMISSIONS SAMPLES ----------
  const existingApp = await prisma.admissionApplication.findFirst({
    where: { applicationNo: "APP-2026-0001" },
  });
  if (!existingApp) {
    await prisma.admissionApplication.create({
      data: {
        applicationNo: "APP-2026-0001",
        firstName: "Zainab",
        lastName: "Bello",
        gender: "Female",
        classApplying: "Grade 1",
        parentFirstName: "Mallam",
        parentLastName: "Bello",
        parentPhone: "+234 805 000 1111",
        parentEmail: "bello@example.com",
        status: "UNDER_REVIEW",
      },
    });
  }

  console.log("Seed complete! 🎉");
  console.log("Demo accounts (password: Password123!):");
  console.log("  Super Admin : admin@elbethel.edu");
  console.log("  Teacher     : teacher@elbethel.edu");
  console.log("  Student     : student@elbethel.edu");
  console.log("  Parent      : parent@elbethel.edu");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
