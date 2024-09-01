import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Read the incoming data as text
    const prompt = await req.text();
    // Add your system prompt and user input as a single prompt string
    const combinedPrompt = `
      You are a flashcard creator. Your task is to generate concise effective flashcards based on the given topic or content. Follow the guidelines below to create the flashcards:
      1. Create clear and concise questions for the front of the flashcard.
      2. Provide accurate and informative answers for the back of the flashcard.
      3. Ensure that each flashcard covers a single concept or idea.
      4. Use simple language and avoid jargon.
      5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
      6. Avoid overly complex or ambiguous phrasing in both questions and answers.
      7. When appropriate, use mnemonics or memory aids to help reinforce the information.
      8. Tailor the difficulty level of the flashcards to the user's specified preferences.
      9. If given a body of text, extract the most important and relevant information for the flashcards.
      10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
      11. Only generate 10 flashcards.
      Return in the following JSON format:
      {
          "flashcards": [
              { "front": str, "back": str },
              ...
          ]
      }
      User content: ${prompt}
    `;

    // Start streaming the content
    const result = await model.generateContentStream(combinedPrompt);
    // Accumulate chunks of text as they come in
    let completeResponse = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      completeResponse += chunkText;
    }

    // Clean up the response by removing backticks and any unexpected characters
    const sanitizedResponse = completeResponse
      .replace(/```json|```/g, "")
      .trim();

    // Parse the response to extract flashcards JSON
    const flashcards = JSON.parse(sanitizedResponse);

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.error();
  }
}
