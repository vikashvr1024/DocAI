# DocAI – AI Medical & Veterinary Assistant

DocAI is an AI-powered diagnostic assistant that provides potential diagnoses and generates comprehensive, auto-updating medical or veterinary reports based on a chat conversation. It leverages Google Gemini (GenAI) for natural language understanding and report generation.

---

## Features

- **Conversational AI:** Chat with an AI assistant for human or veterinary consultations.
- **Auto-updating Medical Reports:** The AI generates and updates a structured medical or veterinary report as the conversation progresses.
- **Mode Switching:** Easily toggle between Human and Veterinary consultation modes.
- **Modern UI:** Responsive, user-friendly interface built with React and Tailwind CSS.
- **Exportable Reports:** (If implemented) Download or print the generated reports.

---

## Link

-https://docaiclinic.web.app/

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Google Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd docai
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a file named `.env.local` in the project root.
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_google_gemini_api_key_here
     ```

4. **Run the app locally:**
   ```sh
   npm run dev
   ```
   - The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## Usage

1. **Choose Consultation Mode:**  
   Select either "Human" or "Veterinary" at the top of the chat panel.

2. **Start a Conversation:**  
   - For Human: Enter the patient's name, age, and sex.
   - For Veterinary: Enter the pet's name, species, breed, age, and sex.

3. **Describe Symptoms:**  
   Respond to the AI's questions and provide details about symptoms or concerns.

4. **View the Report:**  
   The right panel displays the auto-updating medical or veterinary report.

5. **Start a New Consultation:**  
   Use the "New Consultation" button to reset the chat and report.

---

## Project Structure

- `src/`
  - `App.tsx` – Main application logic and state management.
  - `components/` – UI components (ChatPanel, MedicalReportPanel, etc.).
  - `services/geminiService.ts` – Handles communication with Google Gemini API.
  - `constants.ts` – Contains system instructions (prompts) and initial data for each mode.
  - `types.ts` – TypeScript type definitions.
- `public/` – Static assets and `index.html`.
- `README.md` – This file.

---

## Configuration

- **Gemini API Key:**  
  The app requires a valid Gemini API key, set in `.env.local` as `GEMINI_API_KEY`.

- **Prompts/System Instructions:**  
  The AI's behavior is guided by system instructions defined in `constants.ts` under `HUMAN_GEMINI_SYSTEM_INSTRUCTION` and `VET_GEMINI_SYSTEM_INSTRUCTION`.

---

## Customization

- **Modify Prompts:**  
  Edit the system instructions in `constants.ts` to change how the AI interacts or generates reports.

- **UI Customization:**  
  Update styles in `index.html` or component files for branding or layout changes.

---

## Deployment

To build for production:

```sh
npm run build
```

The output will be in the `dist/` directory. Deploy this folder to your preferred static hosting provider (e.g., Vercel, Netlify, GitHub Pages).

---

## Troubleshooting

- **API Key Issues:**  
  Ensure your `.env.local` file exists and contains a valid `GEMINI_API_KEY`.

- **CORS/Network Errors:**  
  Make sure your API key is active and has the necessary permissions.

- **Other Issues:**  
  Check the browser console and terminal output for error messages.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [Google GenAI (Gemini)](https://aistudio.google.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
