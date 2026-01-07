/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_KOFI_URL: string;
    readonly VITE_LINKEDIN_URL: string;
    readonly VITE_TWITTER_URL: string;
    readonly VITE_EMAIL_URL: string;
    readonly VITE_GITHUB_URL: string;
    readonly VITE_WEBSITE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

