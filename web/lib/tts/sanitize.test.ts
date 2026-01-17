/**
 * TTS Sanitizer Tests
 * 
 * Tests for text sanitization to ensure clean speech output.
 */

import { describe, it, expect } from '@jest/globals';
import {
  sanitizeForTTS,
  isNonSpeechText,
  extractSpeakableText,
} from './sanitize';

describe('TTS Sanitizer', () => {
  describe('sanitizeForTTS', () => {
    it('should remove emojis', () => {
      const input = 'Hello 👋 world 🌍!';
      const output = sanitizeForTTS(input);
      expect(output).not.toContain('👋');
      expect(output).not.toContain('🌍');
      expect(output).toContain('Hello');
      expect(output).toContain('world');
    });

    it('should remove decorative symbols', () => {
      const input = '• Item 1\n→ Next step\n★ Important';
      const output = sanitizeForTTS(input);
      expect(output).not.toContain('•');
      expect(output).not.toContain('→');
      expect(output).not.toContain('★');
      expect(output).toContain('Item 1');
      expect(output).toContain('Next step');
      expect(output).toContain('Important');
    });

    it('should keep alphanumeric and basic punctuation', () => {
      const input = 'Hello, world! How are you? I am fine.';
      const output = sanitizeForTTS(input);
      expect(output).toBe('Hello, world! How are you? I am fine.');
    });

    it('should normalize whitespace', () => {
      const input = 'Too    many     spaces';
      const output = sanitizeForTTS(input);
      expect(output).toBe('Too many spaces');
    });

    it('should handle empty strings', () => {
      expect(sanitizeForTTS('')).toBe('');
      expect(sanitizeForTTS('   ')).toBe('');
    });

    it('should normalize excessive punctuation', () => {
      const input = 'What?!?!?! Really......';
      const output = sanitizeForTTS(input);
      expect(output).toBe('What? Really...');
    });

    it('should filter non-alphanumeric when enabled', () => {
      const input = 'Price: $50 (50% off) @ 10:00pm #sale';
      const output = sanitizeForTTS(input, { filterNonAlphanumeric: true });
      expect(output).toContain('Price');
      expect(output).toContain('50');
      expect(output).toContain('off');
      expect(output).not.toContain('$');
      expect(output).not.toContain('@');
      expect(output).not.toContain('#');
    });

    it('should keep basic punctuation with filtering', () => {
      const input = 'Yes, that is correct. Are you sure?';
      const output = sanitizeForTTS(input, { filterNonAlphanumeric: true });
      expect(output).toContain(',');
      expect(output).toContain('.');
      expect(output).toContain('?');
    });
  });

  describe('isNonSpeechText', () => {
    it('should identify mostly decorative text', () => {
      expect(isNonSpeechText('★★★★★')).toBe(true);
      expect(isNonSpeechText('••••••')).toBe(true);
      expect(isNonSpeechText('→→→')).toBe(true);
    });

    it('should not flag normal text as non-speech', () => {
      expect(isNonSpeechText('This is a normal sentence.')).toBe(false);
      expect(isNonSpeechText('Item 1: Description here')).toBe(false);
    });

    it('should handle mixed content', () => {
      // Text with some symbols is still mostly text
      expect(isNonSpeechText('★ Important: Read this carefully')).toBe(false);
      // Mostly symbols with little text
      expect(isNonSpeechText('★★★ Hi ★★★')).toBe(true);
    });
  });

  describe('extractSpeakableText', () => {
    it('should remove HTML tags', () => {
      const html = '<p>Hello <strong>world</strong>!</p>';
      const output = extractSpeakableText(html);
      expect(output).not.toContain('<p>');
      expect(output).not.toContain('<strong>');
      expect(output).toContain('Hello');
      expect(output).toContain('world');
    });

    it('should decode HTML entities', () => {
      const html = 'AT&amp;T&nbsp;Corporation';
      const output = extractSpeakableText(html);
      expect(output).toContain('AT');
      expect(output).toContain('and');
      expect(output).toContain('T Corporation');
    });

    it('should combine tag removal and sanitization', () => {
      const html = '<div>Price: <span>$50</span> 🎉</div>';
      const output = extractSpeakableText(html);
      expect(output).not.toContain('<div>');
      expect(output).not.toContain('<span>');
      expect(output).not.toContain('🎉');
      expect(output).toContain('Price');
      expect(output).toContain('50');
    });
  });

  describe('Edge cases', () => {
    it('should handle very long strings', () => {
      const longText = 'word '.repeat(1000);
      const output = sanitizeForTTS(longText);
      expect(output.length).toBeGreaterThan(0);
      expect(output).not.toContain('  '); // No double spaces
    });

    it('should handle special characters', () => {
      const input = 'C++ and C# are languages';
      const output = sanitizeForTTS(input, { filterNonAlphanumeric: true });
      expect(output).toContain('C');
      expect(output).toContain('and');
      expect(output).toContain('are languages');
    });

    it('should handle numbers and dates', () => {
      const input = 'January 17, 2026 at 3:30 PM';
      const output = sanitizeForTTS(input, { filterNonAlphanumeric: true });
      expect(output).toContain('January 17');
      expect(output).toContain('2026');
      expect(output).toContain('3');
      expect(output).toContain('30 PM');
    });
  });
});
