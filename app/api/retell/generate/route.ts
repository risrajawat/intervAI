import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `
Generate ${amount} interview questions.

Role: ${role}
Level: ${level}
Tech stack: ${techstack}
Interview type: ${type}

Rules:
- Return ONLY a valid JSON array
- One question per item
- No explanation
- No special characters like / * -
Example:
["Question one", "Question two"]
      `,
    });

    let questions: string[];

    try {
      questions = JSON.parse(text);
    } catch {
      console.error("❌ Invalid JSON from model:", text);
      return NextResponse.json(
        { success: false, message: "Invalid model output" },
        { status: 500 }
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, message: "No questions generated" },
        { status: 500 }
      );
    }

    await db.collection("interviews").add({
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    });

    // ✅ IMPORTANT: return ARRAY, not string
    return NextResponse.json(
      { success: true, questions },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Interview API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
