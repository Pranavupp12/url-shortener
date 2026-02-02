import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Debugging: Print URL (masked) to prove it loaded
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in .env file");
  } else {
    console.log("🔌 Connected to:", process.env.DATABASE_URL.substring(0, 15) + "...");
  }

  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  // 2. Create ADMIN User
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  // 3. Create EMPLOYEE User
  const employee = await prisma.user.upsert({
    where: { username: 'editor' },
    update: {},
    create: {
      username: 'editor',
      password: hashedPassword,
      role: Role.EMPLOYEE,
    },
  })

  // 4. Ensure Settings Exist
  const settings = await prisma.adminSettings.findFirst()
  if (!settings) {
    await prisma.adminSettings.create({
      data: { adRedirectUrl: 'https://google.com' }
    })
  }

  console.log(`✅ Users created successfully!`)
  console.log(`   - Admin: ${admin.username}`)
  console.log(`   - Employee: ${employee.username}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })