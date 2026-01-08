# Classroom Join Dialog – Role-Neutral Upgrade

**Date**: 2026-01-01  
**Status**: ✅ Complete  
**File**: `components/ClassroomJoinDialog.tsx`

---

## Overview

The "Join Classroom" dialog has been upgraded to a **role-neutral, inclusive interface** that supports:

- ✅ **Parents/Guardians** connecting to their child's progress
- ✅ **Learners** (children & adults) joining a classroom or support group
- ✅ **Teachers** managing their class
- ✅ **Tutors/Therapists** tracking client progress
- ✅ **Other roles** for flexible use cases

This upgrade maintains **privacy-first principles**: all data is stored device-locally, with optional syncing only if explicitly enabled by the organiser.

---

## Key Changes

### 1. **Renamed Fields (Breaking Change)**

| Old Field Name    | New Field Name   | Purpose                                      |
|-------------------|------------------|----------------------------------------------|
| `classCode`       | `groupCode`      | More inclusive (not just classrooms)         |
| `learnerName`     | `learnerLabel`   | Allows nicknames, adult names, group IDs     |
| `guardianEmail`   | `contactEmail`   | Can be parent, adult learner, or admin email |

**Migration Note**: If you have existing localStorage entries with the old keys, they will need to be migrated or users will need to re-enter their details.

### 2. **New Fields**

#### `role` (Optional)
A dropdown selector with the following options:
- Parent/Guardian
- Learner
- Teacher
- Tutor/Therapist
- Other

**Purpose**: Helps tailor the UI and messaging based on who's joining.

#### `className` (Optional, Teachers Only)
A text input that only appears when `role === 'teacher'`. Allows teachers to specify a class name like:
- "Year 6 Literacy Support"
- "Wednesday Afternoon Group"

### 3. **Enhanced Validation**

- **Email validation**: Real-time feedback if an invalid email is entered (optional field)
- **Group code**: Minimum 4 characters, case-insensitive, trimmed
- **Max lengths**: 
  - `learnerLabel`: 60 characters
  - `className`: 60 characters
  - `groupCode`: 20 characters

### 4. **Improved Copy & Messaging**

**Dialog Title**:
```
Join a Classroom or Support Group
```

**Description**:
```
Connect to a teacher, tutor, therapist, or parent group using a shared code. 
This lets you share progress (only if you choose).
```

**Privacy Notice** (now green-themed for trust):
```
Privacy-first
We save this information only on this device. Nothing is uploaded unless 
your organiser has set up syncing and you explicitly enable it.
```

**Role-Specific Success Messages**:
- Parent: "Connected successfully! You can now view your learner's progress."
- Teacher: "Connected successfully! Your class is ready to track."
- Tutor: "Connected successfully! You can now monitor client progress."
- Default: "Connected successfully! Progress sharing is now enabled."

### 5. **Accessibility Improvements**

All inputs now include:
- ✅ `id` + `name` attributes
- ✅ `<label for="...">` associations
- ✅ `aria-describedby` for help text
- ✅ `aria-invalid` for error states (email validation)
- ✅ `aria-required` for required fields
- ✅ Helpful `autocomplete` attributes:
  - `groupCode`: `"one-time-code"`
  - `learnerLabel`: `"nickname"`
  - `contactEmail`: `"email"`

---

## TypeScript Interface

```typescript
export interface ClassroomJoinDetails {
  groupCode: string;              // Required (min 4 chars)
  learnerLabel?: string;          // Optional (max 60 chars)
  contactEmail?: string;          // Optional (validated email)
  role?: 'parent' | 'learner' | 'teacher' | 'tutor' | 'other'; // Optional
  className?: string;             // Optional, only for teachers (max 60 chars)
  joinedAt: string;               // ISO timestamp
}
```

---

## User Experience Flow

### State 1: Opening the Dialog
- Dialog opens with focus on `groupCode` field
- All fields are empty and ready for input

### State 2: Selecting a Role (Optional)
- User can select a role from the dropdown
- If "Teacher" is selected, the `className` field appears below

### State 3: Filling in Details
- User enters the group code (required)
- Optionally enters a learner label (nickname or name)
- Optionally enters a contact email (validated in real-time)
- Optionally selects a role
- If teacher, optionally enters a class name

### State 4: Submission
- "Join" button is disabled if:
  - `groupCode` is empty
  - `contactEmail` has a validation error
- On success:
  - Details are saved to localStorage under key `classroomJoinDetails`
  - Onboarding is marked complete
  - Role-specific success toast is shown
  - Dialog closes and resets

