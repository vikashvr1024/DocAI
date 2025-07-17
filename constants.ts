import type { Message, MedicalReport } from './types';

// --- HUMAN CONSTANTS ---

const HUMAN_LAB_DETAILS = {
  name: 'DRLOGY PATHOLOGY LAB',
  slogan: 'Accurate | Caring | Instant',
  address: '105-108, SMART VISION COMPLEX, HEALTHCARE ROAD, FAKEVILLE',
  // phone: '+1 0123456789',
  // email: 'contact@drlogypathlab.fake',
  // website: 'www.drlogy.com',
};

const HUMAN_INITIAL_MESSAGES: Message[] = [
  {
    role: 'model',
    content: "I'm DocAI, your virtual clinical assistant. To begin our consultation, could you please type your full name, age, and sex?",
  },
];

const HUMAN_INITIAL_MEDICAL_REPORT: MedicalReport = {
  patient_details: { name: "Patient Name", age: "N/A", sex: "N/A", id: "Awaiting Consultation" },
  report_metadata: {
    sample_from: "AI Assistant",
    ref_by: "Dr. DocAI",
    registered_on: "N/A", collected_on: "N/A", reported_on: new Date().toISOString().split("T")[0],
  },
  results: {
    investigation: 'GENERAL HEALTH PANEL (AI-ASSISTED)',
    initial_symptoms: "Awaiting consultation...",
    preliminary_diagnosis: "Awaiting consultation...",
    consultation_urgency: "Routine",
    medications: [],
    suggested_investigations: "Awaiting consultation...",
    advice: "Please begin the consultation to receive recommendations.",
  },
  disclaimer: "1. This is an AI-generated demonstration and not a substitute for professional medical advice.\n2. Always consult with a licensed healthcare provider for any health concerns."
};

const HUMAN_GEMINI_SYSTEM_INSTRUCTION = `You are an AI-assisted pathology reporting system for 'DRLOGY PATHOLOGY LAB' for HUMAN patients. Your function is to take a clinical history provided by a user via chat and generate a structured, professional pathology report. Your workflow is to first parse the patient's name, age, and sex, generate a unique patient ID, and then ask for their symptoms. With every subsequent user response, you MUST generate a complete, updated 'MedicalReport' object in the specified JSON format. Your 'responseText' should be your next clinical question or a confirmation message. You must determine the urgency, summarize symptoms, and formulate detailed recommendations for medications, investigations, and advice based on your diagnosis. Prescriptions in the 'medications' array must be specific to the diagnosis, using standard medical forms (Tab., Syp., etc.), strengths, and abbreviations (TDS, BD, etc.).`;

// --- VETERINARY CONSTANTS ---

const VET_LAB_DETAILS = {
  name: 'VETLOGY PATHOLOGY LAB',
  slogan: 'Compassionate Care for Animals',
  address: '456, ANIMAL CARE PLAZA, PETSVILLE',
  // phone: '+1 9876543210',
  // email: 'support@vetlogypathlab.fake',
  // website: 'www.vetlogy.com',
};

const VET_INITIAL_MESSAGES: Message[] = [
  {
    role: 'model',
    content: "I'm DocAI, your virtual veterinary assistant. To begin, please provide your pet's name, species (e.g., Dog, Cat), breed, age, and sex.",
  },
];

const VET_INITIAL_MEDICAL_REPORT: MedicalReport = {
  patient_details: { name: "Pet Name", species: "N/A", breed: "N/A", age: "N/A", sex: "N/A", id: "Awaiting Consultation" },
  report_metadata: {
    sample_from: "AI Veterinary Assistant",
    ref_by: "Dr. DocAI (Vet)",
    registered_on: "N/A", collected_on: "N/A", reported_on: new Date().toISOString().split("T")[0],
  },
  results: {
    investigation: 'GENERAL VETERINARY PANEL (AI-ASSISTED)',
    initial_symptoms: "Awaiting consultation...",
    preliminary_diagnosis: "Awaiting consultation...",
    consultation_urgency: "Routine",
    medications: [],
    suggested_investigations: "Awaiting consultation...",
    advice: "Please begin the consultation to receive recommendations.",
  },
  disclaimer: "1. This is an AI-generated demonstration and not a substitute for professional veterinary advice.\n2. Always consult with a licensed veterinarian for any health concerns."
};

const VET_GEMINI_SYSTEM_INSTRUCTION = `You are an AI-assisted pathology reporting system for 'VETLOGY PATHOLOGY LAB' for VETERINARY patients. Your function is to take a clinical history for an animal and generate a structured, professional pathology report. Your workflow is to first parse the pet's name, species, breed, age, and sex, generate a unique patient ID, and then ask for their symptoms. With every subsequent user response, you MUST generate a complete, updated 'MedicalReport' object in the specified JSON format. Your 'responseText' should be your next clinical question. You must determine the urgency, summarize symptoms, and formulate detailed recommendations for medications, investigations, and advice based on your diagnosis. Prescriptions in the 'medications' array must be specific to the diagnosis and appropriate for the animal's species, using standard veterinary forms (Tab., Syp., etc.), strengths, and abbreviations (TDS, BD, etc.).`;

// --- EXPORTED GROUP ---

export const CONSULTATION_DATA = {
  human: {
    LAB_DETAILS: HUMAN_LAB_DETAILS,
    INITIAL_MESSAGES: HUMAN_INITIAL_MESSAGES,
    INITIAL_MEDICAL_REPORT: HUMAN_INITIAL_MEDICAL_REPORT,
    GEMINI_SYSTEM_INSTRUCTION: HUMAN_GEMINI_SYSTEM_INSTRUCTION
  },
  vet: {
    LAB_DETAILS: VET_LAB_DETAILS,
    INITIAL_MESSAGES: VET_INITIAL_MESSAGES,
    INITIAL_MEDICAL_REPORT: VET_INITIAL_MEDICAL_REPORT,
    GEMINI_SYSTEM_INSTRUCTION: VET_GEMINI_SYSTEM_INSTRUCTION
  }
};
