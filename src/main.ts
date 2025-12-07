import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { prisma } from './lib/prisma';

async function bootstrap() {
  try {
    await connectWithRetry(12, 2500);
    const has_favorites = await prisma.favorite.findFirst();
    if (!has_favorites) {
      await prisma.favorite.create({ data: { artists: [], albums: [], tracks: []} });
    }
    const app = await NestFactory.create(AppModule);

    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Server started on port ${port}`);
    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1)
  }
}
bootstrap();

async function connectWithRetry(retries = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      console.log("Prisma connected to database");
      return;
    } catch (err: any) {
      const msg = err?.message || err;
      console.error(`Prisma connect attempt ${attempt} failed: ${msg}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

bootstrap();