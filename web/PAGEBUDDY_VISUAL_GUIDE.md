# 🎨 PageBuddy Visual Guide & Usage

## 🎯 **What You'll See**

### **1. Chat Bubble (Always Visible)**

```
┌─────────────────────────────────────┐
│                                     │
│   Your Page Content Here            │
│                                     │
│                                     │
│                              ┌────┐ │
│                              │ 🤖 │ │ ← Click to open!
│                              └────┘ │
└─────────────────────────────────────┘
```

**Location:** Bottom-right corner of every page  
**Action:** Click to open the chat dialog

---

### **2. Chat Dialog (Opened)**

```
┌───────────────────────────────────────────────┐
│  🤖 NeuroBreath Buddy    🔊 🗺️           ✕   │
│  Page Name                                     │
├───────────────────────────────────────────────┤
│                                                │
│  💬 Welcome Message:                          │
│  "Welcome to the ADHD Hub! 👋                 │
│   I'm here to help you navigate..."           │
│                                                │
│  👤 User: What tools are available?           │
│                                                │
│  🤖 Assistant: Great question! Here are...    │
│                                                │
├───────────────────────────────────────────────┤
│  Quick questions:                              │
│  [Button 1] [Button 2] [Button 3] [Button 4] │
├───────────────────────────────────────────────┤
│  [Type your question...]          [Send →]    │
├───────────────────────────────────────────────┤
│  📍 ADHD Hub • 6 sections • For all audiences │
└───────────────────────────────────────────────┘
```

---

## 🎮 **Interactive Features**

### **Header Buttons:**

#### 🔊 **Auto-Speak Toggle**
- **Off (default):** Volume X icon
- **On:** Volume icon with waves
- **Function:** Reads AI responses aloud using text-to-speech
- **Use case:** Accessibility for visually impaired users or multitasking

#### 🗺️ **Page Tour**
- **Icon:** Map icon
- **Function:** Launches guided tour of the current page
- **What it does:**
  - Highlights each section
  - Shows tips and descriptions
  - Smooth scrolling to sections
  - Step counter (e.g., "Step 2 of 6")

#### ✕ **Close Dialog**
- Closes the chat window
- Returns to floating bubble
- Chat history preserved in session

---

### **Quick Questions:**

Pre-configured buttons that appear based on the current page:

**Example on `/adhd` page:**
```
┌─────────────────────────────────────────┐
│ [How do I start a focus session?]      │
│ [What are Daily Quests?]               │
│ [Show me ADHD coping strategies]       │
│ [How does progress tracking work?]     │
└─────────────────────────────────────────┘
```

**Example on `/autism` page:**
```
┌─────────────────────────────────────────┐
│ [What calming tools are available?]    │
│ [How do I request an EHCP or IEP?]     │
│ [Show me workplace adjustments]        │
│ [Where can I find printable resources?]│
└─────────────────────────────────────────┘
```

---

## 📱 **Responsive Design**

### **Desktop (1024px+)**
```
┌─────────────────────────────────────────┐
│                                    🤖   │  Full width dialog
│  ┌─────────────────────────────┐       │  Max 500px wide
│  │     PageBuddy Dialog         │       │  Centered
│  │                              │       │
│  │  [Content]                   │       │
│  │                              │       │
│  └─────────────────────────────┘       │
│                                         │
└─────────────────────────────────────────┘
```

### **Mobile (< 768px)**
```
┌─────────────────┐
│        🤖       │  Full screen
│ ┌─────────────┐ │  85vh height
│ │ PageBuddy   │ │  
│ │             │ │
│ │  [Content]  │ │
│ │             │ │
│ │             │ │
│ └─────────────┘ │
└─────────────────┘
```

---

## 🎬 **Page Tour Example**

### **Tour Step Display:**

```
┌─────────────────────────────────────────────┐
│  🗺️ Page Tour - Step 2 of 6                │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  📍 Focus Pomodoro Timer                │ │
│  │                                         │ │
│  │  ADHD-friendly timer with flexible     │ │
│  │  durations (5-50 min) and dopamine-    │ │
│  │  boosting break tips                    │ │
│  │                                         │ │
│  │  💡 Tips:                               │ │
│  │  • Start with shorter sessions         │ │
│  │  • Use dopamine tips during breaks     │ │
│  │  • Track focus streaks                 │ │
│  │                                         │ │
│  │  [← Previous]  [Next →]  [Skip Tour]   │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ↓ (Scrolls to highlighted section)         │
└─────────────────────────────────────────────┘
```

---

## 🎯 **Page-Specific Content Examples**

### **Home Page (`/`)**

**Welcome Message:**
```
Welcome to NeuroBreath! 🧠✨

I'm your friendly guide to this neurodiversity support platform.

Our Mission: Empower neurodivergent people, parents, 
teachers, and carers with one trusted hub.

We offer:
• 🎯 ADHD Hub – Focus tools, gamified quests
• 🌟 Autism Hub – Calming techniques, education pathways
• 📊 Safe progress tracking
• 🏠 Home-school collaboration tools

Which hub would you like to explore?
```

**Quick Questions:**
- What is NeuroBreath?
- Take me to the ADHD Hub
- Take me to the Autism Hub
- What tools are available?
- How is this evidence-based?

---

### **ADHD Hub (`/adhd`)**

**Welcome Message:**
```
Hey there! 👋 Welcome to the ADHD Hub!

I'm your NeuroBreath Buddy – here to help you navigate 
evidence-based ADHD support tools.

What you'll find here:
• 🎯 Focus Timer with ADHD-friendly durations
• 🏆 Daily Quests to build habits & earn XP
• 📚 Skills Library with practical strategies
• 🔬 Evidence-backed myths vs facts

Whether you're neurodivergent yourself, a parent, teacher, 
or carer – this hub is designed for you. 

What would you like to explore?
```

