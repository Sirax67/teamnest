import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { startups } from "../../db/schema";
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
    });

    type Star = Awaited<ReturnType<typeof query.execute>>

    const cachedStartups = await redis.get("startups");

    if(cachedStartups) {
        return {
            startups: JSON.parse(cachedStartups) as Star,
        }
    }

    const startupsFromDb = await query.execute();

    await redis.set(
        "startups", 
        JSON.stringify(startupsFromDb),
        "EX",
        60 * 60 * 24,
    );
    return startupsFromDb
})
.get(
    "/:id",
    async ({params}) => {
        return await db.query.startups.findFirst({
            where: and (
                eq(startups.id, params.id),
                eq(startups.isDeleted, false)
            )
       });
    },
    {
        params: z.object({
            id: z.string(),
        }),
    },
)

.post("/", async ({body}) => {
   await db.insert(startups).values({
        name: body.name,
        description: body.description,
        link: body.link,
        startDate: body.startDate,
        stage: body.stage,
        sectorId: body.sectorId,
    });
    await redis.del("startups"); 
    },{
        body: StartupsSchema,
    }
)

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