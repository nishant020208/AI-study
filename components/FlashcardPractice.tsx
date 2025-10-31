import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface FlashcardPracticeProps {
  flashcards: Array<{ question: string; answer: string }>;
  onClose: () => void;
}

export const FlashcardPractice = ({ flashcards, onClose }: FlashcardPracticeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Flashcard Practice</h3>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="mb-4 text-center text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </div>

        <div
          className="min-h-[300px] cursor-pointer mb-6 perspective"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <Card className={`p-8 transition-all duration-500 transform ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="flex flex-col items-center justify-center min-h-[250px]">
              {!isFlipped ? (
                <>
                  <span className="text-sm font-medium text-primary mb-4">Question</span>
                  <p className="text-xl text-center">{flashcards[currentIndex].question}</p>
                  <p className="text-sm text-muted-foreground mt-4">Click to reveal answer</p>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-accent mb-4">Answer</span>
                  <p className="text-xl text-center">{flashcards[currentIndex].answer}</p>
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button onClick={handleReset} variant="ghost">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};