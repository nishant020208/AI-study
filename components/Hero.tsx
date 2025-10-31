import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-study.jpg";
import { DemoVideoDialog } from "./DemoVideoDialog";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [showDemo, setShowDemo] = useState(false);
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute inset-0 bg-gradient-hero opacity-10 animate-pulse-glow" />
      
      {/* Hero content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Learning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Study Smarter,{" "}
              <span className="gradient-text">Not Harder</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Transform lectures, PDFs, and videos into organized notes, flashcards, and quizzes instantly. 
              Your AI-powered study companion for academic excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="group shadow-elegant hover:shadow-glow transition-all duration-300"
                onClick={onGetStarted}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2"
                onClick={() => setShowDemo(true)}
              >
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-hero border-2 border-background"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">10,000+ Students</div>
                <div className="text-muted-foreground">Already studying smarter</div>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <img 
              src={heroImage} 
              alt="AI Study Assistant Interface" 
              className="relative w-full rounded-2xl shadow-elegant glass-card"
            />
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <DemoVideoDialog open={showDemo} onOpenChange={setShowDemo} />
    </section>
  );
};
