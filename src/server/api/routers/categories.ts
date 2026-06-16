import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { personnelCategories } from "../../db/schema";
import z from "zod";
import { CategorySchema } from "@/src/app/lib/schemas/category";
import { UserService } from "./user";

export const categoriesRouter = new Elysia({
    prefix: "/categories"
})
.use(UserService)
.get("/", async () => {
    return await db.query.personnelCategories.findMany({
        where: eq(personnelCategories.isDeleted, false),
    });
}, {
    isSignedIn: true,
    isAdmin: true,
    
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
        
        isSignedIn: true,
        isAdmin: true,
    },
)

.post("/", async ({ body }) => {
    await db.insert(personnelCategories).values({
        name: body.name,
    });
}, {
    body: CategorySchema,
    isSignedIn: true,
    isAdmin: true,
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
    }),
    isSignedIn: true,
    isAdmin: true,
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
    }),
    
        isSignedIn: true,
        isAdmin: true,
});
