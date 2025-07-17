import { GoogleGenAI, Type } from "@google/genai";
import { CONSULTATION_DATA } from '../constants';
import type { ChatMessage, MedicalReport, ConsultationMode } from "../types";

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });

const medicationSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Generic or brand name with strength and form (e.g., Tab. Paracetamol 650mg)." },
        dosage: { type: Type.STRING, description: "The amount of a single dose (e.g., 'One tablet', '5ml')." },
        frequency: { type: Type.STRING, description: "How often to take the medication, using medical abbreviations (e.g., 'TDS', 'BD', 'OD')." },
        route: { type: Type.STRING, description: "Administration route (e.g., 'Oral', 'IV')." },
        duration: { type: Type.STRING, description: "How long to take the medication for (e.g., '5 days')." },
    },
    required: ["name", "dosage", "frequency", "route", "duration"],
};

const patientDetailsSchema = {
    type: Type.OBJECT,
    description: "Patient demographic information.",
    properties: {
        name: { type: Type.STRING, description: "The patient's or pet's full name." },
        age: { type: Type.STRING, description: "The patient's or pet's age." },
        sex: { type: Type.STRING, description: "The sex (e.g., Male, Female)." },
        id: { type: Type.STRING, description: "A unique patient identifier." },
        species: { type: Type.STRING, description: "For veterinary use: the species of the animal (e.g., Dog, Cat)." },
        breed: { type: Type.STRING, description: "For veterinary use: the breed of the animal." },
    },
    required: ["name", "age", "sex", "id"],
};

const medicalReportSchema = {
  type: Type.OBJECT,
  properties: {
    patient_details: patientDetailsSchema,
    report_metadata: {
        type: Type.OBJECT,
        description: "Metadata about the report generation.",
        properties: {
            sample_from: { type: Type.STRING },
            ref_by: { type: Type.STRING },
            registered_on: { type: Type.STRING, description: "Date of registration (YYYY-MM-DD)." },
            collected_on: { type: Type.STRING, description: "Date of sample collection (YYYY-MM-DD)." },
            reported_on: { type: Type.STRING, description: "Date of reporting (YYYY-MM-DD)." },
        },
        required: ["sample_from", "ref_by", "registered_on", "collected_on", "reported_on"],
    },
    results: {
        type: Type.OBJECT,
        description: "The findings of the AI-assisted investigation.",
        properties: {
            investigation: { type: Type.STRING, description: "The name of the panel or investigation."},
            initial_symptoms: { type: Type.STRING, description: "A summary of the patient's initial symptoms." },
            preliminary_diagnosis: { type: Type.STRING, description: "The AI's preliminary diagnosis." },
            consultation_urgency: { type: Type.STRING, description: "Urgency level: 'Routine', 'Urgent', or 'Immediate'." },
            medications: { type: Type.ARRAY, description: "List of prescribed medications.", items: medicationSchema },
            suggested_investigations: { type: Type.STRING, description: "Recommended lab tests or investigations. 'None' if not applicable." },
            advice: { type: Type.STRING, description: "General health advice for the patient." },
        },
        required: ["investigation", "initial_symptoms", "preliminary_diagnosis", "consultation_urgency", "medications", "suggested_investigations", "advice"],
    },
    disclaimer: { type: Type.STRING, description: "The mandatory legal and safety disclaimer." },
  },
  required: ["patient_details", "report_metadata", "results", "disclaimer"],
};


export const getAiResponseAndReport = async (
    history: ChatMessage[], 
    newMessage: string,
    mode: ConsultationMode
): Promise<{ responseText: string; reportData: MedicalReport | null }> => {
  try {

    const model = 'gemini-2.5-flash';
    const systemInstruction = CONSULTATION_DATA[mode].GEMINI_SYSTEM_INSTRUCTION;
    const contents = [...history, { role: 'user', parts: [{ text: newMessage }] }];

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                responseText: {type: Type.STRING, description: "The conversational response to the user."},
                report: medicalReportSchema
            },
            required: ["responseText", "report"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received an empty response from the AI.");
    }
    
    const parsedJson = JSON.parse(responseText);

    return {
      responseText: parsedJson.responseText || "I'm not sure how to respond to that. Could you rephrase?",
      reportData: parsedJson.report || null,
    };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return {
      responseText: "I'm sorry, I encountered an error while processing your request. Please try again.",
      reportData: null,
    };
  }
};
