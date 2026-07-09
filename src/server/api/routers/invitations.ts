import Elysia from "elysia";
import { UserService } from "./user";
import { db } from "../../db";
import { invitations, personnel, startups } from "../../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import z from "zod";

export const invitationsRouter = new Elysia({
    prefix: "/invitations",
})
.use(UserService)

.post("/", async ({ body, session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    await db.insert(invitations).values({
        startupId: body.startupId,
        personnelId: body.personnelId,
        vacancyId: body.vacancyId ?? null,
    })
}, {
    body: z.object({
        startupId: z.string(),
        personnelId: z.string(),
        vacancyId: z.string().optional(),
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

    return await db.query.invitations.findMany({
        where: and(
            eq(invitations.personnelId, myPersonnel.id),
            eq(invitations.isDeleted, false)
        ),
        with: {
            startup: true,
            vacancy: { with: { category: true, specialty: true } },
        }
    })
}, { isSignedIn: true })

.get("/sent", async ({ session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    const myStartups = await db.query.startups.findMany({
        where: and(
            eq(startups.userId, session.user.id),
            eq(startups.isDeleted, false)
        )
    })
    if (myStartups.length === 0) return []

    const myStartupIds = myStartups.map(s => s.id)

    return await db.query.invitations.findMany({
        where: and(
            inArray(invitations.startupId, myStartupIds),
            eq(invitations.isDeleted, false)
        ),
        with: {
            personnel: true,
            startup: true,
            vacancy: { with: { category: true, specialty: true } },
        }
    })
}, { isSignedIn: true })

.put("/:id/status", async ({ params, body, session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    await db.update(invitations)
        .set({ status: body.status })
        .where(eq(invitations.id, params.id))
}, {
    params: z.object({ id: z.string() }),
    body: z.object({
        status: z.enum(["accepted", "rejected"]),
    }),
    isSignedIn: true,
})
