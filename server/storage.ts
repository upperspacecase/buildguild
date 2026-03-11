import { 
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type PendingProject,
  type InsertPendingProject,
  type GuildMember,
  type InsertGuildMember,
  type InterestSubmission,
  type InsertInterestSubmission,
  users,
  projects,
  pendingProjects,
  guildMembers,
  interestSubmissions
} from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Pending project methods
  createPendingProject(pendingProject: InsertPendingProject): Promise<PendingProject>;
  getPendingProjects(): Promise<PendingProject[]>;
  approvePendingProject(id: string): Promise<Project | null>;
  rejectPendingProject(id: string): Promise<void>;
  
  // Guild member methods
  getGuildMembers(projectId: string): Promise<GuildMember[]>;
  addGuildMember(member: InsertGuildMember): Promise<GuildMember>;
  
  // Interest submission methods
  createInterestSubmission(submission: InsertInterestSubmission): Promise<InterestSubmission>;
  getInterestSubmissions(projectId: string): Promise<InterestSubmission[]>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.startDate));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  // Pending project methods
  async createPendingProject(pendingProject: InsertPendingProject): Promise<PendingProject> {
    const result = await db.insert(pendingProjects).values(pendingProject).returning();
    return result[0];
  }

  async getPendingProjects(): Promise<PendingProject[]> {
    return await db.select().from(pendingProjects).where(eq(pendingProjects.status, "pending")).orderBy(desc(pendingProjects.submittedAt));
  }

  async approvePendingProject(id: string): Promise<Project | null> {
    const pending = await db.select().from(pendingProjects).where(eq(pendingProjects.id, id)).limit(1);
    
    if (!pending[0] || pending[0].status !== "pending") {
      return null;
    }

    const newProject: InsertProject = {
      name: pending[0].name,
      description: pending[0].description,
      startDate: pending[0].startDate,
      endDate: pending[0].endDate,
      location: pending[0].location,
      category: pending[0].category,
      resourcesNeeded: pending[0].resourcesNeeded,
      image: pending[0].image,
    };

    const result = await db.insert(projects).values(newProject).returning();
    
    await db.update(pendingProjects)
      .set({ status: "approved" })
      .where(eq(pendingProjects.id, id));

    return result[0];
  }

  async rejectPendingProject(id: string): Promise<void> {
    await db.update(pendingProjects)
      .set({ status: "rejected" })
      .where(eq(pendingProjects.id, id));
  }

  // Guild member methods
  async getGuildMembers(projectId: string): Promise<GuildMember[]> {
    return await db.select().from(guildMembers).where(eq(guildMembers.projectId, projectId));
  }

  async addGuildMember(member: InsertGuildMember): Promise<GuildMember> {
    const result = await db.insert(guildMembers).values(member).returning();
    return result[0];
  }

  // Interest submission methods
  async createInterestSubmission(submission: InsertInterestSubmission): Promise<InterestSubmission> {
    const result = await db.insert(interestSubmissions).values(submission).returning();
    return result[0];
  }

  async getInterestSubmissions(projectId: string): Promise<InterestSubmission[]> {
    return await db.select().from(interestSubmissions).where(eq(interestSubmissions.projectId, projectId));
  }
}

export const storage = new DbStorage();
