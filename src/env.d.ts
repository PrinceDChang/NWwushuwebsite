/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CONTACT_API_URL: string;
  readonly PUBLIC_CONTACT_HONEYPOT?: string;
  readonly PUBLIC_FORMSPREE_TRIAL_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
