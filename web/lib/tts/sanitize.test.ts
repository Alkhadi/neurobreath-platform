/**
 * TTS Sanitizer Tests
 *
 * Run with: npx tsx lib/tts/sanitize.test.ts
 */

import { strict as assert } from 'assert';
import {
  sanitizeForTTS,
  isNonSpeechText,
  extractSpeakableText,
} from './sanitize';

let passed = 0;
let failed = 0;

function it(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    // eslint-disable-next-line no-console
    console.log(`✓ ${name}`);
  } catch (err) {
    failed++;
    // eslint-disable-next-line no-console
    console.error(`✗ ${name}`);
    // eslint-disable-next-line no-console
    console.error(`  ${err instanceof Error ? err.message : String(err)}`);
  }
}

function describe(name: string, fn: () => void) {
  // eslint-disable-next-line no-console
  console.log(`\n${name}`);
  fn();
}

describe('TTS Sanitizer', () => {
  describe('sanitizeForTTS', () => {
    it('should remove emojis', () => {
      const input = 'Hello 👋 world 🌍!';
      const output = sanitizeForTTS(input);
      assert.ok(!output.includes('👋'));
      assert.ok(!output.includes('🌍'));
      assert.ok(output.includes('Hello'));
      assert.ok(output.includes('world'));
    });

    it('should remove decorative symbols', () => {
      const input = '• Item 1\n→ Next step\n★ Important';
      const output = sanitizeForTTS(input);
      assert.ok(!output.includes('•'));
      assert.ok(!output.includes('→'));
      assert.ok(!output.includes('★'));
      assert.ok(output.includes('Item 1'));
      assert.ok(output.includes('Next step'));
      assert.ok(output.includes('Important'));
    });

    it('should keep alphanumeric and basic punctuation', () => {
      const input = 'Hello, world! How are you? I am fine.';
      const output = sanitizeForTTS(input);
      assert.equal(output, 'Hello, world! How are you? I am fine.');
    });

    it('should normalize whitespace', () => {
      const input = 'Too    many     spaces';
      const output = sanitizeForTTS(input);
      assert.equal(output, 'Too many spaces');
    });

    it('should handle empty strings', () => {
      assert.equal(sanitizeForTTS(''), '');
      assert.equal(sanitizeForTTS('   '), '');
    });

    it('should normalize excessive punctuation', () => {
      const input = 'What?!?!?! Really......';
      const output = sanitizeForTTS(input);
      assert.equal(output, 'What? Really...');
    });

    it('should filter non-alphanumeric when enabled', () => {
      const input = 'Price: $50 (50% off) @ 10:00pm #sale';
      const output = sanitizeForTTS(input, { filterNonAlphanumeric: true });
      assert.ok(output.includes('Price'));
      assert.ok(output.includes('50'));
      assert.ok(output.includes('off'));
      assert.ok(!output.includes('$'));
      assert.ok(!output.includes('@'));
      assert.ok(!output.includes('#'));
    });

    it('should keep basic punctuation with filtering', () => {
      const input = 'Yes, that is correct. Are you sure?';
      const output = sanitizeForTTS(input, { filterNonAlphanumeric: true });
      assert.ok(output.includes(','));
      assert.ok(output.includes('.'));
      assert.ok(output.includes('?'));
    });
  });

  describe('isNonSpeechText', () => {
    it('should identify mostly decorative text', () => {
      assert.equal(isNonSpeechText('★★★★★'), true);
      assert.equal(isNonSpeechText('••••••'), true);
      assert.equal(isNonSpeechText('→→→'), true);
    });

    it('should not flag normal text as non-speech', () => {
      assert.equal(isNonSpeechText('This is a normal sentence.'), false);
      assert.equal(isNonSpeechText('Item 1: Description here'), false);
    });

    it('should handle mixed content', () => {
      // Text with some symbols is still mostly text
      assert.equal(isNonSpeechText('★ Important: Read this carefully'), false);
      // Mostly symbols with little text
      assert.equal(isNonSpeechText('★★★ Hi ★★★'), true);
    });
  });

  describe('extractSpeakableText', () => {
    it('should remove HTML tags', () => {
      const html = '<p>Hello <strong>world</strong>!</p>';
      const output = extractSpeakableText(html);
      assert.ok(!output.includes('<p>'));
      assert.ok(!output.includes('<strong>'));
      assert.ok(output.includes('Hello'));
      assert.ok(output.includes('world'));
    });

    it('should decode HTML entities', () => {
      const html = 'AT&amp;T&nbsp;Corporation';
      const output = extractSpeakableText(html);
      assert.ok(output.includes('AT'));
      assert.ok(output.includes('and'));
      assert.ok(output.includes('T Corporation'));
    });

    it('should combine tag removal and sanitization', () => {
      const html = '<div>Price: <span>$50</span> 🎉</div>';
      const output = extractSpeakableText(html);
      assert.ok(!output.includes('<div>'));
      assert.ok(!output.includes('<span>'));
      assert.ok(!output.includes('🎉'));
      assert.ok(output.includes('Price'));
      assert.ok(output.includes('50'));
    });
  });

  describe('Edge cases', () => {
    it('should handle very long strings', () => {
      const longText = 'word '.repeat(1000);
      const output = sanitizeForTTS(longText);
      assert.ok(output.length > 0);
      assert.ok(!output.includes('  ')); // No double spaces
    });

    it('should handle special characters', () => {
      const input = 'C++ and C# are languages';
      const output = sanitizeForTTS(input, { filterNonAlphanumeric: true });
      assert.ok(output.includes('C'));
      assert.ok(output.includes('and'));
      assert.ok(output.includes('are languages'));
    });

    it('should handle numbers and dates', () => {
      const input = 'January 17, 2026 at 3:30 PM';
      const output = sanitizeForTTS(input, { filterNonAlphanumeric: true });
      assert.ok(output.includes('January 17'));
      assert.ok(output.includes('2026'));
      assert.ok(output.includes('3'));
      assert.ok(output.includes('30 PM'));
    });
  });
});

// eslint-disable-next-line no-console
console.log(`\nDone. Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exitCode = 1;
