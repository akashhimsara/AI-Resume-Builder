import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@airesumebuilder.dev";
const TEST_USER_EMAIL = "user@airesumebuilder.dev";
const SAMPLE_RESUME_SLUG = "senior-full-stack-engineer";

async function upsertUsers() {
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 12);
  const testPasswordHash = await bcrypt.hash("User@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      fullName: "System Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
    create: {
      email: ADMIN_EMAIL,
      fullName: "System Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: TEST_USER_EMAIL },
    update: {
      fullName: "Ava Fernando",
      role: "USER",
      passwordHash: testPasswordHash,
    },
    create: {
      email: TEST_USER_EMAIL,
      fullName: "Ava Fernando",
      role: "USER",
      passwordHash: testPasswordHash,
    },
  });

  return { admin, testUser };
}

async function upsertSubscriptions(adminUserId: string, testUserId: string) {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.subscription.upsert({
    where: { userId: adminUserId },
    update: {
      plan: "PRO",
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: nextMonth,
      cancelAtPeriodEnd: false,
    },
    create: {
      userId: adminUserId,
      plan: "PRO",
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: nextMonth,
      cancelAtPeriodEnd: false,
    },
  });

  await prisma.subscription.upsert({
    where: { userId: testUserId },
    update: {
      plan: "FREE",
      status: "ACTIVE",
    },
    create: {
      userId: testUserId,
      plan: "FREE",
      status: "ACTIVE",
    },
  });
}

async function createSampleResume(testUserId: string) {
  await prisma.resume.deleteMany({
    where: {
      userId: testUserId,
      slug: SAMPLE_RESUME_SLUG,
    },
  });

  const resume = await prisma.resume.create({
    data: {
      userId: testUserId,
      title: "Senior Full Stack Engineer Resume",
      slug: SAMPLE_RESUME_SLUG,
      isArchived: false,
    },
  });

  const resumeVersion = await prisma.resumeVersion.create({
    data: {
      resumeId: resume.id,
      versionNumber: 1,
      headline: "Senior Full Stack Engineer | Next.js, Node.js, PostgreSQL",
      professionalSummary:
        "Results-driven full stack engineer with 7+ years building SaaS platforms. Strong track record in scaling systems, improving product velocity, and mentoring teams.",
      contentJson: {
        theme: "modern-clean",
        language: "en",
      },
      notes: "Seeded sample data for local development and UI testing.",
    },
  });

  await prisma.workExperience.createMany({
    data: [
      {
        resumeVersionId: resumeVersion.id,
        company: "Nimbus Labs",
        role: "Senior Full Stack Engineer",
        location: "Remote",
        employmentType: "Full-time",
        startDate: new Date("2022-01-10"),
        endDate: null,
        isCurrent: true,
        description: "Led development of a multi-tenant resume optimization product.",
        achievements: [
          "Reduced API latency by 38% via query optimization and cache layering.",
          "Introduced CI/CD quality gates, lowering production defects by 42%.",
          "Mentored 4 junior engineers and formalized code review standards.",
        ],
        sortOrder: 1,
      },
      {
        resumeVersionId: resumeVersion.id,
        company: "PixelForge",
        role: "Software Engineer",
        location: "Colombo, Sri Lanka",
        employmentType: "Full-time",
        startDate: new Date("2019-04-01"),
        endDate: new Date("2021-12-20"),
        isCurrent: false,
        description: "Built internal tools and client-facing web apps for SaaS customers.",
        achievements: [
          "Delivered 3 core modules on time for enterprise clients.",
          "Improved test coverage from 32% to 78% across core services.",
        ],
        sortOrder: 2,
      },
    ],
  });

  await prisma.education.createMany({
    data: [
      {
        resumeVersionId: resumeVersion.id,
        institution: "University of Moratuwa",
        degree: "BSc in Information Technology",
        fieldOfStudy: "Software Engineering",
        location: "Moratuwa, Sri Lanka",
        startDate: new Date("2015-01-01"),
        endDate: new Date("2018-12-31"),
        grade: "Second Class Upper",
        description: "Focused on distributed systems, data structures, and software architecture.",
        sortOrder: 1,
      },
    ],
  });

  await prisma.skill.createMany({
    data: [
      {
        resumeVersionId: resumeVersion.id,
        name: "TypeScript",
        category: "Programming",
        proficiency: 5,
        yearsOfExperience: 6,
        sortOrder: 1,
      },
      {
        resumeVersionId: resumeVersion.id,
        name: "Next.js",
        category: "Frontend",
        proficiency: 5,
        yearsOfExperience: 4,
        sortOrder: 2,
      },
      {
        resumeVersionId: resumeVersion.id,
        name: "PostgreSQL",
        category: "Database",
        proficiency: 4,
        yearsOfExperience: 5,
        sortOrder: 3,
      },
      {
        resumeVersionId: resumeVersion.id,
        name: "Prisma",
        category: "ORM",
        proficiency: 4,
        yearsOfExperience: 3,
        sortOrder: 4,
      },
      {
        resumeVersionId: resumeVersion.id,
        name: "AWS",
        category: "Cloud",
        proficiency: 4,
        yearsOfExperience: 4,
        sortOrder: 5,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        resumeVersionId: resumeVersion.id,
        title: "AI Resume Builder SaaS",
        role: "Lead Engineer",
        description:
          "Designed and implemented a resume platform with AI-assisted writing, billing, and role-based access.",
        technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "OpenAI"],
        projectUrl: "https://example.com/ai-resume-builder",
        repositoryUrl: "https://github.com/example/ai-resume-builder",
        startDate: new Date("2024-03-01"),
        endDate: null,
        sortOrder: 1,
      },
      {
        resumeVersionId: resumeVersion.id,
        title: "Observability Dashboard",
        role: "Full Stack Engineer",
        description:
          "Built a centralized metrics and alerts dashboard for engineering and support teams.",
        technologies: ["React", "Node.js", "PostgreSQL", "Grafana"],
        projectUrl: "https://example.com/ops-dashboard",
        repositoryUrl: null,
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-11-30"),
        sortOrder: 2,
      },
    ],
  });

  await prisma.certification.createMany({
    data: [
      {
        resumeVersionId: resumeVersion.id,
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        credentialId: "AWS-DEV-123456",
        credentialUrl: "https://www.credly.com/",
        issueDate: new Date("2023-06-01"),
        expirationDate: new Date("2026-06-01"),
        doesNotExpire: false,
        sortOrder: 1,
      },
    ],
  });

  await prisma.aIGeneration.createMany({
    data: [
      {
        userId: testUserId,
        resumeId: resume.id,
        resumeVersionId: resumeVersion.id,
        generationType: "RESUME_DRAFT",
        status: "SUCCESS",
        model: "gpt-4.1-mini",
        prompt: "Generate an ATS-friendly draft for a senior full stack engineer role.",
        response: "Generated a concise resume draft with quantified achievements.",
        inputTokens: 1240,
        outputTokens: 860,
        durationMs: 2800,
      },
      {
        userId: testUserId,
        resumeId: resume.id,
        resumeVersionId: resumeVersion.id,
        generationType: "BULLET_IMPROVEMENT",
        status: "FAILED",
        model: "gpt-4.1-mini",
        prompt: "Improve the second work experience bullets for impact and clarity.",
        response: null,
        inputTokens: 330,
        outputTokens: null,
        errorMessage: "Rate limited during local development test.",
        durationMs: 600,
      },
    ],
  });

  return { resume, resumeVersion };
}

async function createSamplePayment(adminUserId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: adminUserId },
  });

  if (!subscription) {
    throw new Error("Admin subscription not found while creating sample payment");
  }

  await prisma.payment.upsert({
    where: { providerPaymentId: "pi_seed_admin_pro" },
    update: {
      userId: adminUserId,
      subscriptionId: subscription.id,
      amount: 2900,
      currency: "usd",
      status: "SUCCEEDED",
      provider: "stripe",
      providerInvoiceId: "in_seed_admin_pro",
      paidAt: new Date(),
      metadata: {
        note: "Seeded payment for local billing UI testing",
      },
    },
    create: {
      userId: adminUserId,
      subscriptionId: subscription.id,
      amount: 2900,
      currency: "usd",
      status: "SUCCEEDED",
      provider: "stripe",
      providerPaymentId: "pi_seed_admin_pro",
      providerInvoiceId: "in_seed_admin_pro",
      paidAt: new Date(),
      metadata: {
        note: "Seeded payment for local billing UI testing",
      },
    },
  });
}

async function main() {
  const { admin, testUser } = await upsertUsers();
  await upsertSubscriptions(admin.id, testUser.id);
  const { resume } = await createSampleResume(testUser.id);
  await createSamplePayment(admin.id);

  console.log("Seeding complete.");
  console.log(`Admin user: ${ADMIN_EMAIL} / Admin@12345`);
  console.log(`Test user: ${TEST_USER_EMAIL} / User@12345`);
  console.log(`Sample resume created: ${resume.title}`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
