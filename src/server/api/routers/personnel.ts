import Elysia from "elysia";
import { and, eq } from "drizzle-orm";
import { personnel } from "../../db/schema";
import { db } from "../../db";
import z, { string } from "zod";
import { PersonnelSchema } from "@/src/app/lib/schemas/personnel";
import { UserService } from "./user";

export const personnelRouter = new Elysia ({
    prefix: "/personnel",
})
.use(UserService)
.get ("/", async () => {
    const foundPersonnel = await db.query.personnel.findMany({
        where: eq(personnel.isDeleted, false)
    })
    return foundPersonnel;
}, {
    isSignedIn: true,
    isAdmin: true,
    
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
    isSignedIn: true,
    isAdmin: true,
})

.post("/", async ({body}) => {
    await db.insert(personnel).values({
        avatar: body.avatar,
        name: body.name,
        position: body.position,
        city: body.city,
        age: body.age,
        summary: body.summary,
        institution: body.institution,
        faculty:  body.faculty,
        period: body.period,
        skills: body.skills,
        contact: body.contact,
        categoryId: body.categoryId,
        specialtiesId: body.specialtiesId,
    });
    },{
        body: PersonnelSchema,
        isSignedIn: true,
        isAdmin: true,
    }
)

.put("/:id", async ({body, params}) => {
    await db
        .update(personnel)
        .set(body)
        .where(eq(personnel.id, params.id))
    }, {
        body: PersonnelSchema,
        params: z.object({
            id: z.string(),
        }),
        isSignedIn: true,
        isAdmin: true,
    }
)

.delete("/:id", async ({params}) => {
    await db   
        .update(personnel)
        .set({
            isDeleted: true,
        })
        .where(eq(personnel.id, params.id));
}, {
    params: z.object({
        id: z.string(), 
    }),
    isSignedIn: true,
    isAdmin: true,
});