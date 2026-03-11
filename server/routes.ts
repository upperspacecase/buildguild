import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema,
  insertPendingProjectSchema, 
  insertGuildMemberSchema,
  insertInterestSubmissionSchema
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      
      // Get guild members for each project
      const projectsWithMembers = await Promise.all(
        projects.map(async (project) => {
          const members = await storage.getGuildMembers(project.id);
          return {
            ...project,
            team: members.map(m => ({ name: m.name, role: m.role }))
          };
        })
      );
      
      res.json(projectsWithMembers);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const members = await storage.getGuildMembers(project.id);
      
      res.json({
        ...project,
        team: members.map(m => ({ name: m.name, role: m.role }))
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Submit a new project (goes to pending queue for admin approval)
  app.post("/api/projects/submit", async (req, res) => {
    try {
      const validation = insertPendingProjectSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: fromError(validation.error).toString() 
        });
      }

      const pendingProject = await storage.createPendingProject(validation.data);
      
      res.status(201).json({ 
        message: "Project submitted for approval",
        id: pendingProject.id 
      });
    } catch (error) {
      console.error("Error submitting project:", error);
      res.status(500).json({ error: "Failed to submit project" });
    }
  });

  // Submit interest in a project
  app.post("/api/projects/:id/interest", async (req, res) => {
    try {
      const validation = insertInterestSubmissionSchema.safeParse({
        ...req.body,
        projectId: req.params.id
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: fromError(validation.error).toString() 
        });
      }

      const submission = await storage.createInterestSubmission(validation.data);
      
      // Also add as a guild member automatically
      await storage.addGuildMember({
        projectId: req.params.id,
        name: validation.data.name,
        role: "Contributor"
      });
      
      res.status(201).json({ 
        message: "Interest submitted successfully",
        id: submission.id 
      });
    } catch (error) {
      console.error("Error submitting interest:", error);
      res.status(500).json({ error: "Failed to submit interest" });
    }
  });

  // Get interest submissions for a project (admin/project lead only in production)
  app.get("/api/projects/:id/interests", async (req, res) => {
    try {
      const submissions = await storage.getInterestSubmissions(req.params.id);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching interest submissions:", error);
      res.status(500).json({ error: "Failed to fetch interest submissions" });
    }
  });

  // Admin routes - get pending projects
  app.get("/api/admin/pending-projects", async (req, res) => {
    try {
      const pending = await storage.getPendingProjects();
      res.json(pending);
    } catch (error) {
      console.error("Error fetching pending projects:", error);
      res.status(500).json({ error: "Failed to fetch pending projects" });
    }
  });

  // Admin routes - approve pending project
  app.post("/api/admin/pending-projects/:id/approve", async (req, res) => {
    try {
      const approvedProject = await storage.approvePendingProject(req.params.id);
      
      if (!approvedProject) {
        return res.status(404).json({ error: "Pending project not found or already processed" });
      }
      
      res.json({ 
        message: "Project approved and published",
        project: approvedProject 
      });
    } catch (error) {
      console.error("Error approving project:", error);
      res.status(500).json({ error: "Failed to approve project" });
    }
  });

  // Admin routes - reject pending project
  app.post("/api/admin/pending-projects/:id/reject", async (req, res) => {
    try {
      await storage.rejectPendingProject(req.params.id);
      res.json({ message: "Project rejected" });
    } catch (error) {
      console.error("Error rejecting project:", error);
      res.status(500).json({ error: "Failed to reject project" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
