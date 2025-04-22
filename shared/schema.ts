import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('student'),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default('draft'),
  form_data: jsonb("form_data").notNull().default({}),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  user_id: true,
  status: true,
  form_data: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Documents table
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  application_id: integer("application_id").notNull().references(() => applications.id),
  file_name: text("file_name").notNull(),
  storage_path: text("storage_path").notNull(),
  uploaded_at: timestamp("uploaded_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  application_id: true,
  file_name: true,
  storage_path: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Application history table for tracking status changes
export const applicationHistory = pgTable("application_history", {
  id: serial("id").primaryKey(),
  application_id: integer("application_id").notNull().references(() => applications.id),
  status: text("status").notNull(),
  notes: text("notes"),
  created_by: integer("created_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertApplicationHistorySchema = createInsertSchema(applicationHistory).pick({
  application_id: true,
  status: true,
  notes: true,
  created_by: true,
});

export type InsertApplicationHistory = z.infer<typeof insertApplicationHistorySchema>;
export type ApplicationHistory = typeof applicationHistory.$inferSelect;

// Validation schemas for application forms
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
});

export const educationInfoSchema = z.object({
  highSchool: z.object({
    name: z.string().min(1, "High school name is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    gpa: z.string().min(1, "GPA is required"),
  }),
  college: z.object({
    attended: z.boolean().default(false),
    name: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
  }).optional(),
});

export const programInfoSchema = z.object({
  type: z.string().min(1, "Program type is required"),
  major: z.string().min(1, "Major is required"),
  startTerm: z.string().min(1, "Start term is required"),
  campus: z.string().min(1, "Campus is required"),
  question: z.string().min(1, "Please answer the question"),
});

export const applicationFormSchema = z.object({
  personalInfo: personalInfoSchema,
  educationInfo: educationInfoSchema,
  programInfo: programInfoSchema,
});

export type ApplicationForm = z.infer<typeof applicationFormSchema>;