### State 5: Cancellation
- User clicks "Cancel" or closes the dialog
- All fields are reset
- No data is saved

---

## Privacy & Data Storage

### What's Stored Locally
```json
{
  "groupCode": "ABCD123",
  "learnerLabel": "Sam",
  "contactEmail": "parent@example.com",
  "role": "parent",
  "joinedAt": "2026-01-01T12:00:00.000Z"
}
```

### What's NOT Stored
- Nothing is sent to a server unless the organiser has explicitly set up syncing
- No tracking, no analytics, no third-party services

---

## Migration Guide

If you're upgrading from the old `ClassroomJoinDialog`, you may have existing data stored as:

```typescript
// OLD FORMAT
{
  "classCode": "ABC123",
  "learnerName": "John",
  "guardianEmail": "parent@example.com",
  "joinedAt": "2025-12-01T10:00:00.000Z"
}
```

To migrate, add a one-time migration script in your app's initialization:

```typescript
// Example migration (add to useEffect in your root layout or App component)
useEffect(() => {
  const oldData = localStorage.getItem('classroomJoinDetails');
  if (oldData) {
    try {
      const parsed = JSON.parse(oldData);
      if (parsed.classCode && !parsed.groupCode) {
        // Migrate to new format
        const newData: ClassroomJoinDetails = {
          groupCode: parsed.classCode,
          learnerLabel: parsed.learnerName,
          contactEmail: parsed.guardianEmail,
          role: parsed.guardianEmail ? 'parent' : 'learner',
          joinedAt: parsed.joinedAt,
        };
        localStorage.setItem('classroomJoinDetails', JSON.stringify(newData));
      }
    } catch (e) {
      console.error('Failed to migrate classroom join data:', e);
    }
  }
}, []);
```

---

## Testing Checklist

### Functional Tests
- [ ] Dialog opens on trigger
- [ ] Group code is required (button disabled if empty)
- [ ] Email validation works (shows error for invalid format)
- [ ] Role dropdown shows all 5 options
- [ ] `className` field only appears when role is "teacher"
- [ ] Success toast shows role-specific message
- [ ] Data is saved to localStorage on submit
- [ ] Dialog resets on cancel/close
- [ ] Form resets after successful submission

### Accessibility Tests
- [ ] All inputs have associated labels
- [ ] Tab order is logical
- [ ] Error messages are announced by screen readers
- [ ] Required fields are marked with `aria-required`
- [ ] Help text is associated with inputs via `aria-describedby`
- [ ] Dialog can be closed with Escape key
- [ ] Focus is trapped within dialog
- [ ] Focus returns to trigger element on close

### Visual Tests
- [ ] Layout is responsive (tested at 320px, 768px, 1024px)
- [ ] Privacy notice is visible and readable
- [ ] Teacher-only field appears/disappears smoothly
- [ ] Error states are visually distinct (red text + icon)
- [ ] Success toast is visible for at least 4 seconds
- [ ] All text is legible in light and dark modes

### Edge Cases
- [ ] Whitespace in group code is trimmed
- [ ] Group code is stored in uppercase
- [ ] Email field accepts international characters
- [ ] Form handles rapid submit button clicks (debouncing)
- [ ] Dialog handles slow localStorage writes gracefully
- [ ] Long learner labels/class names are truncated or wrap properly

---

## Known Limitations

1. **No Server Validation**: Group codes are not validated against a server. Any code will be accepted.
2. **No Duplicate Prevention**: Users can join the same group multiple times (last entry wins).
3. **Single Group Only**: This design assumes one active group connection at a time. Multi-group support would require additional UI.

---

## Future Enhancements

- [ ] Add "Recently Used Codes" dropdown for quick re-joining
- [ ] Add server-side code validation (optional feature flag)
- [ ] Add "Leave Group" button in a settings panel
- [ ] Add multi-group support (e.g., a learner in both a classroom and a therapy group)
- [ ] Add QR code scanning for group codes
- [ ] Add "Invite Link" support (e.g., `neurobreath.com/join?code=ABCD123`)

---

## Questions or Issues?

If you encounter any problems or have suggestions for improvement, please:
1. Check the browser console for errors
2. Verify localStorage is enabled and not full
3. Test in a fresh incognito/private window (to rule out stale data)
4. Report issues with:
   - Browser version
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots (if applicable)

---

**Upgrade Complete!** 🎉

The new role-neutral "Join Classroom" dialog is now live and ready to support parents, learners, teachers, tutors, and more.

