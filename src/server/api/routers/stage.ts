import Elysia from "elysia";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { startupsStages } from "../../db/schema";
import z from "zod";

export const stagesRouter = new Elysia({
    prefix: "/stages"
})
.get("/", async () => {
    return await db.query.startupsStages.findMany({
        where: eq(startupsStages.isDeleted, false),
    });
})
.get(
    "/:id",
    async ({ params }) => {
        return await db.query.startupsStages.findFirst({
            where: eq(startupsStages.id, params.id),
        });
    },
    {
        params: z.object({
            id: z.string(),
        }),
    },
)