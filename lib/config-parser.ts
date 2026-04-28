import fs from 'fs';
import path from 'path';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'string' | 'text' | 'number' | 'boolean' | 'date' | 'select' | 'email';
  required?: boolean;
  options?: string[];
  default?: any;
}

export interface EntityConfig {
  name: string;
  slug: string;
  icon?: string;
  fields: FieldConfig[];
}

export interface AppConfig {
  appName: string;
  theme: {
    primaryColor: string;
    mode: 'light' | 'dark';
  };
  auth: {
    enabled: boolean;
    providers: string[];
  };
  language?: string;
  translations?: Record<string, Record<string, string>>;
  entities: EntityConfig[];
}

const DEFAULT_CONFIG: AppConfig = {
  appName: 'C2A Engine',
  theme: { primaryColor: '#3b82f6', mode: 'light' },
  auth: { enabled: false, providers: [] },
  language: 'en',
  translations: {},
  entities: [],
};

export function getAppConfig(): AppConfig {
  try {
    // On Vercel (read-only FS), app_config.json is bundled at build time
    const configPath = path.join(process.cwd(), 'app_config.json');
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(fileContents);

    return {
      appName: config.appName || DEFAULT_CONFIG.appName,
      theme: {
        primaryColor: config.theme?.primaryColor || DEFAULT_CONFIG.theme.primaryColor,
        mode: config.theme?.mode || DEFAULT_CONFIG.theme.mode,
      },
      auth: {
        enabled: config.auth?.enabled ?? false,
        providers: config.auth?.providers || [],
      },
      language: config.language || 'en',
      translations: config.translations || {},
      entities: config.entities || [],
    };
  } catch {
    // Return safe defaults if config can't be read (e.g. during Vercel build)
    return DEFAULT_CONFIG;
  }
}
