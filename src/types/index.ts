export interface DocumentSection {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  content?: string;
}

export interface BrandingConfig {
  theme: string;
  logo?: string;
  backgroundImage?: string;
  primaryColor?: string;
  accentColor?: string;
}

export interface VersionConfig {
  source: 'package.json' | 'manual' | 'env';
  value?: string;
  envVar?: string;
}

export interface VitePluginConfig {
  name: string;
  config: any;
}

export interface DocsConfig {
  projectName: string;
  basePath: string;
  port: number;
  branding: BrandingConfig;
  sections: DocumentSection[];
  plugins?: VitePluginConfig[];
  version: VersionConfig;
  customContent?: {
    [sectionId: string]: (content: string) => string;
  };
}

export interface DocsAppProps {
  config: DocsConfig;
}
