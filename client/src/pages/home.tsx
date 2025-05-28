import { useState } from "react";
import { StoryForm } from "@/components/story-form";
import { StoryDisplay } from "@/components/story-display";
import { type Story } from "@shared/schema";

export default function Home() {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative py-8 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-2 h-2 bg-sunshine-yellow rounded-full animate-twinkle"></div>
          <div className="absolute top-20 right-1/3 w-1 h-1 bg-coral-pink rounded-full animate-twinkle" style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute top-16 right-1/4 w-1.5 h-1.5 bg-gentle-blue rounded-full animate-twinkle" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="font-fredoka text-5xl md:text-7xl text-gray-800 mb-4 rainbow-title inline-block">
            DreamTales
          </h1>
          <p className="text-black text-xl md:text-4xl font-fredoka max-w-2xl mx-auto px-4 mt-6">
            Turn your child into the hero of their own magical adventure with their favorite animal friend
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <StoryForm 
            onStoryGenerated={setCurrentStory}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
          <StoryDisplay 
            story={currentStory}
            isGenerating={isGenerating}
          />
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="font-fredoka text-3xl text-white mb-8">Why Choose DreamTales?</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-cloud-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="bg-coral-pink/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-2xl text-pink-600"></i>
              </div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Personalized Stories</h4>
              <p className="text-gray-600 text-sm">Every story is uniquely crafted with your child's name and favorite animal as the main characters.</p>
            </div>
            
            <div className="bg-cloud-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="bg-gentle-blue/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-graduation-cap text-2xl text-blue-600"></i>
              </div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Educational Themes</h4>
              <p className="text-gray-600 text-sm">Each story teaches valuable life lessons about friendship, courage, kindness, and more.</p>
            </div>
            
            <div className="bg-cloud-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="bg-soft-green/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-moon text-2xl text-green-600"></i>
              </div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Perfect for Bedtime</h4>
              <p className="text-gray-600 text-sm">Long, engaging stories designed to create a peaceful bedtime routine and sweet dreams.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80 text-sm">© 2024 DreamTales. Creating magical bedtime stories for children everywhere. ✨</p>
        </div>
      </footer>
    </div>
  );
}
