import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateAccessCode, getConfig } from '../netlify/functions/_shared/config';
import { log } from '../netlify/functions/_shared/logger';

describe('Credentials and Security Protections', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('validates access code correctly when configured', () => {
    process.env.APP_ACCESS_CODE = 'secret-passphrase-123';
    expect(validateAccessCode('secret-passphrase-123')).toBe(true);
    expect(validateAccessCode('wrong-code')).toBe(false);
    expect(validateAccessCode(undefined)).toBe(false);
  });

  it('allows access when no access code is configured in environment', () => {
    delete process.env.APP_ACCESS_CODE;
    expect(validateAccessCode(undefined)).toBe(true);
    expect(validateAccessCode('any-code')).toBe(true);
  });

  it('reads config correctly and provides default models', () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    const config = getConfig();
    expect(config.geminiApiKey).toBe('test-gemini-key');
    expect(config.geminiDirectorModel).toBe('gemini-3.8-flash');
    expect(config.cloudflareImageModel).toBe('@cf/black-forest-labs/flux-1-schnell');
  });

  it('SECURITY SAFEGUARD: No VITE_ prefixed API secret variables in .env.example', () => {
    // Read .env.example to ensure no secret has VITE_ prefix
    const fs = require('fs');
    const path = require('path');
    const envExamplePath = path.resolve(__dirname, '../.env.example');
    const content = fs.readFileSync(envExamplePath, 'utf-8');

    expect(content).not.toContain('VITE_GEMINI');
    expect(content).not.toContain('VITE_CLOUDFLARE');
    expect(content).not.toContain('VITE_YOUTUBE');
    expect(content).toContain('GEMINI_API_KEY');
    expect(content).toContain('CLOUDFLARE_API_TOKEN');
  });
});
