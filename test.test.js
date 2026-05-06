// Basic test to verify test setup works
import { expect, test } from 'vitest';

test('basic test setup', () => {
  expect(1 + 1).toBe(2);
});

test('Vercel analytics global exists', () => {
  expect(typeof window.va).toBe('function');
});
