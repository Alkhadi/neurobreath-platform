import test from 'node:test';
import assert from 'node:assert/strict';

import { extractTextFromNhsPublicHtml } from '../server/nhs';

test('extractTextFromNhsPublicHtml keeps treatment content and strips footer boilerplate', () => {
  const html = `
    <html>
      <body>
        <main id="maincontent">
          <h1>Generalised anxiety disorder (GAD)</h1>
          <p>Generalised anxiety disorder (GAD) is a common mental health condition.</p>
          <h2>Treatment for generalised anxiety disorder (GAD)</h2>
          <p>Treatment can help you to manage your symptoms.</p>
          <ul>
            <li>talking therapies such as cognitive behavioural therapy (CBT)</li>
            <li>medicines such as SSRIs</li>
          </ul>
          <p>Page last reviewed: 22 October 2024 Next review due: 22 October 2027</p>
          <h2>Support links</h2>
          <p>Home</p>
          <p>About us</p>
        </main>
      </body>
    </html>
  `;

  const result = extractTextFromNhsPublicHtml(
    html,
    'https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/overview/'
  );

  assert.ok(result);
  assert.equal(result.title, 'Generalised anxiety disorder (GAD)');
  assert.match(result.text, /Treatment for generalised anxiety disorder/i);
  assert.match(result.text, /talking therapies such as cognitive behavioural therapy/i);
  assert.match(result.text, /medicines such as SSRIs/i);
  assert.doesNotMatch(result.text, /Support links/i);
  assert.doesNotMatch(result.text, /About us/i);
  assert.equal(result.lastReviewed, '22 October 2024');
});