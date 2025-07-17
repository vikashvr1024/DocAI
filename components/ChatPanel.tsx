import React, { useState, useRef, useEffect } from 'react';
import type { Message, ConsultationMode } from '../types';
import SendIcon from './icons/SendIcon';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  consultationMode: ConsultationMode;
  onModeChange: (mode: ConsultationMode) => void;
}

const ThinkingBubble: React.FC = () => (
    <div className="flex items-end gap-3 animate-fade-in-up">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-gray-600">
            <BotIcon />
        </div>
        <div className="max-w-sm px-4 py-3 rounded-2xl bg-gray-700 text-slate-200 rounded-bl-none shadow-lg animate-pulse-bubble">
            <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
);

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading, consultationMode, onModeChange }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const isInitialQuestion = messages.length === 1 && messages[0].role === 'model';
  let placeholderText = "Describe symptoms or answer the question...";
  if (isInitialQuestion) {
      if (consultationMode === 'human') {
          placeholderText = "e.g., Jane Doe, 42, Female";
      } else {
          placeholderText = "e.g., Buddy, Dog, Golden Retriever, 5, Male";
      }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 shadow-2xl rounded-2xl border border-gray-800">
      <header className="bg-gray-950/60 backdrop-blur-sm text-white p-3 flex items-center justify-between gap-4 rounded-t-2xl border-b border-gray-800 shadow-md">
        <div className='flex items-center gap-4'>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg">
                <BotIcon />
            </div>
            <h1 className="text-xl font-bold tracking-wide">DocAI</h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-gray-800 rounded-full p-1 shadow-inner">
            <button 
                onClick={() => onModeChange('human')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${consultationMode === 'human' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:bg-gray-700'}`}
            >
                Human
            </button>
            <button 
                onClick={() => onModeChange('vet')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${consultationMode === 'vet' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:bg-gray-700'}`}
            >
                Veterinary
            </button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-gray-600">
                  <BotIcon />
                </div>
              )}
              <div
                className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
               {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-gray-500">
                  <UserIcon />
                </div>
              )}
            </div>
          ))}
          {isLoading && <ThinkingBubble />}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="p-3 bg-gray-900 border-t border-gray-800 rounded-b-2xl mt-auto">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderText}
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-white placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-110 active:scale-100"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPanel;
