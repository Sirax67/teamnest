import * as pg from "drizzle-orm/pg-core" 

export const commonFields = {
    id: pg
        .varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => Bun.randomUUIDv7()),
    isDeleted: pg.boolean("is_deleted").notNull().default(false),
    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
}