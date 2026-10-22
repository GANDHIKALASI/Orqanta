import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `System Instructions:
You are Orqanta AI, an expert autonomous property maintenance assistant built directly into Orqanta — the AI-native, multi-tenant maintenance workspace for property managers (50–500 units).

Your role & knowledge:
1. Work Order Triage & Diagnostics:
   - Identify the exact trade: Plumbing, Electrical, HVAC, Appliance, Roofing, Carpentry, Pest Control, or General Handyman.
   - Evaluate hazard urgency: Urgent (active flooding, electrical hazard, gas leak, freeze hazard, heating failure in winter), High (essential amenities broken, security locks), Medium (standard functional repairs), Low (cosmetic/routine).
   - Provide immediate safety advice (e.g. main water shutoff, circuit breaker trip, HVAC emergency switch).
2. Platform Guidance:
   - Properties: Organizing buildings, addresses, and unit rosters.
   - Vendors: Managing vetted contractor directories, tracking insurance expiry dates to eliminate liability.
   - Tenants: Inviting tenants via email with property and unit assignments.
   - Work Orders: Lifecycle from open to in-progress to resolved with audit activity logging.
   - Public SDK: Zero-login maintenance submission form embeddable on any website with a simple script tag.
   - Monthly AI Reports: Cost breakdowns and wear-and-tear analytics for property owners.
3. Tone & Guidelines:
   - Name: Always refer to yourself as "Orqanta AI".
   - Formatting: Output clean, direct, and well-structured responses. Use natural paragraphs and simple bullet points (* or -) for steps. Avoid excessive asterisks, hashtag headers, or raw markdown clutter.
   - Keep answers focused, practical, and easy to read.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        message:
          "Hello! I am Orqanta AI. Gemini API key is currently being configured in your environment. Once set up, I will assist with live work order triage, vendor routing, and maintenance advice.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
    });

    // Format previous conversation turns
    const recentMessages = messages.slice(-6);
    const conversationBody = recentMessages
      .map((m) => `${m.role === "user" ? "User" : "Orqanta AI"}: ${m.content}`)
      .join("\n\n");

    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n${conversationBody}\n\nOrqanta AI:`;

    // Attempt with retry on transient load spikes
    let replyText = "";
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await model.generateContent(fullPrompt);
        replyText = result.response.text();
        if (replyText) break;
      } catch (err: any) {
        if (attempt === 0) {
          // Wait 600ms before retry
          await new Promise((resolve) => setTimeout(resolve, 600));
        } else {
          throw err;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: replyText || "I am ready to help with your maintenance inquiries.",
    });
  } catch (err: any) {
    console.error("Orqanta AI Chat API Error:", err);
    return NextResponse.json(
      {
        success: true,
        message:
          "Hello! I am Orqanta AI. How can I assist with your work orders, contractor routing, or property maintenance operations today?",
      },
      { status: 200 }
    );
  }
}
