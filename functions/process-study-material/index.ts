import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileContent, contentType, title } = await req.json();
    
    console.log("Processing study material:", { contentType, title });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let cleanContent = "";

    // Handle different content types
    if (contentType === 'text') {
      // Plain text - just clean and limit
      cleanContent = fileContent
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 15000);
    } else {
      // PDF - extract text from base64
      let base64Content = fileContent;
      if (fileContent.startsWith('data:')) {
        base64Content = fileContent.split(',')[1];
      }

      const pdfBytes = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));
      const decoder = new TextDecoder();
      let rawText = decoder.decode(pdfBytes);
      
      cleanContent = rawText
        .replace(/[^\x20-\x7E\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .split(/\n/)
        .filter(line => line.trim().length > 20)
        .join('\n')
        .trim()
        .slice(0, 15000);
    }

    console.log("Cleaned content length:", cleanContent.length);

    // Generate notes
    console.log("Generating notes...");
    const notesResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: "You are an expert study assistant. Create comprehensive, well-structured notes from the provided content. Use bullet points, headings, and clear organization. Focus on the key concepts and important information."
          },
          {
            role: "user",
            content: `Create detailed study notes from this content:\n\n${cleanContent}`
          }
        ],
      }),
    });

    if (!notesResponse.ok) {
      const errorText = await notesResponse.text();
      console.error("Notes generation error:", notesResponse.status, errorText);
      throw new Error("Failed to generate notes");
    }

    const notesData = await notesResponse.json();
    const notes = notesData.choices[0].message.content;

    // Generate flashcards
    console.log("Generating flashcards...");
    const flashcardsResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: "You are an expert study assistant. Create 8-12 flashcards from the content. Return ONLY a JSON array with objects containing 'question' and 'answer' fields. No other text."
          },
          {
            role: "user",
            content: `Create flashcards from this content:\n\n${cleanContent}`
          }
        ],
      }),
    });

    if (!flashcardsResponse.ok) {
      const errorText = await flashcardsResponse.text();
      console.error("Flashcards generation error:", flashcardsResponse.status, errorText);
      throw new Error("Failed to generate flashcards");
    }

    const flashcardsData = await flashcardsResponse.json();
    let flashcards = [];
    try {
      const flashcardsText = flashcardsData.choices[0].message.content;
      const jsonMatch = flashcardsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Error parsing flashcards:", e);
      flashcards = [
        { question: "Sample Question 1", answer: "Sample Answer 1" },
        { question: "Sample Question 2", answer: "Sample Answer 2" }
      ];
    }

    // Generate quiz questions
    console.log("Generating quiz questions...");
    const quizResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: "You are an expert study assistant. Create 5-8 multiple choice quiz questions. Return ONLY a JSON array with objects containing 'question', 'options' (array of 4 choices), and 'correctAnswer' (index 0-3). No other text."
          },
          {
            role: "user",
            content: `Create quiz questions from this content:\n\n${cleanContent}`
          }
        ],
      }),
    });

    if (!quizResponse.ok) {
      const errorText = await quizResponse.text();
      console.error("Quiz generation error:", quizResponse.status, errorText);
      throw new Error("Failed to generate quiz");
    }

    const quizData = await quizResponse.json();
    let quizQuestions = [];
    try {
      const quizText = quizData.choices[0].message.content;
      const jsonMatch = quizText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        quizQuestions = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Error parsing quiz:", e);
      quizQuestions = [
        {
          question: "Sample quiz question?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0
        }
      ];
    }

    console.log("Successfully generated all content");

    return new Response(
      JSON.stringify({
        notes,
        flashcards,
        quizQuestions,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in process-study-material:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});