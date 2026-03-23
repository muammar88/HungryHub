export default async function restaurantsSeed(prisma, esService) {
  await prisma.menuItem.deleteMany();

  await prisma.restaurant.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Resto Nusantara',
      address: 'Jl. Sudirman No. 1',
      phone: '08123456789',
      opening_hours: '08:00 - 22:00',
      menuItems: {
        create: [
          {
            name: 'Nasi Goreng Spesial',
            description: 'Nasi goreng dengan telur dan ayam',
            price: 22000,
            category: 'main',
          },
          {
            name: 'Mie Goreng Jawa',
            description: 'Mie goreng khas Jawa',
            price: 20000,
            category: 'main',
          },
          {
            name: 'Ayam Bakar',
            description: 'Ayam bakar bumbu kecap',
            price: 30000,
            category: 'main',
          },
          {
            name: 'Es Teh Manis',
            description: 'Teh manis dingin',
            price: 5000,
            category: 'drink',
          },
          {
            name: 'Es Jeruk',
            description: 'Jeruk segar',
            price: 8000,
            category: 'drink',
          },
          {
            name: 'Kentang Goreng',
            description: 'Kentang crispy',
            price: 15000,
            category: 'appetizer',
          },
        ],
      },
    },
  });

  await prisma.restaurant.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Warung Sederhana',
      address: 'Jl. Merdeka No. 10',
      phone: '08234567890',
      opening_hours: '09:00 - 21:00',
      menuItems: {
        create: [
          {
            name: 'Ayam Penyet',
            description: 'Ayam goreng dengan sambal',
            price: 25000,
            category: 'main',
          },
          {
            name: 'Lele Goreng',
            description: 'Lele crispy',
            price: 20000,
            category: 'main',
          },
          {
            name: 'Nasi Uduk',
            description: 'Nasi uduk gurih',
            price: 15000,
            category: 'main',
          },
          {
            name: 'Jus Jeruk',
            description: 'Jus jeruk segar',
            price: 10000,
            category: 'drink',
          },
          {
            name: 'Teh Hangat',
            description: 'Teh panas',
            price: 4000,
            category: 'drink',
          },
          {
            name: 'Tahu Goreng',
            description: 'Tahu crispy',
            price: 8000,
            category: 'appetizer',
          },
        ],
      },
    },
  });

  // Get data
  const restaurants = await prisma.restaurant.findMany({
    include: {
      menuItems: true,
    },
  });

  // delete restaurant index di ES
  try {
    await esService.deleteByQuery('restaurants', { query: { match_all: {} } });
  } catch (err) {
    if (!/index_not_found_exception/.test(err?.meta?.body?.error?.type || '')) {
      throw err;
    }
  }

  // Sending to Elasticsearch
  for (const r of restaurants) {
    await esService.index('restaurants', r.id.toString(), {
      id: r.id,
      name: r.name,
      address: r.address,
      phone: r.phone,
      opening_hours: r.opening_hours,
      menus: r.menuItems.map((m) => ({
        id: m.id,
        name: m.name,
        category: m.category,
        price: Number(m.price),
      })),
    });
  }

  console.log('✅ Seed + Elasticsearch selesai');
}
