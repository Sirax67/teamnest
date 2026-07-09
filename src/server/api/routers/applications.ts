import Elysia from "elysia";
import { UserService } from "./user";
import { db } from "../../db";
import { applications, personnel, startups } from "../../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import z from "zod";


export const applicationsRouter = new Elysia({
    prefix: "/applications",
})
.use(UserService)
.post("/", async ({ body, session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    const myPersonnel = await db.query.personnel.findFirst({
        where: and(
            eq(personnel.userId, session.user.id),
            eq(personnel.isDeleted, false)
        )
    })
    if (!myPersonnel) return status(404, "Профиль не найден")

    await db.insert(applications).values({
        personnelId: myPersonnel.id,
        vacancyId: body.vacancyId,
        startupId: body.startupId,
    })
}, {
    body: z.object({
        vacancyId: z.string(),
        startupId: z.string(),
    }),
    isSignedIn: true,
})
.get("/my", async ({ session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    const myPersonnel = await db.query.personnel.findFirst({
        where: and(
            eq(personnel.userId, session.user.id),
            eq(personnel.isDeleted, false)
        )
    })
    if (!myPersonnel) return []

    return await db.query.applications.findMany({
        where: and(
            eq(applications.personnelId, myPersonnel.id),
            eq(applications.isDeleted, false)
        ),
        with: {
            vacancy: {
                with: {
                    category: true,
                    specialty: true,
                },
            },
            startup: true,
        }
    })
}, { isSignedIn: true })

.get("/incoming", async ({ session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    const myStartups = await db.query.startups.findMany({
        where: and(
            eq(startups.userId, session.user.id),
            eq(startups.isDeleted, false)
        )
    })
    if (myStartups.length === 0) return []

    const myStartupIds = myStartups.map(s => s.id)

    return await db.query.applications.findMany({
        where: and(
            inArray(applications.startupId, myStartupIds),
            eq(applications.isDeleted, false)
        ),
        with: {
            personnel: true,
            vacancy: { with: { category: true, specialty: true } },
            startup: true,
        }
    })
}, { isSignedIn: true })