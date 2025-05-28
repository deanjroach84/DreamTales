// This file is not used in the frontend but provides reference for the OpenAI integration
// The actual OpenAI integration is handled on the server side in server/routes.ts

export interface StoryGenerationRequest {
  childName: string;
  animal: string;
  theme: string;
}

export interface StoryGenerationResponse {
  title: string;
  content: string;
}

// This would be used on the server side for OpenAI integration
// The actual implementation is in server/routes.ts
