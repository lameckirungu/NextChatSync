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
  surname: z.string().min(1, "Surname is required"),
  middleName: z.string().min(1, "Middle name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nationalIdNumber: z.string().min(1, "National ID/Birth Certificate number is required"),
  huduma: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  hasDisability: z.boolean().default(false),
  disabilityDetails: z.string().optional(),
  nhifNumber: z.string().min(1, "NHIF Card number is required"),
  religion: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required"),
  contactAddress: z.object({
    poBox: z.string().min(1, "P.O. Box is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    town: z.string().min(1, "Town is required"),
  }),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Please enter a valid email"),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"], { required_error: "Marital status is required" }),
  spouseDetails: z.object({
    name: z.string().optional(),
    occupation: z.string().optional(),
    phoneNumber: z.string().optional(),
    childrenCount: z.number().optional(),
  }).optional(),
  fatherDetails: z.object({
    name: z.string().min(1, "Father's name is required"),
    isAlive: z.boolean().default(true),
    occupation: z.string().optional(),
    dateOfBirth: z.string().optional(),
  }),
  motherDetails: z.object({
    name: z.string().min(1, "Mother's name is required"),
    isAlive: z.boolean().default(true),
    occupation: z.string().optional(),
    dateOfBirth: z.string().optional(),
  }),
  siblingsCount: z.number().optional(),
  birthPlace: z.string().min(1, "Place of birth is required"),
  permanentResidence: z.object({
    village: z.string().min(1, "Village/Town is required"),
    nearestTown: z.string().min(1, "Nearest town is required"),
    location: z.string().min(1, "Location is required"),
    chiefName: z.string().min(1, "Chief's name is required"),
    county: z.string().min(1, "County is required"),
    subCounty: z.string().min(1, "Sub-county is required"),
    constituency: z.string().min(1, "Constituency is required"),
    nearestPoliceStation: z.string().min(1, "Nearest police station is required"),
  }),
  emergencyContacts: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      relationship: z.string().min(1, "Relationship is required"),
      poBox: z.string().min(1, "P.O. Box is required"),
      postalCode: z.string().min(1, "Postal code is required"),
      town: z.string().min(1, "Town is required"),
      phoneNumber: z.string().min(1, "Phone number is required"),
      email: z.string().email("Please enter a valid email"),
    })
  ).min(2, "At least two emergency contacts are required"),
});

export const educationInfoSchema = z.object({
  secondarySchool: z.object({
    name: z.string().min(1, "School name is required"),
    indexNumber: z.string().min(1, "Index number is required"),
    yearCompleted: z.string().min(1, "Year completed is required"),
    results: z.string().min(1, "KCSE results are required"),
  }),
  primarySchool: z.object({
    name: z.string().min(1, "School name is required"),
    indexNumber: z.string().min(1, "Index number is required"),
    yearCompleted: z.string().min(1, "Year completed is required"),
    results: z.string().min(1, "KCPE results are required"),
  }),
  otherInstitutions: z.string().optional(),
});

export const programInfoSchema = z.object({
  school: z.string().min(1, "School is required"),
  programme: z.string().min(1, "Programme is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  campus: z.string().min(1, "Campus is required"),
  yearOfStudy: z.string().min(1, "Year of study is required"),
  semester: z.string().min(1, "Semester is required"),
  entryIntake: z.string().min(1, "Entry intake is required"),
  studyMode: z.enum(["Full Time", "Weekend", "Evening", "Part time"], { required_error: "Mode of study is required" }),
});

export const medicalInfoSchema = z.object({
  hospitalAdmission: z.object({
    wasAdmitted: z.boolean().default(false),
    details: z.string().optional(),
  }),
  medicalConditions: z.object({
    hasTuberculosis: z.boolean().default(false),
    hasNervousDisease: z.boolean().default(false),
    hasHeartDisease: z.boolean().default(false),
    hasDigestiveDisease: z.boolean().default(false),
    hasAllergies: z.boolean().default(false),
    hasSTDs: z.boolean().default(false),
    hasPolio: z.boolean().default(false),
    otherConditions: z.string().optional(),
  }),
  familyMedicalHistory: z.object({
    familyTuberculosis: z.boolean().default(false),
    familyMentalIllness: z.boolean().default(false),
    familyDiabetes: z.boolean().default(false),
    familyHeartDisease: z.boolean().default(false),
  }),
  immunization: z.object({
    smallpox: z.object({
      isImmunized: z.boolean().default(false),
      immunizationDate: z.string().optional(),
    }),
    tetanus: z.object({
      isImmunized: z.boolean().default(false),
      immunizationDate: z.string().optional(),
    }),
    polio: z.object({
      isImmunized: z.boolean().default(false),
      immunizationDate: z.string().optional(),
    }),
  }),
});

export const interestsSchema = z.object({
  sports: z.string().optional(),
  clubs: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export const accommodationSchema = z.object({
  residenceType: z.enum(["Resident", "Non-resident"], { required_error: "Residence type is required" }),
  residentDetails: z.object({
    hostelName: z.string().optional(),
    roomNumber: z.string().optional(),
  }).optional(),
  nonResidentDetails: z.object({
    residencePlace: z.string().optional(),
  }).optional(),
});

export const documentsSchema = z.object({
  nationalId: z.boolean().default(false),
  birthCertificate: z.boolean().default(false),
  kcpeResults: z.boolean().default(false),
  kcseResults: z.boolean().default(false),
  nhifCard: z.boolean().default(false),
  passportPhotos: z.boolean().default(false),
  acceptanceForm: z.boolean().default(false),
  medicalForm: z.boolean().default(false),
  imageConsentForm: z.boolean().default(false),
});

export const applicationFormSchema = z.object({
  personalInfo: personalInfoSchema,
  educationInfo: educationInfoSchema,
  programInfo: programInfoSchema,
  medicalInfo: medicalInfoSchema,
  interests: interestsSchema,
  accommodation: accommodationSchema,
  documents: documentsSchema,
});

export type ApplicationForm = z.infer<typeof applicationFormSchema>;
