import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { startupsSectors } from "../../db/schema";
import z from "zod";
import { SectorSchema } from "@/src/app/lib/schemas/sectors";

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
    },
)


.post("/", async ({body}) => {
    await db.insert(startupsSectors).values({
        name: body.name,
    });
}, {
    body: SectorSchema,
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
    })
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
    })
});