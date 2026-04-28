"use client";

import React from 'react';
import { FieldConfig } from '@/lib/config-parser';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

interface TableRendererProps {
  fields: FieldConfig[];
  data: any[];
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
}

export default function TableRenderer({ fields, data, onEdit, onDelete }: TableRendererProps) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <div className="p-8 text-center border border-gray-200 rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">No records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            {fields.map(field => (
              <th 
                key={field.name}
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
              >
                {field.label}
              </th>
            ))}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
          {data.map((record, idx) => (
            <tr key={record.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              {fields.map(field => {
                 let displayValue = record[field.name];
                 if (field.type === 'boolean') {
                     displayValue = displayValue ? 'Yes' : 'No';
                 } else if (field.type === 'date' && displayValue) {
                     displayValue = new Date(displayValue).toLocaleDateString();
                 }
                 
                 // Handle missing fields
                 if (displayValue === undefined || displayValue === null) {
                     displayValue = '-';
                 }

                 return (
                  <td key={field.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {String(displayValue)}
                  </td>
                 );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onEdit(record)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                  title={t('edit', 'Edit')}
                >
                  <Edit className="w-4 h-4 inline-block" />
                </button>
                <button 
                  onClick={() => onDelete(record.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  title={t('delete', 'Delete')}
                >
                  <Trash2 className="w-4 h-4 inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
