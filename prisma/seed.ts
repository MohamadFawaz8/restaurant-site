import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";

async function main() {
  const passwordHash = await hashPassword("Password123!");

  // Users
  await prisma.user.upsert({
    where: { email: "admin@mn.local" },
    update: { role: "ADMIN", passwordHash, name: "M&N Admin" },
    create: { email: "admin@mn.local", role: "ADMIN", passwordHash, name: "M&N Admin" },
  });

  await prisma.user.upsert({
    where: { email: "staff@mn.local" },
    update: { role: "STAFF", passwordHash, name: "M&N Staff" },
    create: { email: "staff@mn.local", role: "STAFF", passwordHash, name: "M&N Staff" },
  });

  await prisma.user.upsert({
    where: { email: "user@mn.local" },
    update: { role: "USER", passwordHash, name: "M&N Guest" },
    create: { email: "user@mn.local", role: "USER", passwordHash, name: "M&N Guest" },
  });

  // Categories
  const categories = [
    { name: "Signature Bottles", slug: "signature-bottles", description: "House plates with bottle-glass flair." },
    { name: "Glasshouse Greens", slug: "glasshouse-greens", description: "Crisp greens, bright dressings, light bubbles." },
    { name: "Warm Plates", slug: "warm-plates", description: "Comforting mains with a modern finish." },
    { name: "Desserts", slug: "desserts", description: "Sweet endings, soft shimmer." },
  ];

  const categoryRecords = await Promise.all(
    categories.map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: { name: c.name, description: c.description },
        create: c,
      })
    )
  );

  const bySlug = Object.fromEntries(categoryRecords.map((c) => [c.slug, c]));

  // Menu items (>= 6)
  const items = [
    {
      name: "Bottle-Glazed Chicken",
      slug: "bottle-glazed-chicken",
      description: "Roasted chicken lacquered with a warm citrus glaze, finished with toasted sesame.",
      price: "18.50",
      categorySlug: "warm-plates",
      images: ["/images/food/dish-1.svg"],
      tags: ["signature", "popular"],
      dietaryFlags: ["high-protein"],
      allergens: ["sesame"],
      availability: true,
      featured: true,
    },
    {
      name: "Smoked Glass Tomato Soup",
      slug: "smoked-glass-tomato-soup",
      description: "Velvety tomato soup with a subtle smoke note and basil oil.",
      price: "8.00",
      categorySlug: "signature-bottles",
      images: ["/images/food/dish-2.svg"],
      tags: ["comfort"],
      dietaryFlags: ["vegetarian", "gluten-free"],
      allergens: [],
      availability: true,
      featured: false,
    },
    {
      name: "Bubbly Citrus Salad",
      slug: "bubbly-citrus-salad",
      description: "Greens, citrus segments, and a sparkling vinaigrette with micro-herbs.",
      price: "11.25",
      categorySlug: "glasshouse-greens",
      images: ["/images/food/dish-3.svg"],
      tags: ["fresh"],
      dietaryFlags: ["vegan", "gluten-free"],
      allergens: [],
      availability: true,
      featured: true,
    },
    {
      name: "Charred Bottle Pepper Pasta",
      slug: "charred-bottle-pepper-pasta",
      description: "Pasta with roasted peppers, garlic confit, and parmesan snowfall.",
      price: "16.75",
      categorySlug: "warm-plates",
      images: ["/images/food/dish-4.svg"],
      tags: ["chef-choice"],
      dietaryFlags: ["vegetarian"],
      allergens: ["dairy", "gluten"],
      availability: true,
      featured: false,
    },
    {
      name: "Glass-Sheen Cheesecake",
      slug: "glass-sheen-cheesecake",
      description: "Classic cheesecake with a translucent berry glaze and crunchy base.",
      price: "7.50",
      categorySlug: "desserts",
      images: ["/images/food/dish-5.svg"],
      tags: ["sweet"],
      dietaryFlags: ["vegetarian"],
      allergens: ["dairy", "gluten", "egg"],
      availability: true,
      featured: true,
    },
    {
      name: "Warm Vanilla Bubble Pudding",
      slug: "warm-vanilla-bubble-pudding",
      description: "Vanilla pudding with caramel bubbles and a touch of sea salt.",
      price: "6.75",
      categorySlug: "desserts",
      images: ["/images/food/dish-6.svg"],
      tags: ["cozy"],
      dietaryFlags: ["vegetarian", "gluten-free"],
      allergens: ["dairy"],
      availability: true,
      featured: false,
    },
  ];

  for (const item of items) {
    const category = bySlug[item.categorySlug];
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price as any,
        categoryId: category.id,
        images: item.images as any,
        tags: item.tags as any,
        dietaryFlags: item.dietaryFlags as any,
        allergens: item.allergens as any,
        availability: item.availability,
        featured: item.featured,
        archived: false,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price as any,
        categoryId: category.id,
        images: item.images as any,
        tags: item.tags as any,
        dietaryFlags: item.dietaryFlags as any,
        allergens: item.allergens as any,
        availability: item.availability,
        featured: item.featured,
        archived: false,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


