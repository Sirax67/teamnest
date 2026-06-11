import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
export * from "./auth-schema";

export const commonFields = {
    id: pg
        .varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => Bun.randomUUIDv7()),
    isDeleted: pg.boolean("is_deleted").notNull().default(false),
    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
}

export const personnel = pg.pgTable("personnel", {
    ...commonFields,
    avatar: pg.varchar("avatar", { length: 500 }).default("/images/default-avatar.png"),
    name: pg.varchar("name", { length: 255 }).notNull(),
    position: pg.varchar("position", { length: 255 }).notNull(),
    city: pg.varchar("city", { length: 168 }).notNull(),
    age: pg.integer("age").notNull(),
    summary: pg.text("summary").notNull(),
    period: pg.varchar("period", { length: 50 }).notNull(),
    institution: pg.varchar("institution", { length: 255 }).notNull(),
    faculty: pg.varchar("faculty", { length: 255 }).notNull(),
    skills: pg.text("skills").array().notNull().default([]),
    contact: pg.varchar("contact", { length: 255 }).notNull(),
    categoryId: pg
        .varchar("category_id", { length: 255 })
        .notNull()
        .references( () => personnelCategories.id),
    specialtiesId: pg
        .varchar("specialties_id", { length: 255 })
        .notNull()
        .references( () => personnelSpecialties.id),
});

export const personnelCategories = pg.pgTable("personnel_category", {
    ...commonFields,
    name: pg.varchar("name", { length: 255 }).notNull(),
});

export const personnelSpecialties = pg.pgTable("personnel_specialties", {
    ...commonFields,
    name: pg.varchar("name", { length: 255 }).notNull(),
    categoryId: pg
        .varchar("category_id", { length: 255 })
        .notNull()
        .references(() => personnelCategories.id),
});





export const personnelCategoriesRelations = relations(personnel, ({ one }) => ({
    category: one(personnelCategories, {
        references: [personnelCategories.id],
        fields: [personnel.categoryId],
    }),
    specialty: one(personnelSpecialties, {
        references: [personnelSpecialties.id],
        fields: [personnel.specialtiesId],
    }),
}));

export const categoriesPersonnelRelations = relations(personnelCategories, ({ many }) => ({
    personnel: many(personnel),
    specialties: many(personnelSpecialties),
}));


export const personnelSpecialtiesRelations = relations(personnelSpecialties, ({ one, many }) => ({
    category: one(personnelCategories, {
        fields: [personnelSpecialties.categoryId],
        references: [personnelCategories.id],
    }),
}));

export const specialtiesPersonnelRelations = relations(personnelSpecialties, ({ many }) => ({
    personnel: many(personnel),
}));


export const stageEnum = pg.pgEnum("stage_enum", [
    "Идея",
    "Разработка",
    "Запуск",
])

export const startups = pg.pgTable("startups", {
    ...commonFields,
    name: pg.varchar("name", { length: 255 }).notNull(),
    description: pg.text("description").notNull(),
    link: pg.varchar("link").notNull(),
    startDate: pg.date("start_date").notNull(),
    stage: stageEnum("stage").notNull().default("Идея"),
    sectorId: pg
        .varchar("sector_id", { length: 255 })
        .notNull()
        .references( () => startupsSectors.id),
});



export const startupsSectors = pg.pgTable("startups_sectors", {
    ...commonFields,
    name: pg.varchar("name", { length: 255 }).notNull(),
});


export const startupsSectorsRelations = relations(startups, ({ one }) => ({
    sector: one(startupsSectors, {
        references: [startupsSectors.id],
        fields: [startups.sectorId],
    }),
}));

export const sectorsStartupsRelations = relations(startupsSectors, ({ many }) => ({
    startups: many(startups),
}));

