import Elysia from "elysia";
import { eq } from "drizzle-orm";
import { string} from "zod/v4";
import { personnel } from "../../db/schema";
import { db } from "../../db";
import z from "zod";

export const personnelRouter = new Elysia ({
    prefix: "/personnel",
})
.get ("/", async () => {
    const foundPersonnel = await db.query.personnel.findMany({
        where: eq(personnel.isDeleted, false)
    })
    return foundPersonnel;
})
.get("/:id", async ({params}) => {
    const foundedPersonnel = await db.query.personnel.findFirst({
        where: eq(personnel.id, params.id)
    }) 
    return foundedPersonnel ?? null
}, {
    params: z.object({
        id: string(),
    })
})