import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type StatusUpdateInput, type EventInput } from "@shared/routes";

// ============================================
// STATUS HOOKS
// ============================================

export function useSystemStatus() {
  return useQuery({
    queryKey: [api.status.get.path],
    queryFn: async () => {
      const res = await fetch(api.status.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch system status");
      const data = await res.json();
      return api.status.get.responses[200].parse(data);
    },
    // Poll every 2 seconds to simulate live hardware dashboard
    refetchInterval: 2000, 
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: StatusUpdateInput) => {
      const validated = api.status.update.input.parse(updates);
      const res = await fetch(api.status.update.path, {
        method: api.status.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.status.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update system status");
      }
      return api.status.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.status.get.path] });
    },
  });
}

// ============================================
// EVENT HOOKS
// ============================================

export function useSystemEvents() {
  return useQuery({
    queryKey: [api.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.events.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      // Ensure timestamps are parsed correctly if they come as strings
      const parsedData = data.map((d: any) => ({
        ...d,
        timestamp: new Date(d.timestamp)
      }));
      return api.events.list.responses[200].parse(parsedData);
    },
    refetchInterval: 5000,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (event: EventInput) => {
      const validated = api.events.create.input.parse(event);
      const res = await fetch(api.events.create.path, {
        method: api.events.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to log event");
      return api.events.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
    },
  });
}

export function useClearEvents() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.events.clear.path, {
        method: api.events.clear.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clear events");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
    },
  });
}
