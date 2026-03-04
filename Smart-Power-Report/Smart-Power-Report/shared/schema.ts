import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const systemStatus = pgTable("system_status", {
  id: serial("id").primaryKey(),
  gridStatus: boolean("grid_status").default(true).notNull(), // true = ON, false = OFF
  batteryLevel: integer("battery_level").default(100).notNull(), // 0 to 100
  criticalLoadActive: boolean("critical_load_active").default(true).notNull(),
  nonCriticalLoadActive: boolean("non_critical_load_active").default(true).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const powerEvents = pgTable("power_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // 'grid_failure', 'grid_restored', 'battery_low'
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// === BASE SCHEMAS ===
export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({ id: true, lastUpdated: true });
export const insertPowerEventSchema = createInsertSchema(powerEvents).omit({ id: true, timestamp: true });

// === EXPLICIT API CONTRACT TYPES ===
export type SystemStatus = typeof systemStatus.$inferSelect;
export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;

export type PowerEvent = typeof powerEvents.$inferSelect;
export type InsertPowerEvent = z.infer<typeof insertPowerEventSchema>;

export type UpdateStatusRequest = Partial<InsertSystemStatus>;
export type EventResponse = PowerEvent;
export type EventsListResponse = PowerEvent[];
