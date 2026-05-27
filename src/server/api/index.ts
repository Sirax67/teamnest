import Elysia from "elysia";
import { personnelRouter } from "./routers/personnel";
import { categoriesRouter } from "./routers/categories";
import { specialtiesRouter } from "./routers/specialties";
import { startupsRouter } from "./routers/startups";
import { stagesRouter } from "./routers/stage";
import { sectorsRouter } from "./routers/sector";

export const app = new Elysia({
    prefix: "/api"
})
.get("/", () => {
    return "hello world!";
})
.get("/test", () => {
    return "test";
})
.use(personnelRouter)
.use(categoriesRouter)
.use(specialtiesRouter)
.use(startupsRouter)
.use(stagesRouter)
.use(sectorsRouter)
