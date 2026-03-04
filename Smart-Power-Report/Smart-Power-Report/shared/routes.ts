import { z } from 'zod';
import { insertSystemStatusSchema, insertPowerEventSchema, systemStatus, powerEvents } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  status: {
    get: {
      method: 'GET' as const,
      path: '/api/status' as const,
      responses: {
        200: z.custom<typeof systemStatus.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/status' as const,
      input: insertSystemStatusSchema.partial(),
      responses: {
        200: z.custom<typeof systemStatus.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events' as const,
      responses: {
        200: z.array(z.custom<typeof powerEvents.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events' as const,
      input: insertPowerEventSchema,
      responses: {
        201: z.custom<typeof powerEvents.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    clear: {
      method: 'DELETE' as const,
      path: '/api/events' as const,
      responses: {
        204: z.void(),
      }
    }
  }
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type StatusUpdateInput = z.infer<typeof api.status.update.input>;
export type EventInput = z.infer<typeof api.events.create.input>;
