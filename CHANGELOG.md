# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-12-17

### Added
- `TRUSTED_ORIGINS` environment variable for configurable auth origin validation
- `MIN_PASSWORD_LENGTH` environment variable (defaults to 8 in production, 1 in dev)
- Request timeout (30s) on email service to prevent hanging requests
- Extracted crypto utilities to `src/lib/server/auth/crypto.ts`
- Extracted PBKDF2 hasher to `src/lib/server/auth/pbkdf2.ts`

### Changed
- Refactored auth module to use top-level imports instead of dynamic `await import()`
- Standardized directory naming to lowercase:
  - `src/lib/Components` → `src/lib/components`
  - `src/lib/Managers` → `src/lib/managers`
  - `src/lib/Inbox` → `src/lib/inbox`
- Improved null-safe access in `scraper_GetLastUpdateByCompanyName`
- Updated `.env.example` with new auth configuration variables
- Added `.svelte-kit/output` to TypeScript exclude paths

### Removed
- Dead code: commented-out webhook handler (`src/routes/webhook/+server.ts`)
- Dead code: commented-out Stripe manager (`src/lib/server/StripeManager.ts`)
- Empty file: `src/auth.ts`
