import Elysia from "elysia";
import { UserService } from "./user";
import { db } from "../../db";
import { favorites, startups, personnel } from "../../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import z from "zod";

export const favoritesRouter = new Elysia({ prefix: "/favorites" })
.use(UserService)

.get("/", async ({ session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    const favs = await db.query.favorites.findMany({
        where: and(eq(favorites.userId, session.user.id), eq(favorites.isDeleted, false))
    })

    const startupIds = favs.filter(f => f.type === "startup").map(f => f.targetId)
    const personnelIds = favs.filter(f => f.type === "personnel").map(f => f.targetId)

    const [favStartups, favPersonnel] = await Promise.all([
        startupIds.length > 0
            ? db.query.startups.findMany({
                where: and(inArray(startups.id, startupIds), eq(startups.isDeleted, false)),
                with: { sector: true }
              })
            : [],
        personnelIds.length > 0
            ? db.query.personnel.findMany({
                where: and(inArray(personnel.id, personnelIds), eq(personnel.isDeleted, false)),
                with: { category: true, specialty: true }
              })
            : [],
    ])

    return {
        ids: favs.map(f => f.targetId),
        startups: favStartups as any[],
        personnel: favPersonnel as any[],
    }
}, { isSignedIn: true })

.post("/", async ({ body, session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    const existing = await db.query.favorites.findFirst({
        where: and(
            eq(favorites.userId, session.user.id),
            eq(favorites.targetId, body.targetId),
            eq(favorites.isDeleted, false),
        )
    })
    if (existing) return

    await db.insert(favorites).values({
        userId: session.user.id,
        type: body.type,
        targetId: body.targetId,
    })
}, {
    body: z.object({
        type: z.enum(["startup", "personnel"]),
        targetId: z.string(),
    }),
    isSignedIn: true,
})

.delete("/:targetId", async ({ params, session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    await db.update(favorites)
        .set({ isDeleted: true })
        .where(and(
            eq(favorites.userId, session.user.id),
            eq(favorites.targetId, params.targetId),
            eq(favorites.isDeleted, false),
        ))
}, {
    params: z.object({ targetId: z.string() }),
    isSignedIn: true,
})
