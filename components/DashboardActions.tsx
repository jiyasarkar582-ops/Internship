"use client";

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import GithubExportModal from './GithubExportModal';
import { useTranslation } from '@/lib/i18n-context';

export default function DashboardActions() {
  const { t } = useTranslation();
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsExportOpen(true)}
        className="mt-6 flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      >
        <Upload className="w-5 h-5 mr-2" />
        {t('exportGithub', 'Export to GitHub')}
      </button>

      <GithubExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
      />
    </>
  );
}
