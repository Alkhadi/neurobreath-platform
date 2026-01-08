# 🤖 PageBuddy - Site-Wide AI Assistant Integration

## ✅ **COMPLETE & OPERATIONAL**

The PageBuddy AI assistant is **fully wired and operational** across your entire NeuroBreath platform! 🎉

---

## 🏗️ **Architecture Overview**

### **1. Root Layout Integration**
**File:** `/app/layout.tsx`

```typescript
import { PageBuddy } from '@/components/page-buddy';
import { BreathingSessionProvider } from '@/contexts/BreathingSessionContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <BreathingSessionProvider>
            {children}
            <PageBuddy /> {/* 🚀 Site-wide AI assistant */}
          </BreathingSessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**✅ Result:** PageBuddy appears on **ALL pages automatically**

---

## 🎯 **Dynamic Page Configurations**

### **File:** `/lib/page-buddy-configs.ts`

PageBuddy automatically detects the current page and adapts its:
- Welcome message
- Quick questions
- Section guidance
- Keywords for intelligent responses
- Target audiences

### **Configured Pages:**

1. ✅ **Home** (`/`) - Platform overview & hub navigation
2. ✅ **ADHD Hub** (`/adhd`) - Focus tools, quests, skills library
3. ✅ **Autism Hub** (`/autism`) - Calm toolkit, education pathways, resources
4. ✅ **Blog** (`/blog`) - Articles & research summaries
5. ✅ **Tools** (`/tools`) - Interactive tools & games
6. ✅ **Breathing Exercises** (`/breathing`) - Breathing techniques guide
7. ✅ **Resources** (`/resources`) - Downloads & templates
8. ✅ **Teacher Quick Pack** (`/teacher-quick-pack`) - Classroom strategies
9. ✅ **Schools** (`/schools`) - SEND guidance & home-school collaboration
10. ✅ **Getting Started** (`/get-started`) - Onboarding for new users
11. ✅ **About** (`/about`) - Mission & team information

---

## 🎨 **Complete Feature Set**

### **1. Intelligent Chat Interface**
- 💬 Context-aware responses based on current page
- 🔄 Chat history within session
- 📍 Page-specific welcome messages
- 🎯 Quick question buttons for common queries

### **2. Auto-Speak Functionality**
- 🔊 Text-to-speech for AI responses
- 🎚️ Toggle on/off
- ♿ Accessibility feature for all users

### **3. Page Tour System**
- 🗺️ Guided tours of page sections
- 📍 Step-by-step navigation
- 💡 Context-sensitive tips
- ✨ Interactive highlights

### **4. Smart Context Detection**
```typescript
const config = getPageConfig(pathname); // Automatically adapts to current page
```

### **5. Evidence-Based Responses**
The AI is pre-configured with:
- Platform mission & objectives
- ADHD hub features
- Autism hub features
- Evidence sources (NICE, CDC, NHS)

### **6. Responsive Design**
- 📱 Mobile-friendly dialog
- 💻 Desktop optimized
- ♿ Fully accessible (ARIA labels)
- 🌙 Dark mode support

---

## 🔌 **API Integration**

### **File:** `/app/api/api-ai-chat-buddy/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { systemPrompt, messages } = await request.json();
  
  // Uses AbacusAI GPT-4.1-mini model
  const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: fullMessages,
      stream: false,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });
  
  return NextResponse.json({ content });
}
```

**✅ Configured with:**
- AbacusAI GPT-4.1-mini model
- 500 token responses (concise & helpful)
- Temperature 0.7 (balanced creativity)

---

## 🚀 **How It Works**

### **User Flow:**

1. **User lands on any page** → PageBuddy loads with page-specific config
2. **User clicks chat bubble** → Dialog opens with welcome message
3. **User asks question** → Sent to API with page context
4. **AI responds** → Context-aware answer based on:
   - Current page
   - Platform features
   - Evidence-based guidelines
   - User's selected audience (if applicable)

### **Example:**

**On `/autism` page:**
```
User: "What calming tools are available?"
AI: "Great question! The Autism Hub offers several calming tools:

🧘 **Calm Toolkit**
- Box Breathing (4-4-4-4 pattern)
- Coherent Breathing (5-5 pattern)
- SOS 60-Second Calm (quick relief)
- Extended Exhale (activates relaxation)

Each exercise includes:
✓ Guided timers
✓ Safety warnings
✓ Mood tracking
✓ Favorites system

