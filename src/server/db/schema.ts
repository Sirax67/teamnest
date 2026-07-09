
import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import {commonFields} from "./untils"
import { user } from "./auth-schema";
export * from "./auth-schema";
export * from "./file";



export const personnel = pg.pgTable("personnel", {
    ...commonFields,
    userId: pg.text("user_id")
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: "cascade" }),
    avatar: pg.varchar("avatar", { length: 500 }).default("/images/default-avatar.svg"),
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





export const userPersonnelRelations = relations(user, ({ one }) => ({
    personnel: one(personnel, {
        fields: [user.id],
        references: [personnel.userId],
    }),
}));

export const personnelUserRelations = relations(personnel, ({ one }) => ({
    user: one(user, {
        fields: [personnel.userId],
        references: [user.id],
    }),
}));

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
    userId: pg.text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    logo: pg.varchar("logo", { length: 500 }),
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


export const startupsSectorsRelations = relations(startups, ({ one, many }) => ({
    sector: one(startupsSectors, {
        references: [startupsSectors.id],
        fields: [startups.sectorId],
    }),
    user: one(user, {
        references: [user.id],
        fields: [startups.userId],
    }),
    vacancies: many(startupVacancies),
    members: many(startupMembers),
}));

export const sectorsStartupsRelations = relations(startupsSectors, ({ many }) => ({
    startups: many(startups),
}));

export const userStartupsRelations = relations(user, ({ many }) => ({
    startups: many(startups),
}));

export const startupVacancies = pg.pgTable("startup_vacancies", {
    ...commonFields,
    startupId: pg.varchar("startup_id", { length: 255 })
        .notNull()
        .references(() => startups.id, { onDelete: "cascade" }),
    categoryId: pg.varchar("category_id", { length: 255 })
        .notNull()
        .references(() => personnelCategories.id),
    specialtyId: pg.varchar("specialty_id", { length: 255 })
        .references(() => personnelSpecialties.id),
    description: pg.text("description"),
});

export const startupVacanciesRelations = relations(startupVacancies, ({ one }) => ({
    startup: one(startups, {
        fields: [startupVacancies.startupId],
        references: [startups.id],
    }),
    category: one(personnelCategories, {
        fields: [startupVacancies.categoryId],
        references: [personnelCategories.id],
    }),
    specialty: one(personnelSpecialties, {
        fields: [startupVacancies.specialtyId],
        references: [personnelSpecialties.id],
    }),
}));

export const startupMembers = pg.pgTable("startup_members", {
    ...commonFields,
    startupId: pg.varchar("startup_id", { length: 255 })
        .notNull()
        .references(() => startups.id, { onDelete: "cascade" }),
    personnelId: pg.varchar("personnel_id", { length: 255 })
        .notNull()
        .references(() => personnel.id, { onDelete: "cascade" }),
    role: pg.varchar("role", { length: 255 }),
});

export const startupMembersRelations = relations(startupMembers, ({ one }) => ({
    startup: one(startups, {
        fields: [startupMembers.startupId],
        references: [startups.id],
    }),
    personnel: one(personnel, {
        fields: [startupMembers.personnelId],
        references: [personnel.id],
    }),
}));

export const applications = pg.pgTable("applications", {
    ...commonFields,
    personnelId: pg.varchar("personnel_id", { length: 255 }).notNull().references(() => personnel.id),
    vacancyId: pg.varchar("vacancy_id", { length: 255 }).notNull().references(() => startupVacancies.id),
    startupId: pg.varchar("startup_id", { length: 255 }).notNull().references(() => startups.id),
    status: pg.varchar("status", { length: 50 }).notNull().default("pending"), 
})

export const applicationsRelations = relations(applications, ({ one }) => ({
    personnel: one(personnel, {
        fields: [applications.personnelId],
        references: [personnel.id]
    }),
    vacancy: one(startupVacancies, {
        fields: [applications.vacancyId],
        references: [startupVacancies.id],
    }),
    startup: one(startups, {
        fields: [applications.startupId],
        references: [startups.id],
    }),
}))

export const invitations = pg.pgTable("invitations", {
    ...commonFields,
    startupId: pg.varchar("startup_id", { length: 255 }).notNull().references(() => startups.id),
    personnelId: pg.varchar("personnel_id", { length: 255 }).notNull().references(() => personnel.id),
    vacancyId: pg.varchar("vacancy_id", { length: 255 }).references(() => startupVacancies.id),
    status: pg.varchar("status", { length: 50 }).notNull().default("pending"),
})

export const invitationsRelations = relations(invitations, ({ one }) => ({
    startup: one(startups, { fields: [invitations.startupId], references: [startups.id] }),
    personnel: one(personnel, { fields: [invitations.personnelId], references: [personnel.id] }),
    vacancy: one(startupVacancies, { fields: [invitations.vacancyId], references: [startupVacancies.id] }),
}))

export const favorites = pg.pgTable("favorites", {
    ...commonFields,
    userId: pg.text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    type: pg.varchar("type", { length: 50 }).notNull(), // "startup" | "personnel"
    targetId: pg.varchar("target_id", { length: 255 }).notNull(),
})

export const favoritesRelations = relations(favorites, ({ one }) => ({
    user: one(user, { fields: [favorites.userId], references: [user.id] }),
}))