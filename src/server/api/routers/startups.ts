import Elysia from "elysia";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { startups } from "../../db/schema";
import z from "zod"; 

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
            where: eq(startups.id, params.id)
        });
    },
    {
        params: z.object({
            id: z.string(),
        }),
    },
)