/**
 * Form Accessibility Verification Script
 * 
 * Run this script in the browser console on any page to verify
 * that all form fields have proper id, name, and label associations.
 * 
 * Usage:
 * 1. Open the page in your browser
 * 2. Open DevTools Console (F12 or Cmd+Option+I)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 * 
 * The script will output:
 * - Total number of form fields found
 * - List of fields missing id or name
 * - List of fields missing label associations
 * - Overall pass/fail status
 */

(() => {
  console.log('\n🔍 FORM ACCESSIBILITY VERIFICATION\n');
  console.log('='.repeat(50));
  
  // Get all form fields (excluding hidden and disabled)
  const fields = [...document.querySelectorAll('input, select, textarea')]
    .filter(el => el.type !== 'hidden' && !el.disabled);

  console.log(`\n✅ Total form fields found: ${fields.length}\n`);

  // Check for missing id OR name
  const missingIdOrName = fields.filter(el => !el.id && !el.name);
  
  // Check for missing label associations
  const missingLabel = fields.filter(el => {
    const hasLabelFor = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    const wrapped = el.closest('label');
    const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    return !(hasLabelFor || wrapped || aria);
  });

  // Check for duplicate IDs (critical issue)
  const idsFound = new Map();
  const duplicateIds = [];
  fields.forEach(el => {
    if (el.id) {
      if (idsFound.has(el.id)) {
        duplicateIds.push(el.id);
      } else {
        idsFound.set(el.id, el);
      }
    }
  });

  // Report findings
  console.log('📋 DETAILED REPORT:\n');
  
  // 1. Missing ID or Name
  if (missingIdOrName.length > 0) {
    console.log(`❌ Found ${missingIdOrName.length} field(s) missing BOTH id AND name:`);
    missingIdOrName.forEach((el, idx) => {
      console.log(`   ${idx + 1}. <${el.tagName.toLowerCase()} type="${el.type}">`);
      console.log(`      Location: ${getElementPath(el)}`);
      console.log(`      Placeholder: "${el.placeholder || 'none'}"`);
      console.log('');
    });
  } else {
    console.log('✅ All fields have id or name attribute\n');
  }

  // 2. Missing Label Association
  if (missingLabel.length > 0) {
    console.log(`❌ Found ${missingLabel.length} field(s) missing label association:`);
    missingLabel.forEach((el, idx) => {
      console.log(`   ${idx + 1}. <${el.tagName.toLowerCase()} id="${el.id || 'none'}" name="${el.name || 'none'}" type="${el.type}">`);
      console.log(`      Location: ${getElementPath(el)}`);
      console.log('');
    });
  } else {
    console.log('✅ All fields have proper label association\n');
  }

  // 3. Duplicate IDs
  if (duplicateIds.length > 0) {
    console.log(`❌ Found ${duplicateIds.length} DUPLICATE ID(s):`);
    duplicateIds.forEach(id => {
      console.log(`   - "${id}" (used multiple times)`);
    });
    console.log('');
  } else {
    console.log('✅ All field IDs are unique\n');
  }

  // 4. Field-by-field detailed report
  console.log('📊 COMPLETE FIELD INVENTORY:\n');
  fields.forEach((el, idx) => {
    const hasId = !!el.id;
    const hasName = !!el.name;
    const hasLabel = !missingLabel.includes(el);
    const status = (hasId && hasName && hasLabel) ? '✅' : '⚠️';
    
    console.log(`${status} Field ${idx + 1}:`);
    console.log(`   Tag: <${el.tagName.toLowerCase()} type="${el.type}">`);
    console.log(`   ID: ${el.id || '❌ MISSING'}`);
    console.log(`   Name: ${el.name || '❌ MISSING'}`);
    console.log(`   Label: ${hasLabel ? '✅ Associated' : '❌ NOT ASSOCIATED'}`);
    if (el.placeholder) {
      console.log(`   Placeholder: "${el.placeholder}"`);
    }
    console.log('');
  });

  // Final summary
  console.log('='.repeat(50));
  console.log('\n📝 SUMMARY:\n');
  
  const allPass = missingIdOrName.length === 0 && 
                  missingLabel.length === 0 && 
                  duplicateIds.length === 0;

  if (allPass) {
    console.log('🎉 SUCCESS! All form fields are properly configured!');
    console.log('✅ All fields have id or name');
    console.log('✅ All fields have label associations');
    console.log('✅ All IDs are unique');
  } else {
    console.log('⚠️ ISSUES FOUND:');
    if (missingIdOrName.length > 0) {
      console.log(`   ❌ ${missingIdOrName.length} field(s) missing id AND name`);
    }
    if (missingLabel.length > 0) {
      console.log(`   ❌ ${missingLabel.length} field(s) missing label association`);
    }
    if (duplicateIds.length > 0) {
      console.log(`   ❌ ${duplicateIds.length} duplicate ID(s)`);
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n');

  // Helper function to get element path
  function getElementPath(el) {
    const path = [];
    let current = el;
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      } else if (current.className) {
        const classes = current.className.split(' ').filter(c => c).slice(0, 2).join('.');
        if (classes) selector += `.${classes}`;
      }
      path.unshift(selector);
      current = current.parentElement;
    }
    return path.join(' > ');
  }
})();

