import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
  return Response.json({ success: true, data: "Thank you" }, { status: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
        `,
    });

    let parsedQuestions: string[] = [];

    try {
      // 1️⃣ Try direct JSON parse
      const direct = JSON.parse(text);
      if (Array.isArray(direct)) {
        parsedQuestions = direct;
      }
    } catch {
      // 2️⃣ Fallback: extract questions line by line
      parsedQuestions = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("[") && line.endsWith("]"))
        .flatMap((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return [];
          }
        });
    }

    if (parsedQuestions.length === 0) {
      console.error("❌ Still failed to parse questions:", text);
      throw new Error("Invalid question format from LLM");
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };
    await db.collection("interviews").add(interview);

    return Response.json(
      { success: true, questions: parsedQuestions },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json({ success: false, error }, { status: 500 });
  }
}
