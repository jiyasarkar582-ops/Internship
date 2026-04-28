"use client";

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { FieldConfig } from '@/lib/config-parser';
import { useTranslation } from '@/lib/i18n-context';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<void>;
  fields: FieldConfig[];
}

export default function CsvImportModal({ isOpen, onClose, onImport, fields }: CsvImportModalProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({}); // targetField -> csvHeader
  const [step, setStep] = useState<1 | 2>(1);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.meta.fields) {
            setCsvHeaders(results.meta.fields);
            setCsvData(results.data);
            
            // Auto-map if header names match exactly or case-insensitive
            const autoMapping: Record<string, string> = {};
            fields.forEach(f => {
               const match = results.meta.fields?.find(h => h.toLowerCase() === f.name.toLowerCase());
               if (match) autoMapping[f.name] = match;
            });
            setMapping(autoMapping);
            setStep(2);
          } else {
            setError('Could not parse CSV headers.');
          }
        },
        error: (err: any) => {
          setError(err.message);
        }
      });
    }
  };

  const handleMappingChange = (targetField: string, csvHeader: string) => {
    setMapping(prev => ({
      ...prev,
      [targetField]: csvHeader
    }));
  };

  const executeImport = async () => {
    setIsImporting(true);
    setError(null);
    try {
      const recordsToImport = csvData.map(row => {
        const record: any = {};
        fields.forEach(field => {
          const mappedHeader = mapping[field.name];
          if (mappedHeader && row[mappedHeader] !== undefined) {
             let val = row[mappedHeader];
             // Simple type casting based on field.type
             if (field.type === 'number') val = Number(val);
             if (field.type === 'boolean') val = val === 'true' || val === '1' || val.toLowerCase() === 'yes';
             record[field.name] = val;
          }
        });
        return record;
      });

      await onImport(recordsToImport);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Import failed.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setCsvHeaders([]);
    setCsvData([]);
    setMapping({});
    setStep(1);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">{t('importCsv', 'Import CSV')}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ✕
          </button>
        </div>

        {error && <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">{error}</div>}

        {step === 1 && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Select CSV File
            </button>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">or drag and drop</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {csvData.length} records. Map the CSV columns to the entity fields.
            </p>
            
            <div className="space-y-3">
              {fields.map(field => (
                <div key={field.name} className="flex items-center justify-between gap-4">
                  <div className="w-1/3 text-sm font-medium dark:text-gray-300">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </div>
                  <div className="w-2/3">
                    <select
                      value={mapping[field.name] || ''}
                      onChange={(e) => handleMappingChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm"
                    >
                      <option value="">-- Ignore --</option>
                      {csvHeaders.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Back
              </button>
              <button
                onClick={executeImport}
                disabled={isImporting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isImporting ? 'Importing...' : 'Confirm Import'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
