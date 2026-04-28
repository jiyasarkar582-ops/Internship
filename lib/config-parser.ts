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

export function getAppConfig(): AppConfig {
  try {
    const configPath = path.join(process.cwd(), 'app_config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error("app_config.json not found");
    }
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(fileContents);
    
    // Add defaults and normalize
    return {
      appName: config.appName || 'My C2A App',
      theme: {
        primaryColor: config.theme?.primaryColor || '#000000',
        mode: config.theme?.mode || 'light'
      },
      auth: {
        enabled: config.auth?.enabled ?? false,
        providers: config.auth?.providers || []
      },
      language: config.language || 'en',
      translations: config.translations || {},
      entities: config.entities || []
    };
  } catch (error) {
    console.error("Failed to parse config", error);
    return {
      appName: 'Error Loading Config',
      theme: { primaryColor: '#ff0000', mode: 'light' },
      auth: { enabled: false, providers: [] },
      language: 'en',
      translations: {},
      entities: []
    };
  }
}