Try starting with Box Breathing - it's great for all ages! 
Scroll down to the 'Calm & Co-regulation Toolkit' section to begin."
```

---

## 🎯 **Smart Context System**

### **System Prompt Template:**

```typescript
const systemPrompt = `You are the NeuroBreath Buddy, a friendly AI guide for the NeuroBreath platform.

**Current Page:** ${config.pageName}
**Page Purpose:** ${config.sections.map(s => s.description).join(', ')}

**Platform Mission:**
${platformInfo.mission}

**Available on this page:**
${config.sections.map(s => `• ${s.name}: ${s.description}`).join('\n')}

**Quick tips for users:**
${config.sections.flatMap(s => s.tips).join('\n')}

**Target audiences:** ${config.audiences.join(', ')}

Be concise, helpful, and empowering. Use emojis sparingly for clarity.
Reference specific page sections when relevant.
Encourage users to explore the platform's evidence-based tools.`;
```

---

## 📊 **Page Detection Logic**

```typescript
export function getPageConfig(pathname: string): PageBuddyConfig {
  // 1. Direct match (e.g., /adhd)
  if (pageBuddyConfigs[pathname]) {
    return pageBuddyConfigs[pathname];
  }
  
  // 2. Partial match (e.g., /adhd/something matches /adhd)
  for (const key of Object.keys(pageBuddyConfigs)) {
    if (pathname.startsWith(key) && key !== '/') {
      return pageBuddyConfigs[key];
    }
  }
  
  // 3. Default to home page config
  return pageBuddyConfigs['/'];
}
```

**✅ This means:**
- `/adhd` → ADHD Hub config
- `/adhd/focus-garden` → ADHD Hub config (inherits)
- `/autism` → Autism Hub config
- `/autism/resources` → Autism Hub config (inherits)
- `/unknown-page` → Home config (safe fallback)

---

## 🎨 **UI Components**

### **Main Components:**
- 🎈 Floating bubble (bottom-right corner)
- 💬 Chat dialog (modal overlay)
- 📨 Message list (user + AI)
- ⌨️ Input form
- 🔘 Quick question buttons
- 🗺️ Tour system
- 🔊 Auto-speak toggle
- 📊 Page metadata footer

### **Styling:**
- Tailwind CSS classes
- Radix UI primitives (Dialog, ScrollArea)
- Framer Motion animations (optional)
- Responsive breakpoints
- Dark mode compatible

---

## 🔒 **Privacy & Data**

### **✅ Privacy-First Design:**
- No chat history stored on server
- Messages exist only in session memory
- No user tracking or analytics
- No cookies or local storage (for chat)
- All data processing happens server-side via API

### **🔐 Security:**
- API key stored in environment variables
- Server-side API calls only (no client exposure)
- Input sanitization
- Error handling with graceful fallbacks

---

## 🛠️ **Environment Setup**

### **Required Environment Variable:**

```bash
# .env.local
ABACUSAI_API_KEY=your_api_key_here
```

**✅ Already configured in your project**

---

## 📱 **User Experience Features**

### **1. Quick Questions**
Pre-configured buttons for common queries:
- "What is NeuroBreath?"
- "Take me to the ADHD Hub"
- "How do I request an EHCP?"
- "Show me calming techniques"

### **2. Section Navigation**
View and navigate to different page sections:
```typescript
sections: [
  {
    id: 'calm',
    name: 'Calm Toolkit',
    description: 'Breathing exercises and calming techniques',
    tips: [
      'Choose techniques based on your current state',
      'Use guided timers for structured sessions',
      'Track mood before and after'
    ]
  }
]
```

### **3. Page Tour**
Step-by-step guided tour:
- Highlights each section
- Provides context and tips
- Smooth scrolling
- Dismissible at any time

### **4. Accessibility**
- ♿ ARIA labels on all interactive elements
- ⌨️ Keyboard navigation support
- 🔊 Screen reader compatible
- 🎨 High contrast support
- 📏 Responsive text sizing

---

## 🎯 **Adding New Page Configs**

### **To add a new page:**

1. Open `/lib/page-buddy-configs.ts`
2. Add new config to `pageBuddyConfigs` object:

```typescript
'/your-new-page': {
  pageId: 'unique-id',
  pageName: 'Display Name',
  audiences: ['target', 'audiences'],
  welcomeMessage: `Your welcome message with **markdown** support`,
  quickQuestions: [
    'Question 1',
    'Question 2',
    'Question 3'
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Section Name',
      description: 'What this section does',
      tips: ['Tip 1', 'Tip 2']
    }
  ],
  keywords: ['relevant', 'keywords', 'for', 'ai']
}
```

3. Save file - **that's it!** PageBuddy auto-detects the new config.

---

## 🧪 **Testing**

### **To test PageBuddy:**

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Visit any page:**
   - http://localhost:3010/
   - http://localhost:3010/adhd
   - http://localhost:3010/autism

3. **Click chat bubble** (bottom-right corner)

4. **Try features:**
   - ✅ Ask questions in chat
   - ✅ Click quick question buttons
   - ✅ Toggle auto-speak
   - ✅ Start page tour
   - ✅ Navigate between pages (watch config change)

---

## 📈 **Current Status**

### **✅ COMPLETED:**
- [x] Site-wide integration in root layout
- [x] 11 page configurations
- [x] API route with AbacusAI
- [x] Dynamic context detection
- [x] Quick questions system
- [x] Page tour functionality
- [x] Auto-speak (TTS)
- [x] Responsive design
- [x] Dark mode support
- [x] Accessibility features
- [x] Error handling

### **🎯 READY FOR:**
- Adding more page configs as needed
- Customizing AI responses per page
- Adding more quick questions
- Expanding tour steps
- Analytics integration (if desired)

---

## 🎉 **Summary**

**PageBuddy is LIVE and WORKING on ALL pages!** 🚀

Every visitor to your NeuroBreath platform now has:
- 🤖 An intelligent AI guide
- 📍 Context-aware help for their current page
- 🎯 Quick access to common questions
- 🗺️ Guided tours of complex pages
- ♿ Accessible, inclusive design
- 🌙 Beautiful UI that matches your brand

**No additional setup required - it's already wired into your app!** ✨

---

## 📞 **Support**

If you need to:
- Add more pages
- Customize AI behavior
- Adjust UI styling
- Add new features

Just ask! The system is modular and easy to extend. 🎨

---

**Last Updated:** January 2, 2026  
**Status:** ✅ Production Ready  
**Integration:** ✅ Complete  
**API:** ✅ Configured  
**Pages Covered:** ✅ 11+ (with fallback for all others)

