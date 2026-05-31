import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { startups } from "../../db/schema";
import z from "zod"; 
import { StartupsSchema } from "@/src/app/lib/schemas/startups";

export const startupsRouter = new Elysia ({
    prefix: "/startups",
})
.get("/", async () => {
    return await db.query.startups.findMany({
        where: eq(startups.isDeleted, false)
    })
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
    },{
        body: StartupsSchema,
    }
)

.put("/:id", async ({body, params}) => {
    await db
        .update(startups)
        .set(body)
        .where(eq(startups.id, params.id))
    }, {
        body: StartupsSchema,
        params: z.object({
            id: z.string(),
        })
    }
)

.delete("/:id", async ({params}) => {
    await db   
        .update(startups)
        .set({
            isDeleted: true,
        })
        .where(eq(startups.id, params.id));
}, {
    params: z.object({
        id: z.string(), 
    })
});