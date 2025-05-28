import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { storyRequestSchema, type StoryRequest, type Story } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AnimalSelector } from "./animal-selector";
import { Sparkles } from "lucide-react";

interface StoryFormProps {
  onStoryGenerated: (story: Story) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export function StoryForm({ onStoryGenerated, isGenerating, setIsGenerating }: StoryFormProps) {
  const { toast } = useToast();

  const form = useForm<StoryRequest>({
    resolver: zodResolver(storyRequestSchema),
    defaultValues: {
      childName: "",
      animal: undefined,
      theme: undefined,
    },
  });

  const generateStoryMutation = useMutation({
    mutationFn: async (data: StoryRequest) => {
      const response = await apiRequest("POST", "/api/stories/generate", data);
      return response.json() as Promise<Story>;
    },
    onSuccess: (story) => {
      onStoryGenerated(story);
      setIsGenerating(false);
      toast({
        title: "Story Generated! ✨",
        description: "Your magical bedtime story is ready!",
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Story Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: StoryRequest) => {
    setIsGenerating(true);
    generateStoryMutation.mutate(data);
  };

  return (
    <div className="bg-cloud-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-coral-pink/20 to-sunshine-yellow/20 rounded-full transform translate-x-16 -translate-y-16"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="bg-lavender p-3 rounded-2xl mr-4">
            <Sparkles className="text-2xl text-purple-600 w-6 h-6" />
          </div>
          <h2 className="font-fredoka text-3xl text-gray-800">Create Your Story</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Child's Name Input */}
            <FormField
              control={form.control}
              name="childName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 font-medium text-lg">
                    <i className="fas fa-user text-coral-pink mr-2"></i>
                    What's your child's name?
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your child's name..."
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gentle-gray focus:border-lavender text-lg"
                      disabled={isGenerating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Favorite Animal Selection */}
            <FormField
              control={form.control}
              name="animal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 font-medium text-lg">
                    <i className="fas fa-paw text-soft-green mr-2"></i>
                    Choose a favorite animal:
                  </FormLabel>
                  <FormControl>
                    <AnimalSelector
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isGenerating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Theme/Message Selection */}
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 font-medium text-lg">
                    <i className="fas fa-heart text-coral-pink mr-2"></i>
                    What lesson should the story teach?
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isGenerating}>
                    <FormControl>
                      <SelectTrigger className="w-full px-4 py-3 rounded-2xl border-2 border-gentle-gray focus:border-lavender text-lg">
                        <SelectValue placeholder="Choose a theme..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="friendship">Friendship & Kindness</SelectItem>
                      <SelectItem value="courage">Courage & Bravery</SelectItem>
                      <SelectItem value="sharing">Sharing & Caring</SelectItem>
                      <SelectItem value="honesty">Honesty & Truth</SelectItem>
                      <SelectItem value="perseverance">Never Giving Up</SelectItem>
                      <SelectItem value="empathy">Understanding Others</SelectItem>
                      <SelectItem value="curiosity">Exploring & Learning</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Generate Button */}
            <Button 
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-pink-400 to-yellow-400 hover:from-pink-500 hover:to-yellow-500 text-white font-semibold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isGenerating ? "Creating Magic..." : "Create My Magic Story"}</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
