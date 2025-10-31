import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { UploadSection } from "@/components/UploadSection";
import { ResultsDisplay } from "@/components/ResultsDisplay";

const Index = () => {
  const [processedResult, setProcessedResult] = useState<any>(null);

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProcessComplete = (result: any) => {
    setProcessedResult(result);
  };

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={scrollToUpload} />
      <Features />
      <UploadSection onProcessComplete={handleProcessComplete} />
      {processedResult && <ResultsDisplay result={processedResult} />}
    </div>
  );
};

export default Index;
