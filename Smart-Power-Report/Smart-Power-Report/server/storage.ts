import { db } from "./db";
import {
  systemStatus,
  powerEvents,
  type SystemStatus,
  type PowerEvent,
  type UpdateStatusRequest,
  type InsertPowerEvent,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // System Status
  getStatus(): Promise<SystemStatus>;
  updateStatus(updates: UpdateStatusRequest): Promise<SystemStatus>;
  
  // Power Events
  getEvents(): Promise<PowerEvent[]>;
  createEvent(event: InsertPowerEvent): Promise<PowerEvent>;
  clearEvents(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getStatus(): Promise<SystemStatus> {
    const [status] = await db.select().from(systemStatus).limit(1);
    if (!status) {
      // Create initial status if none exists
      const [newStatus] = await db.insert(systemStatus).values({
        gridStatus: true,
        batteryLevel: 100,
        criticalLoadActive: true,
        nonCriticalLoadActive: true,
      }).returning();
      return newStatus;
    }
    return status;
  }

  async updateStatus(updates: UpdateStatusRequest): Promise<SystemStatus> {
    const status = await this.getStatus();
    const [updated] = await db.update(systemStatus)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(systemStatus.id, status.id))
      .returning();
    return updated;
  }

  async getEvents(): Promise<PowerEvent[]> {
    return await db.select().from(powerEvents).orderBy(desc(powerEvents.timestamp)).limit(50);
  }

  async createEvent(event: InsertPowerEvent): Promise<PowerEvent> {
    const [newEvent] = await db.insert(powerEvents).values(event).returning();
    return newEvent;
  }

  async clearEvents(): Promise<void> {
    await db.delete(powerEvents);
  }
}

export const storage = new DatabaseStorage();
