export interface DocumentSection {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  content?: string;
  subsections?: DocumentSubsection[];
}

export interface DocumentSubsection {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  content?: string;
}

export interface BrandingConfig {
  theme: string;
  tagline: string;
  logo?: string;
  backgroundImage?: string;
  primaryColor?: string;
  accentColor?: string;
  github?: string;
  npm?: string;
}

export interface VersionConfig {
  source: 'manual' | 'env' | 'package.json';
  value?: string;
  envVar?: string;
}

export interface VitePluginConfig {
  name: string;
  config: any;
}

export interface FileToCopy {
  source: string;
  destination: string;
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
  filesToCopy: FileToCopy[];
}

export interface DocsAppProps {
  config: DocsConfig;
}
