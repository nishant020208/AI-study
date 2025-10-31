import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Brain, HelpCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlashcardPractice } from "./FlashcardPractice";
import { QuizMode } from "./QuizMode";

interface ResultsDisplayProps {
  result: {
    type: string;
    filename?: string;
    url?: string;
    notes: string;
    flashcards: Array<{ question: string; answer: string }>;
    quizQuestions?: Array<{ question: string; options: string[]; correctAnswer: number }>;
  };
}

export const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleDownloadPDF = () => {
    const blob = new Blob([result.notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.filename || 'notes'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {showFlashcards && (
        <FlashcardPractice
          flashcards={result.flashcards}
          onClose={() => setShowFlashcards(false)}
        />
      )}

      {showQuiz && result.quizQuestions && (
        <QuizMode
          questions={result.quizQuestions}
          onClose={() => setShowQuiz(false)}
        />
      )}
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Card className="glass-card max-w-5xl mx-auto p-8 shadow-card">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Your Study Materials</h3>
            <p className="text-muted-foreground">
              {result.type === 'pdf' ? `From: ${result.filename}` : `From: ${result.url}`}
            </p>
          </div>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notes">
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="flashcards">
                <Brain className="w-4 h-4 mr-2" />
                Flashcards
              </TabsTrigger>
              <TabsTrigger value="quiz">
                <HelpCircle className="w-4 h-4 mr-2" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="mt-6 space-y-4">
              <Card className="p-6 bg-secondary/50">
                <h4 className="text-lg font-semibold mb-4">Generated Notes</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground/90 whitespace-pre-wrap">{result.notes}</p>
                </div>
              </Card>
              <Button className="w-full" variant="outline" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download Notes
              </Button>
            </TabsContent>

            <TabsContent value="flashcards" className="mt-6 space-y-4">
              <div className="grid gap-4">
                {result.flashcards.map((card, index) => (
                  <Card key={index} className="p-6 hover:shadow-elegant transition-all">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-primary">Question</span>
                        <p className="mt-1 font-semibold">{card.question}</p>
                      </div>
                      <div className="border-t pt-4">
                        <span className="text-sm font-medium text-accent">Answer</span>
                        <p className="mt-1 text-muted-foreground">{card.answer}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <Button className="w-full" onClick={() => setShowFlashcards(true)}>
                <Brain className="w-4 h-4 mr-2" />
                Practice with Flashcards
              </Button>
            </TabsContent>

            <TabsContent value="quiz" className="mt-6">
              <Card className="p-6 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h4 className="text-xl font-semibold mb-2">Ready to Test Your Knowledge?</h4>
                <p className="text-muted-foreground mb-6">
                  {result.quizQuestions?.length || 0} questions generated from your content
                </p>
                <Button onClick={() => setShowQuiz(true)} disabled={!result.quizQuestions?.length}>
                  Start Quiz
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
    </>
  );
};
