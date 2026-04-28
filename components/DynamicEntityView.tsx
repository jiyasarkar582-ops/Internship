"use client";

import React, { useState, useEffect } from 'react';
import { EntityConfig } from '@/lib/config-parser';
import { Plus, Upload, RefreshCw, X, Save } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';
import FormRenderer from './FormRenderer';
import TableRenderer from './TableRenderer';
import CsvImportModal from './CsvImportModal';

export default function DynamicEntityView({ entity }: { entity: EntityConfig }) {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dynamic/${entity.slug}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [entity.slug]);

  const handleOpenForm = (record?: any) => {
    setEditingRecord(record || null);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete', 'Are you sure you want to delete this record?'))) return;
    try {
      const res = await fetch(`/api/dynamic/${entity.slug}?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    const isEdit = !!editingRecord;
    const method = isEdit ? 'PUT' : 'POST';
    const payload = isEdit ? { id: editingRecord.id, ...formData } : formData;

    const res = await fetch(`/api/dynamic/${entity.slug}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to save');
    }

    setIsFormModalOpen(false);
    fetchData();
  };

  const handleCsvImport = async (records: any[]) => {
    // A real implementation might do this in bulk via a dedicated endpoint,
    // but here we just POST sequentially or concurrently.
    const promises = records.map(record => 
        fetch(`/api/dynamic/${entity.slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        }).then(res => {
           if (!res.ok) throw new Error('Failed to import a row');
        })
    );
    await Promise.all(promises);
    fetchData();
  };

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('create', 'Create')} {entity.name}
        </button>
        
        <button
          onClick={() => setIsCsvModalOpen(true)}
          className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t('importCsv', 'Import CSV')}
        </button>
        
        <button
          onClick={fetchData}
          className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors ml-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('refresh', 'Refresh')}
        </button>
      </div>

      {error && <div className="mb-4 p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-center p-12 text-gray-500">Loading...</div>
      ) : (
        <TableRenderer 
          fields={entity.fields} 
          data={data} 
          onEdit={handleOpenForm} 
          onDelete={handleDelete} 
        />
      )}

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-gray-900/5 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingRecord ? t('edit', 'Edit') : t('create', 'Create')} {entity.name}
              </h3>
              <button 
                onClick={() => setIsFormModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <FormRenderer 
                fields={entity.fields} 
                initialData={editingRecord}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormModalOpen(false)}
                submitLabel={t('save', 'Save')}
                cancelLabel={t('cancel', 'Cancel')}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      <CsvImportModal 
        isOpen={isCsvModalOpen} 
        onClose={() => setIsCsvModalOpen(false)} 
        onImport={handleCsvImport}
        fields={entity.fields}
      />
    </div>
  );
}
