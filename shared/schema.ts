import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  resourcesNeeded: text("resources_needed").array().notNull().default(sql`ARRAY[]::text[]`),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const selectProjectSchema = createSelectSchema(projects);

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const pendingProjects = pgTable("pending_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  resourcesNeeded: text("resources_needed").array().notNull().default(sql`ARRAY[]::text[]`),
  image: text("image").notNull(),
  submitterEmail: text("submitter_email").notNull(),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertPendingProjectSchema = createInsertSchema(pendingProjects).omit({
  id: true,
  status: true,
  submittedAt: true,
});

export const selectPendingProjectSchema = createSelectSchema(pendingProjects);

export type InsertPendingProject = z.infer<typeof insertPendingProjectSchema>;
export type PendingProject = typeof pendingProjects.$inferSelect;

export const guildMembers = pgTable("guild_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const insertGuildMemberSchema = createInsertSchema(guildMembers).omit({
  id: true,
  joinedAt: true,
});

export const selectGuildMemberSchema = createSelectSchema(guildMembers);

export type InsertGuildMember = z.infer<typeof insertGuildMemberSchema>;
export type GuildMember = typeof guildMembers.$inferSelect;

export const interestSubmissions = pgTable("interest_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  skills: text("skills").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertInterestSubmissionSchema = createInsertSchema(interestSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const selectInterestSubmissionSchema = createSelectSchema(interestSubmissions);

export type InsertInterestSubmission = z.infer<typeof insertInterestSubmissionSchema>;
export type InterestSubmission = typeof interestSubmissions.$inferSelect;
