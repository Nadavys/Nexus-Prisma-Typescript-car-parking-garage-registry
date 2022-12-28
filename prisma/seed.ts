import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const carList = [
    {
      model: "Carnival",
      make: "Kia",
      plate: "788a3s",
      year: 2020
    },
    {
      model: "A3",
      make: "Audi",
      plate: "9kla710",
      year: 2019
    },
    {
      model: "Camaro",
      make: "Chevrolet",
      plate: "7uh7awr",
      year: 2022
    },
    {
      model: "Bronco",
      make: "Ford",
      plate: "8jasd9",
      year: 2021
    },

    {
      model: "Legacy",
      make: "Subaru",
      plate: "7aw22da",
      year: 2014
    },
    {
      model: "Discovery",
      make: "Land Rover",
      plate: "8201a1",
      year: 2020
    }
  ]


  await prisma.car.deleteMany();
  await prisma.parkingGarage.deleteMany();

  await Promise.all(carList.map(
    (
      { model, make, plate, year }
    ) => {
      return prisma.car.create({ data: { model, make, plate, year } })
    }
  ));

  const garageList = [
    { name: "Big Lot", capacity: 100 },
    { name: "Small Lot", capacity: 20 },
    { name: "Fremont Parking", capacity: 40 },
  ]

  garageList.map(
    async ({ name, capacity }) => {
      await prisma.parkingGarage.create(
        { data: { name, capacity } }
      )
    }
  )
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