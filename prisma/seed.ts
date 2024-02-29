import { PrismaClient } from "@prisma/client";
import { pages, destinations, configuration } from "./data";
const prisma = new PrismaClient();

async function main() {
  await prisma.users.create({
    data: {
      name: "admin",
      email: "admin@luxafar.com",
      password: "$2a$12$.pI/wvToE9cJqE6nxtpdAeMAOddrJnBrjV8/PHnTqlk6x/pd2zGEy",
      media: {
        create: {
          desktopMediaUrl: "",
        },
      },
    },
  });

  Promise.all(
    pages.map((page) =>
      prisma.pages.create({
        data: {
          ...page,
          content: {
            create: page.content.map((item: any) => ({
              ...item,
              media: { create: item.media },
            })),
          },
        },
      })
    )
  )
    .then(() => console.info("[SEED] Successfully "))
    .catch((e) => console.error("[SEED] Failed ", e));

  Promise.all(
    destinations.map(({ content, ...destination }: any) =>
      prisma.destinations.create({
        data: {
          ...destination,
          content: {
            create: [
              ...content.map(({ ...item }: any) => ({
                ...item,
                media: {
                  create: item.media,
                },
              })),
            ],
          },
        },
      })
    )
  )
    .then(() => console.info("[SEED] Successfully "))
    .catch((e) => console.error("[SEED] Failed ", e));
  const { media, ...configRest } = configuration;
  await prisma.configuration.create({
    data: { ...configRest, media: { create: media } },
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit();
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
