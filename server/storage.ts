import { users, stories, type User, type InsertUser, type Story, type InsertStory } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createStory(story: InsertStory & { title: string; content: string }): Promise<Story>;
  getStory(id: number): Promise<Story | undefined>;
  getStoriesByChild(childName: string): Promise<Story[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stories: Map<number, Story>;
  private currentUserId: number;
  private currentStoryId: number;

  constructor() {
    this.users = new Map();
    this.stories = new Map();
    this.currentUserId = 1;
    this.currentStoryId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createStory(storyData: InsertStory & { title: string; content: string }): Promise<Story> {
    const id = this.currentStoryId++;
    const story: Story = {
      ...storyData,
      id,
      createdAt: new Date(),
    };
    this.stories.set(id, story);
    return story;
  }

  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getStoriesByChild(childName: string): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(
      (story) => story.childName.toLowerCase() === childName.toLowerCase(),
    );
  }
}

export const storage = new MemStorage();
