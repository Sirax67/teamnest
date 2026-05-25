import { eq } from "drizzle-orm";
import { db } from "./src/server/db";
import { personnel, personnelCategories, personnelSpecialties } from "./src/server/db/schema";

let foundPersonnel = await db.query.personnel.findMany();

// console.log(foundPersonnel)

// await db.insert(personnelCategories).values({
//     name: "category1"
// });

// await db.insert(personnelSpecialties).values({
//     name: "specialty1"
// });


// await db.insert(personnel).values({
//     name: "Антон ",
//     lastName: "Кучеренко",
//     position: "Бухгалтер",
//     city: "Москва",
//     age: 19,
//     summary: "Lorem ipsum dolor sit amet consectetur. Est pretium urna ut dui quis at turpis id.",
//     education: [
//         {
//             period: "2005 - 2020",
//             institution: "МГУ им. М.В. Ломоносова",
//             faculty: "Юридический факультет"
//         }
//     ],
//     skills: ["HTML", "CSS", "NodeJS"],
//     contact: "Телеграм @rNEZHu",
//     categoryId: "019e5b50-743f-7000-ae6f-8e37e2609d59",
//     specialtiesId: "019e5b52-78dd-7000-9172-a0d5f36f0956",
// });

// await db.insert(personnel).values({
//     name: "Александр ",
//     lastName: "Иванов",
//     position: "Back-end",
//     city: "Москва",
//     age: 20,
//     summary: "Lorem ipsum dolor sit amet consectetur. Est pretium urna ut dui quis at turpis id.",
//     education: [
//         {
//             period: "2005 - 2020",
//             institution: "МГУ им. М.В. Ломоносова",
//             faculty: "Юридический факультет"
//         }
//     ],
//     skills: ["HTML", "CSS", "NodeJS"],
//     contact: "Телеграм @rNEZHu",
//     categoryId: "019e5b50-743f-7000-ae6f-8e37e2609d59",
//     specialtiesId: "019e5b52-78dd-7000-9172-a0d5f36f0956",
// });

// await db.insert(personnel).values({
//     name: "Ангелина ",
//     lastName: "Кучеренко",
//     position: "Бизнес аналитик",
//     city: "Москва",
//     age: 31,
//     summary: "Lorem ipsum dolor sit amet consectetur. Est pretium urna ut dui quis at turpis id.",
//     education: [
//         {
//             period: "2005 - 2020",
//             institution: "МГУ им. М.В. Ломоносова",
//             faculty: "Юридический факультет"
//         }
//     ],
//     skills: ["HTML", "CSS", "NodeJS"],
//     contact: "Телеграм @rNEZHu",
//     categoryId: "019e5b50-743f-7000-ae6f-8e37e2609d59",
//     specialtiesId: "019e5b52-78dd-7000-9172-a0d5f36f0956",
// });

//=========ОБНОВЛЕНИЕ===========

// await db.update(personnel).set({
//     name: "Максим",
//     lastName: "Макаров",
//     position: "Бизнес аналитик",
//     city: "Москва",
//     age: 31,
//     summary: "Lorem ipsum dolor sit amet consectetur. Est pretium urna ut dui quis at turpis id.",
//     education: [
//         {
//             period: "2005 - 2020",
//             institution: "МГУ им. М.В. Ломоносова",
//             faculty: "Юридический факультет"
//         }
//     ],
//     skills: ["HTML", "CSS", "NodeJS"],
//     contact: "Телеграм @rNEZHu",
//     categoryId: "019e5b50-743f-7000-ae6f-8e37e2609d59",
//     specialtiesId: "019e5b52-78dd-7000-9172-a0d5f36f0956",
// })
// .where(eq(personnel.id, "019e6043-e704-7000-897f-b41661208821"))
// foundPersonnel = await db.query.personnel.findMany()

//=========УДАЛЕНИЕ===========

// await db.update(personnel).set({
//     isDeleted: true
// })
// .where(eq(personnel.id, "019e6043-e704-7000-897f-b41661208821"))

// foundPersonnel = await db.query.personnel.findMany({
//     where: eq(personnel.isDeleted, false)
// })
// console.log(foundPersonnel);

//=========КАДР С КАТЕГОРИЕЙ===========
// const personnelWithCategory = await db.query.personnel.findMany({
//     where: eq(personnel.isDeleted, false),
//     with: {
//         category: true,
//         specialty: true,
//     },
// });
// console.log(personnelWithCategory);

//=========КАТЕГОРИЯ С КАДРАМИ===========
// const categoryWithPersonnel = await db.query.personnelCategories.findMany({
//     where: eq(personnelCategories.isDeleted, false),
//     with: {
//         personnel: true,
//     },
// });

// console.log(categoryWithPersonnel);

//=========FIND FIRST==========

const category = await db.query.personnelCategories.findFirst({
    where: eq(personnelCategories.id, "019e5b50-743f-7000-ae6f-8e37e2609d59"),
    with: {
        personnel: {
            where: eq(personnel.isDeleted, false),
        }
    },
});

console.log(category);