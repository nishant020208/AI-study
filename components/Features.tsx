import { FileText, Video, Brain, MessageSquare, Zap, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "PDF & Document Analysis",
    description: "Upload lecture slides, textbooks, and PDFs. Get instant summaries and structured notes.",
    color: "text-primary"
  },
  {
    icon: Video,
    title: "YouTube Integration",
    description: "Transform video lectures into comprehensive study guides with timestamped notes.",
    color: "text-accent"
  },
  {
    icon: Brain,
    title: "Smart Flashcards",
    description: "Auto-generate flashcards from any content. Spaced repetition for optimal retention.",
    color: "text-primary-glow"
  },
  {
    icon: MessageSquare,
    title: "Interactive Q&A",
    description: "Chat with your study materials. Ask questions and get instant, contextual answers.",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Quiz Generation",
    description: "Practice with AI-generated quizzes tailored to your content and learning needs.",
    color: "text-accent"
  },
  {
    icon: CheckCircle2,
    title: "Topic Summaries",
    description: "Get concise, topic-based breakdowns for quick review before exams.",
    color: "text-primary-glow"
  }
];

export const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-subtle" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Excel</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI features designed to transform how you study and retain information
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="glass-card p-6 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
