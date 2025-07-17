export type ConsultationMode = 'human' | 'vet';

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface PatientDetails {
    name: string;
    age: string;
    sex: string;
    id: string;
    species?: string;
    breed?: string;
}

export interface ReportMetadata {
    sample_from: string;
    ref_by: string;
    registered_on: string;
    collected_on: string;
    reported_on: string;
}

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    duration: string;
}

export interface ReportResults {
    investigation: string;
    initial_symptoms: string;
    preliminary_diagnosis: string;
    consultation_urgency: 'Routine' | 'Urgent' | 'Immediate';
    medications: Medication[];
    suggested_investigations: string;
    advice: string;
}

export interface MedicalReport {
  patient_details: PatientDetails;
  report_metadata: ReportMetadata;
  results: ReportResults;
  disclaimer: string;
}
