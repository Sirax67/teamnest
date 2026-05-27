import Elysia from "elysia";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { personnelSpecialties } from "../../db/schema";
import z from "zod"; 

export const  specialtiesRouter = new Elysia ({
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
            where: eq(personnelSpecialties.id, params.id),
        });
    },
    {
        params: z.object({
            id: z.string(),
        }),
    },
)