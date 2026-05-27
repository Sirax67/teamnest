import Elysia from "elysia";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { startupsSectors } from "../../db/schema";
import z from "zod";

export const sectorsRouter = new Elysia({
    prefix: "/sectors"
})
.get("/", async () => {
    return await db.query.startupsSectors.findMany({
        where: eq(startupsSectors.isDeleted, false),
    });
})
.get(
    "/:id",
    async ({ params }) => {
        return await db.query.startupsSectors.findFirst({
            where: eq(startupsSectors.id, params.id),
        });
    },
    {
        params: z.object({
            id: z.string(),
        }),
    },
)