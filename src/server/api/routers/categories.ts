import Elysia from "elysia";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { personnelCategories } from "../../db/schema";
import z from "zod";

export const categoriesRouter = new Elysia({
    prefix: "/categories"
})
.get("/", async () => {
    return await db.query.personnelCategories.findMany({
        where: eq(personnelCategories.isDeleted, false),
    });
})
.get(
    "/:id",
    async ({ params }) => {
        return await db.query.personnelCategories.findFirst({
            where: eq(personnelCategories.id, params.id),
        });
    },
    {
        params: z.object({
            id: z.string(),
        }),
    },
)