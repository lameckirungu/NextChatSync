import { users, applications, documents, applicationHistory, type User, type InsertUser, type Application, type InsertApplication, type Document, type InsertDocument, type ApplicationHistory, type InsertApplicationHistory } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import * as crypto from "crypto";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByUserId(userId: number): Promise<Application[]>;
  getAllApplications(): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application | undefined>;
  updateApplicationStatus(id: number, status: string, userId: number, notes?: string): Promise<Application | undefined>;
  
  // Document operations
  getDocumentsByApplicationId(applicationId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Application history operations
  getApplicationHistoryByApplicationId(applicationId: number): Promise<ApplicationHistory[]>;
  createApplicationHistory(history: InsertApplicationHistory): Promise<ApplicationHistory>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(insertUser.password, salt);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }
  
  // Application operations
  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByUserId(userId: number): Promise<Application[]> {
    return db.select().from(applications).where(eq(applications.user_id, userId));
  }

  async getAllApplications(): Promise<Application[]> {
    return db.select().from(applications);
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application | undefined> {
    const [updatedApplication] = await db
      .update(applications)
      .set({
        ...application,
        updated_at: new Date(),
      })
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  async updateApplicationStatus(id: number, status: string, userId: number, notes?: string): Promise<Application | undefined> {
    const [updatedApplication] = await db
      .update(applications)
      .set({
        status,
        updated_at: new Date(),
      })
      .where(eq(applications.id, id))
      .returning();
    
    if (updatedApplication) {
      await this.createApplicationHistory({
        application_id: id,
        status,
        notes,
        created_by: userId,
      });
    }
    
    return updatedApplication;
  }
  
  // Document operations
  async getDocumentsByApplicationId(applicationId: number): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.application_id, applicationId));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db
      .insert(documents)
      .values(document)
      .returning();
    return newDocument;
  }
  
  // Application history operations
  async getApplicationHistoryByApplicationId(applicationId: number): Promise<ApplicationHistory[]> {
    return db.select().from(applicationHistory).where(eq(applicationHistory.application_id, applicationId));
  }

  async createApplicationHistory(history: InsertApplicationHistory): Promise<ApplicationHistory> {
    const [newHistory] = await db
      .insert(applicationHistory)
      .values(history)
      .returning();
    return newHistory;
  }
  
  // Authentication utility methods
  async verifyPassword(providedPassword: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(providedPassword, storedPassword);
  }
}

export const storage = new DatabaseStorage();
