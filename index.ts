import { eq } from "drizzle-orm";
import { db } from "./src/server/db";
import { personnel, personnelCategories, personnelSpecialties, startups, startupsSectors} from "./src/server/db/schema";

// import { redis } from "./src/server/redis";
// await redis.del("specialties");
// console.log("done");

// // let foundPersonnel = await db.query.personnel.findMany();
// let foundStartups = await db.query.startups.findMany();

// // console.log(foundPersonnel)
// console.log(foundStartups)

// await db.insert(personnelCategories).values({
//     name: "category1"
// });

// await db.insert(personnelSpecialties).values({
//     name: "specialty1",
//     categoryId: "019e5b50-743f-7000-ae6f-8e37e2609d59",
// });

// await db.insert(personnel).values({
//     name: "Антон Кучеренко",
//     position: "Бухгалтер",
//     city: "Москва",
//     age: 19,
//     summary: "Lorem ipsum dolor sit amet consectetur. Est pretium urna ut dui quis at turpis id.",
//     institution: "МГУ им. М.В. Ломоносова",
//     faculty: "Юридический факультет",
//     skills: ["HTML", "CSS", "NodeJS"],
//     contact: "Телеграм @rNEZHu",
//     categoryId: "019ea1cd-9805-7000-965f-446dcd3050d4",
//     specialtiesId: "019e7da8-5aeb-7000-acf1-fbcd0ef7b05a",
//     period: "2005 - 2020",
// });


// await db.insert(startupsSectors).values({
//     name: "Финансы"
// });

// await db.insert(startups).values({
//     name: "LifePatch",
//     description: "LifePatch - это сервис, который помогает людям быстро «чинить» конкретные жизненные проблемы, а не проходить долгие курсы или читать тонны информации. Пользователь описывает ситуацию (например: конфликт на работе, нехватка денег к концу месяца, потеря мотивации, планирование переезда), а система выдает короткий персональный план действий на 3-7 дней с подсказками, шаблонами и напоминаниями. Жизнь - это набор «патчей», а не глобальных апдейтов.",
//     link: "https://lifepatch.com",
//     sectorId: "019e6a39-df43-7000-8765-d201246066fc",
//     stage: "Разработка",
//     startDate: "2026.05.27"
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

// =========КАТЕГОРИЯ С КАДРАМИ===========
// const categoryWithPersonnel = await db.query.personnelCategories.findMany({
//     where: eq(personnelCategories.isDeleted, false),
//     with: {
//         personnel: true,
//     },
// });

// console.log(categoryWithPersonnel);

//=========FIND FIRST==========

// const category = await db.query.personnelCategories.findFirst({
//     where: eq(personnelCategories.id, "019e5b50-743f-7000-ae6f-8e37e2609d59"),
//     with: {
//         personnel: {
//             where: eq(personnel.isDeleted, false),
//         }
//     },
// });

// console.log(category);