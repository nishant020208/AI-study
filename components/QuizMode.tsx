import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizModeProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

export const QuizMode = ({ questions, onClose }: QuizModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Quiz Complete!</h3>
          <div className="text-5xl font-bold text-primary mb-6">
            {score} / {questions.length}
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            You scored {Math.round((score / questions.length) * 100)}%
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRestart}>Try Again</Button>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Quiz</h3>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="mb-4 flex justify-between items-center text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>

        <Card className="p-6 mb-6 bg-secondary/50">
          <h4 className="text-lg font-semibold mb-4">{questions[currentIndex].question}</h4>
          <div className="space-y-3">
            {questions[currentIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? showResult
                      ? index === questions[currentIndex].correctAnswer
                        ? "border-green-500 bg-green-500/10"
                        : "border-red-500 bg-red-500/10"
                      : "border-primary bg-primary/10"
                    : showResult && index === questions[currentIndex].correctAnswer
                    ? "border-green-500 bg-green-500/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && index === questions[currentIndex].correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {showResult && selectedAnswer === index && index !== questions[currentIndex].correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          {!showResult ? (
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};