**Quick Questions:**
- How do I start a focus session?
- What are Daily Quests?
- Show me ADHD coping strategies
- How does progress tracking work?
- What resources can I print?

**Sections (for Tour):**
1. ADHD Hub Overview
2. Focus Pomodoro Timer
3. Daily Quests
4. Skills Library
5. Myths vs Facts
6. Treatment Decision Tree

---

### **Autism Hub (`/autism`)**

**Welcome Message:**
```
Hello! 🌟 Welcome to the Autism Hub!

I'm your NeuroBreath Buddy – here to guide you through 
comprehensive autism support tools.

What you'll find here:
• 🧘 Calm Toolkit with breathing exercises
• 📚 Skills Library with evidence-based strategies
• 🎓 Education Pathways (EHCP/IEP/504 guides)
• 💼 Workplace Adjustments Generator
• 🔬 PubMed Research Search
• 📄 Printable Templates & Resources

Whether you're autistic, a parent, teacher, carer, or 
employer – everything is designed with your needs in mind. 

How can I help you today?
```

**Quick Questions:**
- What calming tools are available?
- How do I request an EHCP or IEP?
- Show me workplace adjustments
- Where can I find printable resources?
- How do I search research articles?

**Sections (for Tour):**
1. Progress Dashboard
2. Skills Library
3. Calm Toolkit
4. Daily Quests
5. Education Pathways
6. Resources Library
7. PubMed Research
8. Crisis Support

---

## 🎨 **Visual States**

### **Loading State:**
```
┌───────────────────────────────┐
│  🤖 NeuroBreath Buddy         │
├───────────────────────────────┤
│                               │
│  👤 User: What tools exist?   │
│                               │
│  🤖 Assistant: ●●● (typing)   │
│                               │
└───────────────────────────────┘
```

### **Empty State:**
```
┌───────────────────────────────┐
│  🤖 NeuroBreath Buddy         │
├───────────────────────────────┤
│                               │
│  💬 Welcome to ADHD Hub!      │
│     Ask me anything...        │
│                               │
└───────────────────────────────┘
```

### **Error State:**
```
┌───────────────────────────────┐
│  🤖 NeuroBreath Buddy         │
├───────────────────────────────┤
│                               │
│  ⚠️ Oops! I couldn't respond. │
│     Please try again.         │
│                               │
└───────────────────────────────┘
```

---

## 🎤 **Auto-Speak Feature**

### **How It Works:**

1. **User sends message**
2. **AI responds with text**
3. **If auto-speak is ON:**
   - Browser's Web Speech API activates
   - AI response is read aloud
   - Listen icon appears on message
4. **If auto-speak is OFF:**
   - User can click 🔊 button on individual messages

### **Visual Indicator:**

```
┌─────────────────────────────────────┐
│  🤖 Assistant:                      │
│  Here are some ADHD focus tools... │
│                                     │
│  [🔊 Listen]  ← Click to hear      │
└─────────────────────────────────────┘
```

---

## 📊 **Footer Metadata**

Shows current page context:

```
┌──────────────────────────────────────────┐
│  📍 ADHD Hub • 6 sections • For all...  │
└──────────────────────────────────────────┘
```

**Components:**
- 🏠 Page badge (Home/ADHD Hub/Autism Hub)
- 📊 Number of sections
- 👥 Target audiences

---

## 🔄 **Dynamic Page Switching**

### **What Happens When You Navigate:**

```
User on /adhd page:
  PageBuddy shows: ADHD Hub config
  Welcome: "Hey there! 👋 Welcome to the ADHD Hub!"
  Questions: ADHD-specific

        ↓ User clicks link to /autism

User now on /autism page:
  PageBuddy updates: Autism Hub config
  Welcome: "Hello! 🌟 Welcome to the Autism Hub!"
  Questions: Autism-specific
  Chat history: CLEARED (new page context)
```

**✨ Seamless transition - no page reload needed!**

---

## 💡 **Pro Tips**

### **For Users:**
1. 🎯 **Use Quick Questions** for fast access to common info
2. 🗺️ **Start Page Tour** when visiting a new section
3. 🔊 **Enable Auto-Speak** if you prefer audio guidance
4. 💬 **Ask specific questions** for detailed help
5. 📍 **Check footer** to see what page you're on

### **For Developers:**
1. 📝 **Add more Quick Questions** in configs for better UX
2. 🎨 **Customize welcome messages** per page
3. 🗺️ **Expand tour steps** for complex pages
4. 🎯 **Add more keywords** for better AI context
5. 📊 **Monitor common questions** to improve configs

---

## 🚀 **Testing Checklist**

- [ ] Click chat bubble on home page
- [ ] Send a message and verify AI response
- [ ] Click a quick question button
- [ ] Toggle auto-speak on/off
- [ ] Start page tour
- [ ] Navigate through tour steps
- [ ] Close dialog and reopen
- [ ] Navigate to different page (/adhd → /autism)
- [ ] Verify config changes
- [ ] Test on mobile device
- [ ] Test with screen reader
- [ ] Test dark mode

---

## 🎉 **That's It!**

PageBuddy is a **fully functional, context-aware AI assistant** that:
- ✅ Appears on ALL pages
- ✅ Adapts to current page content
- ✅ Provides intelligent, helpful responses
- ✅ Guides users through complex features
- ✅ Supports accessibility needs
- ✅ Works beautifully on all devices

**Enjoy your new AI-powered user experience!** 🚀✨

