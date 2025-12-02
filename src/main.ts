import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { prisma } from './lib/prisma';

async function bootstrap() {
  try {
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
