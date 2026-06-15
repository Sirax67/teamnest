import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { startupsSectors } from "../../db/schema";
import z from "zod";
import { SectorSchema } from "@/src/app/lib/schemas/sectors";
import { UserService } from "./user";

export const sectorsRouter = new Elysia({
    prefix: "/sectors"
})
.use(UserService)
.get("/", async () => {
    return await db.query.startupsSectors.findMany({
        where: eq(startupsSectors.isDeleted, false),
    });
}, {
    isSignedIn: true,
    isAdmin: "ADMIN",
    
})
.get(
    "/:id",
    async ({ params }) => {
        return await db.query.startupsSectors.findFirst({
            where: and (
                eq(startupsSectors.id, params.id),
                eq(startupsSectors.isDeleted, false)
            ),
        });
    },
    {
        params: z.object({
            id: z.string(),
            
        }),
        isSignedIn: true,
        isAdmin: "ADMIN",
    },
)


.post("/", async ({body}) => {
    await db.insert(startupsSectors).values({
        name: body.name,
    });
}, {
    body: SectorSchema,
    isSignedIn: true,
    isAdmin: "ADMIN",
})

.put("/:id", async ({body, params}) => {
    await db
        .update(startupsSectors)
        .set(body)
        .where(eq(startupsSectors.id, params.id))
},{
    body: SectorSchema,
    params: z.object({
        id: z.string(),
    }),
    isSignedIn: true,
    isAdmin: "ADMIN",
}
)

.delete("/:id", async ({params}) => {
    await db   
            .update(startupsSectors)
            .set({
                isDeleted: true,
            })
            .where(eq(startupsSectors.id, params.id));
}, {
    params: z.object({
        id: z.string(), 
    }),
    isSignedIn: true,
    isAdmin: "ADMIN",
    
});