"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n-context';
import { Upload, Loader2 } from 'lucide-react';

interface GithubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GithubExportModal({ isOpen, onClose }: GithubExportModalProps) {
  const { t } = useTranslation();
  const [pat, setPat] = useState('');
  const [repoName, setRepoName] = useState('c2a-exported-app');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setError(null);
    setSuccessUrl(null);

    try {
      const res = await fetch('/api/export/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: pat, repoName })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to export');
      }

      setSuccessUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-gray-900/5 my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('exportGithub', 'Export to GitHub')}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {successUrl ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">Export Successful!</h4>
              <p className="text-gray-600 dark:text-gray-400">Your project has been pushed to GitHub.</p>
              <a 
                href={successUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Repository
              </a>
            </div>
          ) : (
            <form onSubmit={handleExport} className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This will generate a Next.js project based on your configuration and push it to a new GitHub repository.
              </p>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub Personal Access Token
                </label>
                <input
                  type="password"
                  required
                  value={pat}
                  onChange={e => setPat(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500">Needs "repo" scope to create repositories.</p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Repository Name
                </label>
                <input
                  type="text"
                  required
                  value={repoName}
                  onChange={e => setRepoName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isExporting}
                  className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  {isExporting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isExporting ? 'Exporting...' : 'Export Project'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
