import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { personnelCategories } from "../../db/schema";
import z from "zod";
import { CategorySchema } from "@/src/app/lib/schemas/category";
import { UserService } from "./user";
import { redis } from "../../redis";

export const categoriesRouter = new Elysia({
    prefix: "/categories"
})
.use(UserService)
.get("/", async () => {

    const query = db.query.personnelCategories.findMany({
        where: eq(personnelCategories.isDeleted, false),
    });

    type C = Awaited<ReturnType<typeof query.execute>>

    const cachedCategories = await redis.get("categories");

    if(cachedCategories) {
        return JSON.parse(cachedCategories) as C;
    }

    const categoriesFromDb = await query.execute();

    await redis.set(
        "categories", 
        JSON.stringify(categoriesFromDb),
        "EX",
        60 * 60 * 24,
    );
    return categoriesFromDb
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

    await redis.del("categories"); 
}, {
    body: CategorySchema,
})

.put("/:id", async ({body, params}) => {
    await db
        .update(personnelCategories)
        .set(body)
        .where(eq(personnelCategories.id, params.id))

    await redis.del("categories"); 
},{
    body: CategorySchema,
    params: z.object({
        id: z.string(),
    }),
}
)

.delete("/:id", async ({params}) => {
    await db
        .update(personnelCategories)
        .set({
            isDeleted: true,
        })
        .where(eq(personnelCategories.id, params.id));

    await redis.del("categories"); 
}, {
    params: z.object({
        id: z.string(),
    }),
});
