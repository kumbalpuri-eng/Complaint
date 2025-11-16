import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Complaint, BotMessage, UserMessage, Message } from "../types";
import { SYSTEM_PROMPT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const PRO_MODEL = 'gemini-2.5-pro';
const FLASH_MODEL = 'gemini-2.5-flash';

function parseResponse(responseText: string): Omit<BotMessage, 'id' | 'sender'> {
    const summaryRegex = /### SUMMARY\s*([\s\S]*?)(?=\s*### COMPLAINT DATA|\s*### TOOL INTENT|$)/;
    const complaintJsonRegex = /### COMPLAINT DATA\s*```json\s*([\s\S]*?)\s*```/;
    const toolIntentJsonRegex = /### TOOL INTENT\s*```json\s*([\s\S]*?)\s*```/;

    const summaryMatch = responseText.match(summaryRegex);
    const complaintJsonMatch = responseText.match(complaintJsonRegex);
    const toolIntentJsonMatch = responseText.match(toolIntentJsonRegex);

    let summary = summaryMatch ? summaryMatch[1].trim() : "";
    
    let complaintData = null;
    try {
      if (complaintJsonMatch) {
        complaintData = JSON.parse(complaintJsonMatch[1].trim());
      }
    } catch (e) { 
      console.error("Failed to parse complaint JSON", e); 
      complaintData = { error: "Failed to parse complaint JSON." };
    }

    // Fallback for completely unstructured responses where neither section is found.
    if (!summaryMatch && !complaintJsonMatch) {
        summary = responseText;
    }

    let toolIntentData = null;
    try {
      if (toolIntentJsonMatch) {
        toolIntentData = JSON.parse(toolIntentJsonMatch[1].trim());
      }
    } catch (e) { 
        console.error("Failed to parse tool intent JSON", e);
    }
    
    return { summary, complaintData, toolIntentData };
};

function complaintToChatHistory(history: Message[]) {
    return history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.sender === 'user' ? msg.text : msg.summary }] // Simplified for history
    }));
}


export async function startNewComplaintChat(): Promise<{ response: BotMessage }> {
    try {
        const chat = ai.chats.create({
            model: PRO_MODEL,
            config: { systemInstruction: SYSTEM_PROMPT },
        });

        const result = await chat.sendMessage({ message: "Hello" });
        const responseText = result.text;
        if (!responseText) throw new Error("Received an empty response from the AI.");

        const parsed = parseResponse(responseText);
        const botMessage: BotMessage = {
            id: Date.now(),
            sender: 'bot',
            ...parsed,
        };
        return { response: botMessage };
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to start new complaint chat.");
    }
}


export async function continueComplaintChat(
  complaint: Complaint,
  newMessage: string
): Promise<Complaint> {
  try {
    const { history, ...complaintContext } = complaint;
    
    // Create a new chat session with the full history
    const chat = ai.chats.create({
      model: PRO_MODEL,
      config: { systemInstruction: SYSTEM_PROMPT },
      history: complaintToChatHistory(history)
    });

    // Construct the prompt with the current complaint context
    const prompt = `
THIS IS THE CURRENT COMPLAINT DATA. UPDATE IT BASED ON MY MESSAGE.
\`\`\`json
${JSON.stringify(complaintContext, null, 2)}
\`\`\`

MY MESSAGE: "${newMessage}"
`;

    const result: GenerateContentResponse = await chat.sendMessage({ message: prompt });
    const responseText = result.text;
    
    if (!responseText) {
      throw new Error("Received an empty response from the AI.");
    }

    const parsedResponse = parseResponse(responseText);

    const userMessage: UserMessage = { id: Date.now(), sender: 'user', text: newMessage };
    const botMessage: BotMessage = { id: Date.now() + 1, sender: 'bot', ...parsedResponse };

    // Update the complaint object with the new data from the AI
    // and append the new messages to its history.
    const updatedComplaint: Complaint = {
        ...(parsedResponse.complaintData as Omit<Complaint, 'history'> || complaintContext),
        history: [...history, userMessage, botMessage]
    };
    
    return updatedComplaint;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the Complaint Orchestrator. Please check your connection and API key.");
  }
}