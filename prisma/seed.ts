import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedCar = {
  title: string;
  brand: string;
  filePath: string;
  seatCapacity: number;
  horsePower: number;
  maxGasoline: number;
  transmissionType: string;
  dailyRate: number;
  categoryId: number;
  images: string[];
};

async function upsertCarWithImages({ images, ...carData }: SeedCar) {
  const existingCar = await prisma.car.findFirst({
    where: {
      OR: [{ title: carData.title }, { filePath: carData.filePath }],
    },
  });

  const car = existingCar
    ? await prisma.car.update({
        where: { id: existingCar.id },
        data: carData,
      })
    : await prisma.car.create({
        data: carData,
      });

  for (const path of images) {
    const existingImage = await prisma.carImage.findFirst({
      where: {
        carId: car.id,
        path,
      },
    });

    if (!existingImage) {
      await prisma.carImage.create({
        data: {
          path,
          carId: car.id,
        },
      });
    }
  }

  return car;
}

async function main() {
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: 'Sport' }, update: {}, create: { name: 'Sport' } }),
    prisma.category.upsert({ where: { name: 'SUV' }, update: {}, create: { name: 'SUV' } }),
    prisma.category.upsert({ where: { name: 'Coupe' }, update: {}, create: { name: 'Coupe' } }),
    prisma.category.upsert({ where: { name: 'Sedan' }, update: {}, create: { name: 'Sedan' } }),
  ]);

  const categoryMap = Object.fromEntries(categories.map(c => [c.name, c.id]));

  const cars = [
    {
      title: 'Porsche 911 Carrera S',
      brand: 'Porsche',
      filePath: '/cars/911/outside.webp',
      seatCapacity: 4,
      horsePower: 443,
      maxGasoline: 67,
      transmissionType: 'Automatic',
      dailyRate: 230,
      categoryId: categoryMap['Sport'],
      images: ['/cars/911/front.webp', '/cars/911/inside.webp', '/cars/911/back.webp'],
    },
    {
      title: 'Porsche Cayenne Turbo',
      brand: 'Porsche',
      filePath: '/cars/caynne/outside.webp',
      seatCapacity: 5,
      horsePower: 541,
      maxGasoline: 90,
      transmissionType: 'Automatic',
      dailyRate: 195,
      categoryId: categoryMap['SUV'],
      images: ['/cars/caynne/front.webp', '/cars/caynne/inside.webp', '/cars/caynne/back.webp'],
    },
    {
      title: 'Bentley Continental GT',
      brand: 'Bentley',
      filePath: '/cars/continental/outside.webp',
      seatCapacity: 4,
      horsePower: 542,
      maxGasoline: 90,
      transmissionType: 'Automatic',
      dailyRate: 255,
      categoryId: categoryMap['Coupe'],
      images: ['/cars/continental/front.webp', '/cars/continental/inside.webp', '/cars/continental/back.webp'],
    },
    {
      title: 'Dodge Challenger Hellcat',
      brand: 'Dodge',
      filePath: '/cars/hellcat/outside.webp',
      seatCapacity: 4,
      horsePower: 717,
      maxGasoline: 83,
      transmissionType: 'Automatic',
      dailyRate: 205,
      categoryId: categoryMap['Sport'],
      images: ['/cars/hellcat/front.webp', '/cars/hellcat/inside.webp', '/cars/hellcat/back.webp'],
    },
    {
      title: 'BMW iX xDrive50',
      brand: 'BMW',
      filePath: '/cars/ix/outside.webp',
      seatCapacity: 5,
      horsePower: 516,
      maxGasoline: 0,
      transmissionType: 'Automatic',
      dailyRate: 185,
      categoryId: categoryMap['SUV'],
      images: ['/cars/ix/front.webp', '/cars/ix/inside.webp', '/cars/ix/back.webp'],
    },
    {
      title: 'BMW M5 Competition',
      brand: 'BMW',
      filePath: '/cars/m5/outside.webp',
      seatCapacity: 5,
      horsePower: 617,
      maxGasoline: 68,
      transmissionType: 'Automatic',
      dailyRate: 215,
      categoryId: categoryMap['Sedan'],
      images: ['/cars/m5/front.webp', '/cars/m5/inside.webp', '/cars/m5/back.webp'],
    },
    {
      title: 'Mercedes-AMG SL63',
      brand: 'Mercedes-Benz',
      filePath: '/cars/sl63/outside.webp',
      seatCapacity: 2,
      horsePower: 577,
      maxGasoline: 70,
      transmissionType: 'Automatic',
      dailyRate: 240,
      categoryId: categoryMap['Coupe'],
      images: ['/cars/sl63/front.webp', '/cars/sl63/inside.webp', '/cars/sl63/back.webp'],
    },
    {
      title: 'Volkswagen Touareg R-Line',
      brand: 'Volkswagen',
      filePath: '/cars/touareg/outside.webp',
      seatCapacity: 5,
      horsePower: 335,
      maxGasoline: 75,
      transmissionType: 'Automatic',
      dailyRate: 165,
      categoryId: categoryMap['SUV'],
      images: ['/cars/touareg/front.webp', '/cars/touareg/inside.webp', '/cars/touareg/back.webp'],
    },
  ] satisfies SeedCar[];

  for (const carData of cars) {
    const car = await upsertCarWithImages(carData);
    console.log(`Created car: ${car.title}`);
  }

  console.log('Seed completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
