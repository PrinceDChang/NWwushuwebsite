/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FORMSPREE_CONTACT_ID: string;
  readonly PUBLIC_FORMSPREE_TRIAL_ID: string;
  readonly PUBLIC_FORMSPREE_HONEYPOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
