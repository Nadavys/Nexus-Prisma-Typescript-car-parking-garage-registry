# Nexus Prisma Typescript car/parking garage registry 

### Tech Stack 
- Nexus JS
- Apollo Server
- GraphQL
- Prisma JS
- TypeScript
- Sqlite


install, init database
```bash
npm i

npx prisma db push

npx prisma db seed

npm dev
```

```bash
curl --location --request POST 'http://localhost:4000/' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"mutation test($carId:Int!, $garageId:Int!){\n    AddCarToGarage(carId:$carId, garageId: $garageId){\n        id\n        make\n        garage{\n            name\n        }\n    }\n}","variables":{"garageId":2,"carId":27}}'
```
Response:
```json
{
    "data": {
        "AddCarToGarage": {
            "id": 27,
            "make": "Ford",
            "garage": {
                "name": "Fremont Parking"
            }
        }
    }
}
```

---
Get all garages 
```GraphQL
{
    allGarages{
        name
        capacity
        availablity
    }
}
```

Respone
```GraphQL
{
    "data": {
        "allGarages": [
            {
                "name": "Small Lot",
                "capacity": 20,
                "availablity": 19
            },
            {
                "name": "Fremont Parking",
                "capacity": 40,
                "availablity": 38
            },
            {
                "name": "Big Lot",
                "capacity": 100,
                "availablity": 100
            }
        ]
    }
}
```
---

### Find which car is in which garage, if any
```GraphQL
{
    allCars{
        plate
        model
     garage{
         name
     }
    }
}
```

Response
```GraphQL
{
    "data": {
        "allCars": [
            {
                "plate": "788a3s",
                "model": "Carnival",
                "garage": null
            },
            {
                "plate": "8jasd9",
                "model": "Bronco",
                "garage": {
                    "name": "Fremont Parking"
                }
            },
            {
                "plate": "9kla710",
                "model": "A3",
                "garage": null
            },
            {
                "plate": "7uh7awr",
                "model": "Camaro",
                "garage": {
                    "name": "Fremont Parking"
                }
            },
            {
                "plate": "7aw22da",
                "model": "Legacy",
                "garage": {
                    "name": "Small Lot"
                }
            },
            {
                "plate": "8201a1",
                "model": "Discovery",
                "garage": null
            }
        ]
    }
}
```