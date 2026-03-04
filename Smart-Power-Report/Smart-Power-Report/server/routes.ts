import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Ensure database has an initial status
  await storage.getStatus();

  app.get(api.status.get.path, async (req, res) => {
    const status = await storage.getStatus();
    res.json(status);
  });

  app.patch(api.status.update.path, async (req, res) => {
    try {
      const input = api.status.update.input.parse(req.body);
      const updatedStatus = await storage.updateStatus(input);
      res.json(updatedStatus);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.post(api.events.create.path, async (req, res) => {
    try {
      const input = api.events.create.input.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.events.clear.path, async (req, res) => {
    await storage.clearEvents();
    res.status(204).end();
  });

  return httpServer;
}
