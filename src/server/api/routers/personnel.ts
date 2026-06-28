import Elysia from "elysia";
import { and, eq } from "drizzle-orm";
import { personnel } from "../../db/schema";
import { db } from "../../db";
import z, { string } from "zod";
import { PersonnelSchema } from "@/src/app/lib/schemas/personnel";
import { UserService } from "./user";
import { redis } from "../../redis";

export const personnelRouter = new Elysia ({
    prefix: "/personnel",
})
.use(UserService)
.get ("/", async () => {

    const query = db.query.personnel.findMany({
        where: eq(personnel.isDeleted, false),
    });

    type Per = Awaited<ReturnType<typeof query.execute>>

    const cachedPersonnel = await redis.get("personnel");

    if(cachedPersonnel) {
        return JSON.parse(cachedPersonnel) as Per;
    }

    const personnelFromDb = await query.execute();

    await redis.set(
        "personnel", 
        JSON.stringify(personnelFromDb),
        "EX",
        60 * 60 * 24,
    );
    return personnelFromDb
})
.get("/:id", async ({params}) => {
    const foundedPersonnel = await db.query.personnel.findFirst({
        where: and(
            eq(personnel.id, params.id),
            eq(personnel.isDeleted, false)
            )
    })
    return foundedPersonnel ?? null
}, {
    params: z.object({
        id: string(),
    }),
})

.get("/me", async ({ session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    const found = await db.query.personnel.findFirst({
        where: and(
            eq(personnel.userId, session.user.id),
            eq(personnel.isDeleted, false)
        )
    })
    return found ?? null
}, {
    isSignedIn: true,
})

.post("/", async ({ body, session, status }) => {
    if (!session?.user) return status(401, "Авторизуйтесь")

    await db.insert(personnel).values({
        userId: session.user.id,
        avatar: body.avatar,
        name: body.name,
        position: body.position,
        city: body.city,
        age: body.age,
        summary: body.summary,
        institution: body.institution,
        faculty: body.faculty,
        period: body.period,
        skills: body.skills,
        contact: body.contact,
        categoryId: body.categoryId,
        specialtiesId: body.specialtiesId,
    });
    await redis.del("personnel");
}, {
    body: PersonnelSchema,
    isSignedIn: true,
})

.put("/:id", async ({body, params}) => {
    await db
        .update(personnel)
        .set(body)
        .where(eq(personnel.id, params.id))
    await redis.del("personnel"); 
}, {
        body: PersonnelSchema,
        params: z.object({
            id: z.string(),
        }),
    }
)

.delete("/:id", async ({params}) => {
    await db
        .update(personnel)
        .set({
            isDeleted: true,
        })
        .where(eq(personnel.id, params.id));
    await redis.del("personnel"); 
}, {
    params: z.object({
        id: z.string(),
    }),
});