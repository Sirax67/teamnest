import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../db";
import { user } from "../db/auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: false,
                defaultValue: "USER",
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => ({
                    data: {
                        ...user,
                        role: user.email === process.env.MAIN_ADMIN_EMAIL ? "ADMIN" : "USER"
                    }
                })
            }
        }
    }
});