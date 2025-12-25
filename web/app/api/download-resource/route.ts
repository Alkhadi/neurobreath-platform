import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const name = searchParams.get('name') || 'Student';
  const achievement = searchParams.get('achievement') || 'Completion';

  let content = '';
  let filename = '';

  switch (type) {
    case 'parent-guide':
      filename = 'Dyslexia_Parent_Guide.html';
      content = generateParentGuide();
      break;
    case 'progress-tracker':
      filename = 'Progress_Tracker.html';
      content = generateProgressTracker();
      break;
    case 'phonics-worksheets':
      filename = 'Phonics_Worksheets.html';
      content = generatePhonicsWorksheets();
      break;
    case 'letter-reversal-practice':
      filename = 'Letter_Reversal_Practice.html';
      content = generateLetterReversalPractice();
      break;
    case 'certificate':
      filename = `Achievement_Certificate_${Date.now()}.html`;
      content = generateCertificate(name, achievement);
      break;
    default:
      return NextResponse.json({ error: 'Invalid resource type' }, { status: 400 });
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

function generateParentGuide() {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Parent & Educator Guide</title>
<style>body{font-family:Arial,sans-serif;line-height:1.6;padding:40px;max-width:800px;margin:0 auto}h1{color:#4F46E5;border-bottom:3px solid #4F46E5;padding-bottom:10px}h2{color:#7C3AED;margin-top:30px}.tip{background:#F3F4F6;padding:15px;border-left:4px solid #4F46E5;margin:20px 0}</style>
</head>
<body>
<h1>📚 Parent & Educator Guide to Dyslexia Support</h1>
<p><em>Evidence-Based Strategies for Success</em></p>
<h2>✅ Daily Best Practices (10-15 Minutes)</h2>
<div class="tip"><strong>💡 Tip:</strong> Short, consistent sessions beat long, infrequent ones!</div>
<h3>1. Multisensory Practice</h3>
<ul><li>Write letters in sand or shaving cream</li><li>Use letter tiles for hands-on learning</li><li>Trace letters in the air while saying sounds</li></ul>
<h3>2. Read Aloud Daily</h3>
<ul><li>Read TO your child, not just have them read to you</li><li>Use audiobooks to support struggling readers</li></ul>
<h3>3. Celebrate Progress</h3>
<ul><li>Focus on effort and growth</li><li>Track small wins</li></ul>
<p style="margin-top:40px;color:#6B7280;font-size:12px">© ${new Date().getFullYear()} NeuroBreath</p>
</body></html>`;
}

function generateProgressTracker() {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Progress Tracker</title>
<style>body{font-family:Arial,sans-serif;padding:40px}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:2px solid #4F46E5;padding:12px}th{background:#4F46E5;color:white}</style>
</head>
<body>
<h1 style="color:#4F46E5;text-align:center">📊 Weekly Progress Tracker</h1>
<p style="text-align:center">Student: __________ Week of: __________</p>
<table><tr><th>Day</th><th>Phonics (10min)</th><th>Reading (15min)</th><th>Notes</th></tr>
<tr><td>Monday</td><td>☐</td><td>☐</td><td></td></tr>
<tr><td>Tuesday</td><td>☐</td><td>☐</td><td></td></tr>
<tr><td>Wednesday</td><td>☐</td><td>☐</td><td></td></tr>
<tr><td>Thursday</td><td>☐</td><td>☐</td><td></td></tr>
<tr><td>Friday</td><td>☐</td><td>☐</td><td></td></tr></table>
<p style="margin-top:40px;text-align:center;font-size:24px;color:#4F46E5"><strong>🌟 Keep Up the Great Work! 🌟</strong></p>
</body></html>`;
}

function generatePhonicsWorksheets() {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Phonics Worksheets</title>
<style>body{font-family:'Comic Sans MS',Arial;padding:40px}h1{color:#4F46E5;text-align:center}.trace{color:#D1D5DB;font-size:48px}</style>
</head>
<body>
<h1>📝 Phonics Practice</h1>
<p><strong>Name:</strong> __________ <strong>Date:</strong> __________</p>
<h2>Trace and Write:</h2>
<p class="trace">b b b b b</p>
<p style="border-bottom:2px solid #000;min-height:60px"></p>
<h2>Blend these sounds:</h2>
<p><strong>1. /c/ + /a/ + /t/ =</strong> __________</p>
<p><strong>2. /d/ + /o/ + /g/ =</strong> __________</p>
</body></html>`;
}

function generateLetterReversalPractice() {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Letter Reversal Practice</title>
<style>body{font-family:'Comic Sans MS',Arial;padding:40px}h1{color:#06B6D4;text-align:center}.large{font-size:120px;text-align:center}</style>
</head>
<body>
<h1>🔄 Letter Reversal Practice: b & d</h1>
<p style="text-align:center"><strong>Name:</strong> __________ <strong>Date:</strong> __________</p>
<div style="background:#F0F9FF;padding:20px;margin:20px 0"><h2>💡 Memory Trick:</h2>
<p><strong>b</strong> has stick on left (like bat before hitting)</p></div>
<div class="large">b</div>
<p style="border-bottom:3px solid #06B6D4;min-height:80px"></p>
<div class="large">d</div>
<p style="border-bottom:3px solid #06B6D4;min-height:80px"></p>
</body></html>`;
}

function generateCertificate(name: string, achievement: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Certificate</title>
<style>body{font-family:Georgia,serif;padding:60px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}.certificate{background:white;padding:60px;border:10px solid #4F46E5;border-radius:20px}h1{color:#4F46E5;text-align:center;font-size:48px}.name{text-align:center;font-size:42px;margin:40px 0;font-weight:bold}</style>
</head>
<body>
<div class="certificate">
<h1>🏆 Certificate of Achievement 🏆</h1>
<p style="text-align:center;font-style:italic;color:#7C3AED;font-size:24px">NeuroBreath Dyslexia Training Hub</p>
<p style="text-align:center;font-size:20px">This certificate is proudly presented to</p>
<div class="name">${name}</div>
<p style="text-align:center;font-size:20px">For successfully completing<br><strong style="color:#4F46E5;font-size:24px">${achievement}</strong></p>
<div style="text-align:center;font-size:60px;margin:30px 0">⭐ 🎓 ⭐</div>
<p style="text-align:center;margin-top:50px">${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p>
</div>
</body></html>`;
}
