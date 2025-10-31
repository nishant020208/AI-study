import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DemoVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DemoVideoDialog = ({ open, onOpenChange }: DemoVideoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>How StudyMate AI Works</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="StudyMate AI Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          See how easy it is to transform your study materials into AI-powered notes, flashcards, and quizzes.
        </p>
      </DialogContent>
    </Dialog>
  );
};
