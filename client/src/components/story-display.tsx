import { type Story } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Printer, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StoryDisplayProps {
  story: Story | null;
  isGenerating: boolean;
}

export function StoryDisplay({ story, isGenerating }: StoryDisplayProps) {
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Ready",
      description: "Your story is ready to print!",
    });
  };

  const handleDownload = () => {
    if (!story) return;
    
    const content = `${story.title}\n\n${story.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Story Downloaded",
      description: "Your magical story has been saved!",
    });
  };

  const handleShare = async () => {
    if (!story) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: `Check out this magical bedtime story: ${story.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
      toast({
        title: "Story Copied",
        description: "Story has been copied to clipboard!",
      });
    }
  };

  return (
    <Card className="bg-cloud-white rounded-3xl shadow-xl relative overflow-hidden">
      {/* Dreamy background illustration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-lavender/10 to-transparent rounded-t-3xl"></div>
      
      <CardContent className="p-8 relative z-10">
        {/* Story Header */}
        <div className="flex items-center mb-6">
          <div className="bg-soft-green p-3 rounded-2xl mr-4">
            <BookOpen className="text-2xl text-green-600 w-6 h-6" />
          </div>
          <h2 className="font-fredoka text-3xl text-gray-800">Your Magical Story</h2>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-64 h-48 mx-auto rounded-2xl bg-gradient-to-br from-lavender/20 to-gentle-blue/20 animate-float flex items-center justify-center">
                <div className="text-6xl animate-bounce-gentle">✨</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-coral-pink rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-sunshine-yellow rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 bg-gentle-blue rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Creating your magical story...</p>
            <p className="text-gray-500 text-sm mt-2">This might take a moment ✨</p>
          </div>
        )}

        {/* Story Content */}
        {!isGenerating && (
          <div className="space-y-6">
            {/* Default content when no story */}
            {!story && (
              <div className="space-y-6">
                <div className="w-full h-64 object-cover rounded-2xl mb-6 bg-gradient-to-br from-lavender/20 to-gentle-blue/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-gray-600 font-medium">Ready to create magic?</p>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <h3 className="font-fredoka text-2xl text-gray-800 mb-4">
                    Welcome to DreamTales!
                  </h3>
                  
                  <div className="story-text text-gray-700 space-y-4">
                    <p>Choose your child's name, their favorite animal, and a meaningful theme to create a personalized bedtime story that will spark their imagination and teach valuable life lessons.</p>
                    
                    <p>Our magical story generator will create a unique tale featuring your child as the main character, alongside their favorite animal friend. Each story is carefully crafted to be engaging, educational, and perfect for bedtime reading.</p>
                    
                    <p>Fill out the form on the left to begin your storytelling adventure! ✨</p>
                  </div>
                </div>
              </div>
            )}

            {/* Generated story content */}
            {story && (
              <div className="space-y-6">
                <div className="w-full h-64 object-cover rounded-2xl mb-6 bg-gradient-to-br from-lavender/20 to-gentle-blue/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌟</div>
                    <p className="text-gray-600 font-medium">Your magical story is ready!</p>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <h3 className="font-fredoka text-2xl text-gray-800 mb-4">
                    {story.title}
                  </h3>
                  
                  <div className="story-text text-gray-700 space-y-4">
                    {story.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="opacity-0 animate-in fade-in duration-700" style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'forwards' }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Story Actions */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-gentle-gray">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex items-center space-x-2 bg-lavender hover:bg-purple-100 text-purple-700 border-lavender"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Story</span>
                  </Button>
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="flex items-center space-x-2 bg-soft-green hover:bg-green-100 text-green-700 border-soft-green"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Story</span>
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex items-center space-x-2 bg-sunshine-yellow hover:bg-orange-100 text-orange-700 border-sunshine-yellow"
                  >
                    <Share className="w-4 h-4" />
                    <span>Share Story</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
