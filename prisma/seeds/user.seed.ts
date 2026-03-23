import bcrypt from 'bcrypt';

export default async function userSeed(prisma) {
  const password = await bcrypt.hash('admin', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      fullname: 'Super Admin',
      username: 'admin',
      password,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}
