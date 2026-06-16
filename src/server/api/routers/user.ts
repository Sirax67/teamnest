import Elysia from "elysia";
import { auth } from "../../auth/auth";
import { userRoleEnum } from "../../db/auth-schema";

export const UserService = new Elysia ({name: "user/service"})
    .derive({as: "global"}, async ({request}) => {
        const betterAuthSession = await auth.api.getSession({
            headers: request.headers,
        });
        return {
            session: betterAuthSession,
        }
    })

    .macro ({
        isSignedIn: (enable?: boolean) => {
            if (!enable) return;

            return {
                beforeHandle({session, status}) {
                    if (!session?.user) {
                        return status(401, "Авторизуйтесь")
                    }
                }
            }
        }
    })

    .macro ({
        isAdmin: (enable?: boolean) => {
            if (!enable) return;

            return {
                beforeHandle({session, status}) {
                    if (!session?.user) {
                        return status(401, "Авторизуйтесь")
                    }
                    if (session.user.role !== "ADMIN") {
                        return status(403, "Нет прав админа")
                    }
                }
            }
        }
    })