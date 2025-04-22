import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import "../shared/types";
import { storage } from "./storage";
import { insertUserSchema, insertApplicationSchema, insertDocumentSchema } from "@shared/schema";
import { createClient } from '@supabase/supabase-js';
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
      cb(null, `${uuidv4()}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  fileFilter: function(req, file, cb) {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and DOC files are allowed.'));
    }
  }
});

// Helper function for session authentication
const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Helper function for admin authorization
const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ message: "Access forbidden" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationError.details
      });
    }
    next(err);
  });

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        return res.status(400).json({ message: authError.message });
      }

      // Create user in our database
      const user = await storage.createUser(userData);
      
      res.status(201).json({ 
        message: "User registered successfully", 
        user: { id: user.id, email: user.email, role: user.role } 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if user exists in our database
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return res.status(400).json({ message: authError.message });
      }

      // Set session
      req.session.user = { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      };
      
      res.status(200).json({ 
        message: "Login successful", 
        user: { id: user.id, email: user.email, role: user.role } 
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      // Call Supabase reset password API
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(200).json({ message: "If an account with that email exists, a reset link has been sent." });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { password, token } = req.body;
      
      // Update user password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User routes
  app.get('/api/user', authenticateUser, async (req, res) => {
    try {
      const { id } = req.session.user!;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Route to get all users
  app.get('/api/users', authenticateUser, async (req, res) => {
    try {
      const { role } = req.session.user!;
      
      // Only admins can get all users
      if (role !== 'admin') {
        return res.status(403).json({ message: "Access forbidden" });
      }
      
      const users = await storage.getAllUsers();
      
      // Map to remove passwords
      const sanitizedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        // Calculate applications count (this is a placeholder - in a real implementation, you'd do a join)
        applications_count: 0
      }));
      
      res.status(200).json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Route to update a user's role
  app.put('/api/users/:id/role', authenticateUser, async (req, res) => {
    try {
      const { role: currentUserRole } = req.session.user!;
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      // Only admins can update roles
      if (currentUserRole !== 'admin') {
        return res.status(403).json({ message: "Access forbidden" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUserRole(userId, role);
      
      res.status(200).json({
        id: updatedUser?.id,
        email: updatedUser?.email,
        role: updatedUser?.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Application routes
  app.get('/api/applications', authenticateUser, async (req, res) => {
    try {
      const { id, role } = req.session.user!;
      
      let applications;
      if (role === 'admin') {
        applications = await storage.getAllApplications();
      } else {
        applications = await storage.getApplicationsByUserId(id);
      }
      
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/applications/:id', authenticateUser, async (req, res) => {
    try {
      const { id: userId, role } = req.session.user!;
      const applicationId = parseInt(req.params.id);
      
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user has permission to view this application
      if (role !== 'admin' && application.user_id !== userId) {
        return res.status(403).json({ message: "Access forbidden" });
      }
      
      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/applications', authenticateUser, async (req, res) => {
    try {
      const { id: userId } = req.session.user!;
      
      const applicationData = insertApplicationSchema.parse({
        ...req.body,
        user_id: userId,
      });
      
      const application = await storage.createApplication(applicationData);
      
      // Create initial history entry
      await storage.createApplicationHistory({
        application_id: application.id,
        status: application.status,
        created_by: userId,
        notes: "Application created",
      });
      
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put('/api/applications/:id', authenticateUser, async (req, res) => {
    try {
      const { id: userId, role } = req.session.user!;
      const applicationId = parseInt(req.params.id);
      
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user has permission to update this application
      if (role !== 'admin' && application.user_id !== userId) {
        return res.status(403).json({ message: "Access forbidden" });
      }
      
      const updatedApplication = await storage.updateApplication(applicationId, req.body);
      
      res.status(200).json(updatedApplication);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put('/api/applications/:id/status', authenticateUser, async (req, res) => {
    try {
      const { id: userId, role } = req.session.user!;
      const applicationId = parseInt(req.params.id);
      const { status, notes } = req.body;
      
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user has permission to update this application's status
      if (role !== 'admin' && application.user_id !== userId) {
        return res.status(403).json({ message: "Access forbidden" });
      }
      
      // For students, only allow submitting their own applications
      if (role !== 'admin' && status !== 'submitted') {
        return res.status(403).json({ message: "Students can only submit applications" });
      }
      
      const updatedApplication = await storage.updateApplicationStatus(applicationId, status, userId, notes);
      
      // TODO: Send email notification for status change
      
      res.status(200).json(updatedApplication);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Document upload routes
  app.post('/api/applications/:id/documents', authenticateUser, upload.single('file'), async (req, res) => {
    try {
      const { id: userId, role } = req.session.user!;
      const applicationId = parseInt(req.params.id);
      
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user has permission to upload to this application
      if (role !== 'admin' && application.user_id !== userId) {
        return res.status(403).json({ message: "Access forbidden" });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Upload file to Supabase Storage
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileName = req.file.originalname;
      const storagePath = `application-documents/${applicationId}/${uuidv4()}-${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(storagePath, fileBuffer, {
          contentType: req.file.mimetype,
        });
      
      // Delete temp file
      fs.unlinkSync(req.file.path);
      
      if (uploadError) {
        return res.status(400).json({ message: uploadError.message });
      }
      
      // Save document metadata to database
      const document = await storage.createDocument({
        application_id: applicationId,
        file_name: fileName,
        storage_path: storagePath,
      });
      
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/applications/:id/documents', authenticateUser, async (req, res) => {
    try {
      const { id: userId, role } = req.session.user!;
      const applicationId = parseInt(req.params.id);
      
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user has permission to view this application's documents
      if (role !== 'admin' && application.user_id !== userId) {
        return res.status(403).json({ message: "Access forbidden" });
      }
      
      const documents = await storage.getDocumentsByApplicationId(applicationId);
      
      // Generate signed URLs for each document
      const documentsWithUrls = await Promise.all(documents.map(async (doc) => {
        const { data: urlData } = await supabase.storage
          .from('application-documents')
          .createSignedUrl(doc.storage_path, 60 * 60); // 1 hour expiry
        
        return {
          ...doc,
          url: urlData?.signedUrl || null,
        };
      }));
      
      res.status(200).json(documentsWithUrls);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Application history routes
  app.get('/api/applications/:id/history', authenticateUser, async (req, res) => {
    try {
      const { id: userId, role } = req.session.user!;
      const applicationId = parseInt(req.params.id);
      
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user has permission to view this application's history
      if (role !== 'admin' && application.user_id !== userId) {
        return res.status(403).json({ message: "Access forbidden" });
      }
      
      const history = await storage.getApplicationHistoryByApplicationId(applicationId);
      
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin-only routes
  app.get('/api/admin/users', authenticateUser, authorizeAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove password field
      const sanitizedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }));
      
      res.status(200).json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put('/api/admin/users/:id/role', authenticateUser, authorizeAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUserRole(userId, role);
      
      res.status(200).json({
        id: updatedUser?.id,
        email: updatedUser?.email,
        role: updatedUser?.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
