import {
    intArg,
    makeSchema,
    nonNull,
    objectType,
    stringArg,
    asNexusMethod,
    list
} from 'nexus';
import { DateTimeResolver } from 'graphql-scalars'

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
const Car = objectType({
    name: "Car",
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('model')
        t.nonNull.string('make')
        t.nonNull.string('plate')
        t.nonNull.int('year')
        t.field('garage', {
            type: "ParkingGarage",
            resolve: (parent, _, context) => {
                return context.prisma.car.findUnique({
                    where: { id: parent.id }
                }).garage()
            }
        })
    },
})

const ParkingGarage = objectType({
    name: "ParkingGarage",
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('name')
        t.nonNull.int('capacity')
        //availablity - calculated field. not in DB
        t.nonNull.int('availablity', {
            resolve: async (parent, _, context) => {
                const totalCarsInLot = await context.prisma.car.count({
                    where: {
                        garageId: parent.id
                    }
                })
                return parent.capacity - totalCarsInLot;
            }

        })
        t.list.field('cars', {
            'type': "Car",
            resolve: (parent, _, context) => {
                return context.prisma.parkingGarage.findUnique({
                    where: {
                        id: parent.id
                    }
                }).cars()
            }
        })
    },
})

const Query = objectType({
    name: "Query",
    definition(t) {
        t.nonNull.field('allCars', {
            type: list('Car'),
            resolve: (_parent, args, context) => {
                return context.prisma.car.findMany()
            }
        });

        t.nonNull.field('allGarages', {
            type: list("ParkingGarage"),
            resolve: (_parent, args, context) => {
                return context.prisma.parkingGarage.findMany()
            }
        })
    },
})

const Mutation = objectType({
    name: "Mutation",
    definition(t) {
        t.nonNull.field('addCar', {
            type: 'Car',
            args: {
                make: nonNull(stringArg()),
                model: nonNull(stringArg()),
                plate: stringArg(),
                year: nonNull(intArg()),
            },
            resolve: (_parent, { model, make, plate, year }, context) => {
                console.log({ model, make, plate, year })
                return context.prisma.car.create({
                    data: { model, make, plate, year }
                })
            }
        })

        t.nonNull.field('AddCarToGarage', {
            type: "Car",
            args: {
                carId: nonNull(intArg()),
                garageId: nonNull(intArg())
            },
            resolve: (_ , { carId, garageId }: { carId: number, garageId: number }, context) => {
                return context.prisma.car.update({
                    where: { id: carId },
                    data: { garageId }
                })
            }
        })
    },
})



export const schema = makeSchema({
    types: [
        DateTime,
        Query,
        Mutation,
        Car,
        ParkingGarage,
        //   Post,
        //   User,
        //   UserUniqueInput,
        //   UserCreateInput,
        //   PostCreateInput,
        //   SortOrder,
        //   PostOrderByUpdatedAtInput,

    ],
    outputs: {
        schema: __dirname + '/../schema.graphql',
        typegen: __dirname + '/generated/nexus.ts',
    },
    contextType: {
        module: require.resolve('./context'),
        export: 'Context',
    },
    sourceTypes: {
        modules: [
            {
                module: '@prisma/client',
                alias: 'prisma',
            },
        ],
    },
})