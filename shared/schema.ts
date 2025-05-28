import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  childName: text("child_name").notNull(),
  animal: text("animal").notNull(),
  theme: text("theme").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStorySchema = createInsertSchema(stories).pick({
  childName: true,
  animal: true,
  theme: true,
});

export const storyRequestSchema = z.object({
  childName: z.string().min(1, "Child's name is required").max(50, "Name too long"),
  animal: z.enum(["lion", "elephant", "rabbit", "bear", "owl", "fox", "giraffe", "penguin"], {
    required_error: "Please select an animal",
  }),
  theme: z.enum([
    "friendship",
    "courage", 
    "sharing",
    "honesty",
    "perseverance",
    "empathy",
    "curiosity"
  ], {
    required_error: "Please select a theme",
  }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;
export type StoryRequest = z.infer<typeof storyRequestSchema>;
