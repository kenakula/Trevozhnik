/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_ID?: string;
  readonly VITE_PROJECT_NAME?: string;
  readonly VITE_PROJECT_VERSION?: string;
  readonly VITE_ENDPOINT?: string;
  readonly VITE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
