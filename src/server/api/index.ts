import Elysia from "elysia";
import { personnelRouter } from "./routers/personnel";
import { categoriesRouter } from "./routers/categories";
import { startupsRouter } from "./routers/startups";
import { sectorsRouter } from "./routers/sector";
import { specialtiesRouter } from "./routers/specialties";
import { treaty } from "@elysiajs/eden";
import { auth } from "../auth/auth";

export const app = new Elysia({
    prefix: "/api"
})
.get("/", () => {
    return "hello world!";
})
.get("/test", () => {
    return "test";
})
.mount(auth.handler)
.use(personnelRouter)
.use(categoriesRouter)
.use(specialtiesRouter)
.use(startupsRouter)
.use(sectorsRouter)


export const api  = treaty(app).api

export type App = typeof app;