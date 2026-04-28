"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogOut, Database, Server, Home, Globe, Wrench } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { AppConfig } from '@/lib/config-parser';
import { useTranslation } from '@/lib/i18n-context';

export default function AppShell({ children, config }: { children: React.ReactNode, config: AppConfig }) {
  const pathname = usePathname();
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <Server className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-lg font-bold tracking-tight">{config.appName}</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link 
            href="/"
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/" 
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200" 
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
          >
            <Home className="w-4 h-4 mr-3" />
            {t('dashboard', 'Dashboard')}
          </Link>
          
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-3">
            {t('entities', 'Entities')}
          </div>
          {config.entities.map(entity => {
            const isActive = pathname.startsWith(`/${entity.slug}`);
            return (
              <Link 
                key={entity.slug}
                href={`/${entity.slug}`}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200" 
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                <Database className="w-4 h-4 mr-3" />
                {entity.name}
              </Link>
            )
          })}

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-3">
            Tools
          </div>
          <Link
            href="/builder"
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/builder"
                ? "bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
          >
            <Wrench className="w-4 h-4 mr-3" />
            App Builder
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
          {availableLanguages.length > 1 && (
            <div className="flex items-center px-3 py-2">
              <Globe className="w-4 h-4 mr-3 text-gray-500" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}
          
          <button 
            onClick={() => signOut()}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            {t('signOut', 'Sign Out')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
