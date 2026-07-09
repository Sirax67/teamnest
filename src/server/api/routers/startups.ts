import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { startups, startupVacancies, startupMembers } from "../../db/schema";
import z from "zod";
import { StartupsSchema } from "@/src/app/lib/schemas/startups";
import { UserService } from "./user";
import { redis } from "../../redis";

export const startupsRouter = new Elysia ({
    prefix: "/startups",
})
.use(UserService)
.get("/", async () => {
    const query = db.query.startups.findMany({
        where: eq(startups.isDeleted, false),
        with: {
            sector: true,
        },
    });

    type Star = Awaited<ReturnType<typeof query.execute>>

    const cachedStartups = await redis.get("startups");

    if(cachedStartups) {
        return JSON.parse(cachedStartups) as Star;
    }

    const startupsFromDb = await query.execute();

    if (startupsFromDb.length > 0) {
        await redis.set(
            "startups",
            JSON.stringify(startupsFromDb),
            "EX",
            60 * 60 * 24,
        );
    }
    return startupsFromDb
})
.get(
    "/:id",
    async ({ params }) => {
        return await db.query.startups.findFirst({
            where: and(
                eq(startups.id, params.id),
                eq(startups.isDeleted, false)
            ),
            with: {
                sector: true,
                vacancies: {
                    where: eq(startupVacancies.isDeleted, false),
                    with: { category: true, specialty: true },
                },
                members: {
                    where: eq(startupMembers.isDeleted, false),
                    with: { personnel: true },
                },
            },
        });
    },
    {
        params: z.object({ id: z.string() }),
    },
)

.post("/:id/vacancies", async ({ params, body, session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")
    await db.insert(startupVacancies).values({
        startupId: params.id,
        categoryId: body.categoryId,
        specialtyId: body.specialtyId ?? null,
        description: body.description ?? null,
    });
    await redis.del("startups");
}, {
    params: z.object({ id: z.string() }),
    body: z.object({
        categoryId: z.string(),
        specialtyId: z.string().optional(),
        description: z.string().optional(),
    }),
    isSignedIn: true,
})

.delete("/:id/vacancies/:vacancyId", async ({ params }) => {
    await db.update(startupVacancies)
        .set({ isDeleted: true })
        .where(eq(startupVacancies.id, params.vacancyId));
    await redis.del("startups");
}, {
    params: z.object({ id: z.string(), vacancyId: z.string() }),
})

.post("/:id/members", async ({ params, body, session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")
    await db.insert(startupMembers).values({
        startupId: params.id,
        personnelId: body.personnelId,
        role: body.role ?? null,
    });
}, {
    params: z.object({ id: z.string() }),
    body: z.object({
        personnelId: z.string(),
        role: z.string().optional(),
    }),
    isSignedIn: true,
})

.delete("/:id/members/:memberId", async ({ params }) => {
    await db.update(startupMembers)
        .set({ isDeleted: true })
        .where(eq(startupMembers.id, params.memberId));
}, {
    params: z.object({ 
        id: z.string(), 
        memberId: z.string() 
    }),
})

.get("/me", async ({ session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")
    return await db.query.startups.findMany({
        where: and(
            eq(startups.userId, session.user.id),
            eq(startups.isDeleted, false)
        ),
        with: { sector: true },
    })
}, { isSignedIn: true })

.post("/", async ({ body, session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")
    const [created] = await db.insert(startups).values({
        userId: session.user.id,
        logo: body.logo,
        name: body.name,
        description: body.description,
        link: body.link,
        startDate: body.startDate,
        stage: body.stage,
        sectorId: body.sectorId,
    }).returning({ id: startups.id });
    await redis.del("startups");
    return { id: created.id };
}, {
    body: StartupsSchema,
    isSignedIn: true,
})

.put("/:id", async ({body, params}) => {
    await db
        .update(startups)
        .set(body)
        .where(eq(startups.id, params.id))
    await redis.del("startups");
}, {
        body: StartupsSchema,
        params: z.object({
            id: z.string(),
        }),
    }
)

.delete("/:id", async ({params}) => {
    await db
        .update(startups)
        .set({
            isDeleted: true,
        })
        .where(eq(startups.id, params.id));
    await redis.del("startups");
}, {
    params: z.object({
        id: z.string(),
    }),
});