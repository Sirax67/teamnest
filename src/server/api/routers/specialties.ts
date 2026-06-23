import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { personnelSpecialties} from "../../db/schema";
import z from "zod";
import { SpetialtiesSchema } from "@/src/app/lib/schemas/spetialties";
import { UserService } from "./user";
import { redis } from "../../redis";

export const specialtiesRouter = new Elysia({
    prefix: "/specialties"
})
.use(UserService)
.get("/", async () => {

    const query = db.query.personnelSpecialties.findMany({
        where: eq(personnelSpecialties.isDeleted, false),
    });
    
    type Spec = Awaited<ReturnType<typeof query.execute>>

    const cachedSpecialties = await redis.get("specialties");

    if(cachedSpecialties) {
        return {
            specialties: JSON.parse(cachedSpecialties) as Spec,
        }
    }
    
    const specialtiesFromDb = await query.execute();

    await redis.set(
        "specialties", 
        JSON.stringify(specialtiesFromDb),
        "EX",
        60 * 60 * 24,
    );
    return specialtiesFromDb
})
.get(
    "/:id",
    async ({ params }) => {
        return await db.query.personnelSpecialties.findFirst({
           where: and(
                eq(personnelSpecialties.id, params.id),
                eq(personnelSpecialties.isDeleted, false),
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
    await db.insert(personnelSpecialties).values({
        name: body.name,
        categoryId: body.categoryId,
    });

    await redis.del("specialties"); 
}, {
    body: SpetialtiesSchema,
})

.put("/:id", async ({body, params}) => {
    await db
        .update(personnelSpecialties)
        .set(body)
        .where(eq(personnelSpecialties.id, params.id))

    await redis.del("specialties"); 
},{
    body: SpetialtiesSchema,
    params: z.object({
        id: z.string(),
    }),
}
)

.delete("/:id", async ({params}) => {
    await db
        .update(personnelSpecialties)
        .set({
            isDeleted: true,
        })
        .where(eq(personnelSpecialties.id, params.id));
    
    await redis.del("specialties"); 
}, {
    params: z.object({
        id: z.string(),
    }),
});