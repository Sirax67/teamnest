import * as pg from "drizzle-orm/pg-core"
import { commonFields } from "./untils"

export const files = pg.pgTable("files", {
    ...commonFields,
    name: pg.varchar("name", {length: 255}).notNull(),
    size: pg.integer("size").notNull(),
    contentType: pg.varchar("contentType", {length: 255}).notNull(),
});