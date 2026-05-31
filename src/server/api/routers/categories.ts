import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { personnelCategories } from "../../db/schema";
import z from "zod";
import { CategorySchema } from "@/src/app/lib/schemas/category";

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
            where: and(
                eq(personnelCategories.id, params.id),
                eq(personnelCategories.isDeleted, false),
            ) ,
        });
    },
    {
        params: z.object({
            id: z.string(),
        }),
    },
)

.post("/", async ({ body }) => {
    await db.insert(personnelCategories).values({
        name: body.name,
    });
}, {
    body: CategorySchema,
})

.put("/:id", async ({body, params}) => {
    await db
        .update(personnelCategories)
        .set(body)
        .where(eq(personnelCategories.id, params.id))
},{
    body: CategorySchema,
    params: z.object({
        id: z.string(),
    })
}
)

.delete("/:id", async ({params}) => {
    await db   
        .update(personnelCategories)
        .set({
            isDeleted: true,
        })
        .where(eq(personnelCategories.id, params.id));
}, {
    params: z.object({
        id: z.string(), 
    })
});
