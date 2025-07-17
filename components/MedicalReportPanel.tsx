import React, { useRef } from 'react';
import type { MedicalReport, ConsultationMode } from '../types';
import { CONSULTATION_DATA } from '../constants';
import DownloadIcon from './icons/DownloadIcon';
import NewChatIcon from './icons/NewChatIcon';

interface MedicalReportPanelProps {
  report: MedicalReport;
  onNewConsultation: () => void;
  consultationMode: ConsultationMode;
}

const ReportRow: React.FC<{ label: string; value?: string; valueClassName?: string }> = ({ label, value, valueClassName = 'text-gray-800' }) => (
    <div className="py-2.5 px-4 grid grid-cols-12 gap-4 border-b border-gray-200 last:border-b-0">
        <div className="col-span-4 font-semibold text-gray-600">{label}</div>
        <div className={`col-span-8 whitespace-pre-wrap ${valueClassName}`}>{value}</div>
    </div>
);

const MedicalReportPanel: React.FC<MedicalReportPanelProps> = ({ report, onNewConsultation, consultationMode }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const LAB_DETAILS = CONSULTATION_DATA[consultationMode].LAB_DETAILS;

  const handleDownloadPdf = () => {
    const element = reportRef.current;
    if (element && (window as any).html2pdf) {
      const opt = {
        margin: 0.25,
        filename: `Lab_Report_${report.patient_details.name.replace(/\s+/g, '_') || 'user'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
      };
      (window as any).html2pdf().from(element).set(opt).save();
    } else {
      console.error("html2pdf is not loaded or report element is not found.");
    }
  };
  
  const { results, patient_details, report_metadata } = report;

  return (
    <div className="flex flex-col h-full bg-gray-900 shadow-2xl rounded-2xl border border-gray-800">
      <header className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-950/60 rounded-t-2xl border-b border-gray-800 shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Live Medical Report</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 text-sm font-semibold rounded-lg hover:bg-green-700 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transform hover:scale-105">
            <DownloadIcon />
            <span>Download</span>
          </button>
          <button
            onClick={onNewConsultation}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transform hover:scale-105">
            <NewChatIcon />
            <span>New</span>
          </button>
        </div>
      </header>
      
      <div className="p-4 flex-grow overflow-y-auto bg-gray-200">
        <div className="bg-white text-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto text-sm" ref={reportRef}>
          <div className="p-5">
            {/* Lab Header */}
            <header className="flex justify-between items-start pb-4 border-b-2 border-blue-700">
                <div>
                    <h1 className="text-2xl font-bold text-blue-800">{LAB_DETAILS.name}</h1>
                    <p className="text-gray-500 font-medium">{LAB_DETAILS.slogan}</p>
                    <p className="text-xs text-gray-500 mt-1">{LAB_DETAILS.address}</p>
                </div>
                <div className="text-right text-xs text-gray-600">
                    <p>{LAB_DETAILS.phone}</p>
                    <p>{LAB_DETAILS.email}</p>
                    <p className="font-bold">{LAB_DETAILS.website}</p>
                </div>
            </header>

            {/* Patient Details */}
            <section className="grid grid-cols-2 gap-x-6 py-3 border-b border-gray-300">
                <div>
                    <p><strong className="font-semibold text-gray-500 w-24 inline-block">{consultationMode === 'vet' ? 'Pet Name' : 'Patient Name'}</strong>: {patient_details.name}</p>
                    {patient_details.species && patient_details.species !== "N/A" && (
                        <p><strong className="font-semibold text-gray-500 w-24 inline-block">Species</strong>: {patient_details.species}</p>
                    )}
                    {patient_details.breed && patient_details.breed !== "N/A" && (
                        <p><strong className="font-semibold text-gray-500 w-24 inline-block">Breed</strong>: {patient_details.breed}</p>
                    )}
                    <p><strong className="font-semibold text-gray-500 w-24 inline-block">Age / Sex</strong>: {patient_details.age} / {patient_details.sex}</p>
                    <p><strong className="font-semibold text-gray-500 w-24 inline-block">Patient ID</strong>: {patient_details.id}</p>
                </div>
                <div className='text-right'>
                    <p><strong className="font-semibold text-gray-500">Sample From</strong>: {report_metadata.sample_from}</p>
                    <p><strong className="font-semibold text-gray-500">Ref. By</strong>: {report_metadata.ref_by}</p>
                </div>
            </section>

             {/* Dates */}
            <section className="flex justify-end items-start py-3 border-b-2 border-gray-400">
                <div className="text-right text-xs text-gray-600">
                    <p><strong className="font-semibold">Registered on:</strong> {report_metadata.registered_on}</p>
                    <p><strong className="font-semibold">Collected on:</strong> {report_metadata.collected_on}</p>
                    <p><strong className="font-semibold">Reported on:</strong> {report_metadata.reported_on}</p>
                </div>
            </section>

            {/* Investigation Title */}
            <section className="text-center py-3">
                <h2 className="font-bold text-lg text-gray-800">{results.investigation}</h2>
            </section>

            {/* Results Section */}
            <section className="border-2 border-gray-300 rounded-md">
                <div className="grid grid-cols-12 gap-4 bg-gray-100 p-2 font-bold border-b-2 border-gray-300">
                    <div className="col-span-4">Investigation</div>
                    <div className="col-span-8">Result</div>
                </div>
                <ReportRow label="Initial Symptoms" value={results.initial_symptoms} />
                <ReportRow label="Preliminary Diagnosis" value={results.preliminary_diagnosis} />
                <ReportRow label="Consultation Urgency" value={results.consultation_urgency} valueClassName={results.consultation_urgency === 'Urgent' || results.consultation_urgency === 'Immediate' ? 'font-bold text-red-600' : 'text-gray-800'} />
                
                {/* Recommendations (Rx) Table */}
                <div className="py-2.5 px-4 border-b border-gray-200">
                    <div className="col-span-4 font-semibold text-gray-600 mb-2">Recommendations (Rx)</div>
                    {results.medications && results.medications.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="p-2 font-semibold text-gray-600">S.No</th>
                                        <th className="p-2 font-semibold text-gray-600">Drug Name</th>
                                        <th className="p-2 font-semibold text-gray-600">Dosage</th>
                                        <th className="p-2 font-semibold text-gray-600">Frequency</th>
                                        <th className="p-2 font-semibold text-gray-600">Route</th>
                                        <th className="p-2 font-semibold text-gray-600">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {results.medications.map((med, index) => (
                                        <tr key={index}>
                                            <td className="p-2 text-gray-700">{index + 1}.</td>
                                            <td className="p-2 text-gray-800">{med.name}</td>
                                            <td className="p-2 text-gray-800">{med.dosage}</td>
                                            <td className="p-2 text-gray-800">{med.frequency}</td>
                                            <td className="p-2 text-gray-800">{med.route}</td>
                                            <td className="p-2 text-gray-800">{med.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-700 px-2 py-1">No medication prescribed.</p>
                    )}
                </div>

                <ReportRow label="Suggested Investigations" value={results.suggested_investigations} />
                <ReportRow label="Advice" value={results.advice} />
            </section>

            {/* Note */}
            <section className="mt-4 p-3 bg-gray-100 rounded-md text-xs text-gray-600">
                <strong className="font-bold">Note:</strong>
                <div className="whitespace-pre-wrap pl-2">{report.disclaimer}</div>
            </section>

            {/* Footer */}
            <footer className="mt-6 pt-4 text-xs text-gray-500">
                <p className="text-center font-semibold">****End of Report****</p>
                <div className="flex justify-between mt-10">
                    <div>
                        <p className="font-bold">AI Medical Technician</p>
                        <p>(System Operator)</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">{consultationMode === 'vet' ? 'Dr. DocAI (Vet)' : 'Dr. DocAI'}</p>
                        <p>(AI Pathologist)</p>
                    </div>
                </div>
                <p className="text-center mt-4">Generated on: {new Date().toLocaleString()} | Page 1 of 1</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReportPanel;