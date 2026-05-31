import Elysia from "elysia";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { personnelSpecialties} from "../../db/schema";
import z from "zod";
import { SpetialtiesSchema } from "@/src/app/lib/schemas/spetialties";

export const specialtiesRouter = new Elysia({
    prefix: "/specialties"
})
.get("/", async () => {
    return await db.query.personnelSpecialties.findMany({
        where: eq(personnelSpecialties.isDeleted, false),
    });
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
}, {
    body: SpetialtiesSchema,
})

.put("/:id", async ({body, params}) => {
    await db
        .update(personnelSpecialties)
        .set(body)
        .where(eq(personnelSpecialties.id, params.id))
},{
    body: SpetialtiesSchema,
    params: z.object({
        id: z.string(),
    })
}
)

.delete("/:id", async ({params}) => {
    await db   
            .update(personnelSpecialties)
            .set({
                isDeleted: true,
            })
            .where(eq(personnelSpecialties.id, params.id));
}, {
    params: z.object({
        id: z.string(), 
    })
});