import React, { useState, useCallback } from 'react';
import ChatPanel from './components/ChatPanel';
import MedicalReportPanel from './components/MedicalReportPanel';
import { getAiResponseAndReport } from './services/geminiService';
import type { Message, MedicalReport, ChatMessage, ConsultationMode } from './types';
import { CONSULTATION_DATA } from './constants';

const App: React.FC = () => {
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('human');
  const [messages, setMessages] = useState<Message[]>(CONSULTATION_DATA.human.INITIAL_MESSAGES);
  const [medicalReport, setMedicalReport] = useState<MedicalReport>(CONSULTATION_DATA.human.INITIAL_MEDICAL_REPORT);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleModeChange = useCallback((newMode: ConsultationMode) => {
    if (newMode === consultationMode) return;
    setConsultationMode(newMode);
    setMessages(CONSULTATION_DATA[newMode].INITIAL_MESSAGES);
    setMedicalReport(CONSULTATION_DATA[newMode].INITIAL_MEDICAL_REPORT);
    setIsLoading(false); // Cancel any pending loading state
  }, [consultationMode]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: 'user', content: userInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const chatHistory: ChatMessage[] = messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
      }));

      const { responseText, reportData } = await getAiResponseAndReport(chatHistory, userInput, consultationMode);
      
      const aiMessage: Message = { role: 'model', content: responseText };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

      if (reportData) {
        // Ensure the report reflects the current mode's lab details, in case AI forgets
        const currentLabDetails = CONSULTATION_DATA[consultationMode].LAB_DETAILS;
        // This is a safeguard; the AI should already provide this.
        if (!reportData.report_metadata.sample_from.includes('Vet')) {
             reportData.report_metadata.sample_from = currentLabDetails.name.includes('VET') ? "AI Veterinary Assistant" : "AI Assistant";
             reportData.report_metadata.ref_by = currentLabDetails.name.includes('VET') ? "Dr. Gemini (Vet)" : "Dr. Gemini";
        }
        setMedicalReport(reportData);
      }
    } catch (error) {
      console.error("Error communicating with AI:", error);
      const errorMessage: Message = { role: 'model', content: "I'm sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, consultationMode]);

  const handleNewConsultation = useCallback(() => {
    setMessages(CONSULTATION_DATA[consultationMode].INITIAL_MESSAGES);
    setMedicalReport(CONSULTATION_DATA[consultationMode].INITIAL_MEDICAL_REPORT);
  }, [consultationMode]);
  
  return (
    <div className="flex flex-col md:flex-row h-screen font-sans bg-gray-950 text-gray-200 antialiased p-2 md:p-4 gap-4">
      <div className="w-full md:w-3/5 lg:w-3/5 h-full flex flex-col">
        <ChatPanel 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          consultationMode={consultationMode}
          onModeChange={handleModeChange}
        />
      </div>
      <div className="w-full md:w-2/5 lg:w-2/5 h-full flex flex-col">
        <MedicalReportPanel 
          report={medicalReport} 
          onNewConsultation={handleNewConsultation} 
          consultationMode={consultationMode}
        />
      </div>
    </div>
  );
};

export default App;
