import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { startupsSectors } from "../../db/schema";
import z from "zod";
import { SectorSchema } from "@/src/app/lib/schemas/sectors";
import { UserService } from "./user";
import { redis } from "../../redis";

export const sectorsRouter = new Elysia({
    prefix: "/sectors"
})
.use(UserService)
.get("/", async () => {

    const query = db.query.startupsSectors.findMany({
        where: eq(startupsSectors.isDeleted, false),
    });
    
    type Sec = Awaited<ReturnType<typeof query.execute>>

    const cachedSectors = await redis.get("sectors");

    if(cachedSectors) {
        return JSON.parse(cachedSectors) as Sec;
    }
    
    const sectorsFromDb = await query.execute();

    await redis.set(
        "sectors", 
        JSON.stringify(sectorsFromDb),
        "EX",
        60 * 60 * 24,
    );
    return sectorsFromDb
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

    await redis.del("sectors"); 
}, {
    body: SectorSchema,
})

.put("/:id", async ({body, params}) => {
    await db
        .update(startupsSectors)
        .set(body)
        .where(eq(startupsSectors.id, params.id))

    await redis.del("sectors")
},{
    body: SectorSchema,
    params: z.object({
        id: z.string(),
    }),
}
)

.delete("/:id", async ({params}) => {
    await db
        .update(startupsSectors)
        .set({
            isDeleted: true,
        })
        .where(eq(startupsSectors.id, params.id));
    
    await redis.del("sectors")
}, {
    params: z.object({
        id: z.string(),
    }),
});