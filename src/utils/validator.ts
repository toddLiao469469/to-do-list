import { z } from "zod";

export const createTodoInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoInputSchema>;
