import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Loader2, Type, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const UploadSection = ({ onProcessComplete }: { onProcessComplete: (result: any) => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const { toast } = useToast();

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) return;

    setIsProcessing(true);
    
    // Simulate processing - will be replaced with actual API call
    setTimeout(() => {
      setIsProcessing(false);
      setYoutubeUrl("");
      toast({
        title: "Success!",
        description: "YouTube video has been processed",
      });
      onProcessComplete({
        type: 'youtube',
        url: youtubeUrl,
        notes: "Sample notes generated from YouTube video...",
        flashcards: [
          { question: "Sample question from video?", answer: "Sample answer" }
        ]
      });
    }, 2000);
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) {
      toast({
        title: "Error",
        description: "Please paste some text first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call edge function to process text
      const { data, error } = await supabase.functions.invoke('process-study-material', {
        body: {
          fileContent: pastedText,
          contentType: 'text',
          title: 'Pasted Text Material'
        }
      });

      if (error) throw error;

      // Save to database
      const { error: dbError } = await supabase
        .from('study_materials')
        .insert({
          title: 'Pasted Text Material',
          content_type: 'text',
          notes: data.notes,
          flashcards: data.flashcards,
          quiz_questions: data.quizQuestions
        });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Your text has been processed",
      });

      onProcessComplete({
        type: 'text',
        filename: 'Pasted Text',
        notes: data.notes,
        flashcards: data.flashcards,
        quizQuestions: data.quizQuestions
      });

      setPastedText("");
    } catch (error: any) {
      console.error('Text processing error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process text",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="upload-section" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Start <span className="gradient-text">Learning</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Upload your study materials and let AI do the heavy lifting
          </p>
        </div>

        <Card className="glass-card max-w-3xl mx-auto p-8 shadow-card">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                <Type className="w-4 h-4 mr-2" />
                Add TXT
              </TabsTrigger>
              <TabsTrigger value="youtube">
                <Link2 className="w-4 h-4 mr-2" />
                YouTube Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 mt-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-2">Have a PDF file?</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Convert your PDF to text format first using this free tool, then paste the converted text below:
                    </p>
                    <a 
                      href="https://tools.pdf24.org/en/pdf-to-txt" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      PDF24 PDF to Text Converter
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="pasted-text">Paste Your Study Material</Label>
                  <Textarea
                    id="pasted-text"
                    placeholder="Paste your converted text here (from PDF converter, notes, articles, etc.)..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    disabled={isProcessing}
                    className="mt-2 min-h-[300px] text-base leading-relaxed"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isProcessing || !pastedText.trim()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate Study Materials"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="youtube" className="space-y-4 mt-6">
              <form onSubmit={handleYoutubeSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="youtube-url">YouTube Video URL</Label>
                  <Input
                    id="youtube-url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    disabled={isProcessing}
                    className="mt-2"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isProcessing || !youtubeUrl}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate Study Materials"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
};
