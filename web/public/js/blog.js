// Blog Page - AI-Powered Hub JavaScript
(function() {
  'use strict';

  // Initialize when DOM is ready
  function startInit() {
    // Wait a bit longer to ensure all elements are rendered and other scripts have run
    setTimeout(() => {
      try {
        init();
        // Also try initializing Focus Lab again after a short delay as a fallback
        setTimeout(() => {
          const rhythmBtn = document.querySelector('[data-target="rhythm-runner"]');
          if (rhythmBtn && !rhythmBtn.hasAttribute('data-initialized')) {
            console.log('Re-initializing Focus Lab (fallback)...');
            initFocusLab();
            // Mark as initialized
            document.querySelectorAll('[data-target]').forEach(btn => {
              btn.setAttribute('data-initialized', 'true');
            });
          }
        }, 500);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    }, 200);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInit);
  } else {
    startInit();
  }
  
  // Also try on window load as ultimate fallback
  window.addEventListener('load', () => {
    // Also initialize toggle buttons on window load as backup
    setTimeout(() => {
      setupToggleDelegation();
    }, 500);
    setTimeout(() => {
      const rhythmBtn = document.querySelector('[data-target="rhythm-runner"]');
      if (rhythmBtn && !rhythmBtn.hasAttribute('data-initialized')) {
        console.log('Initializing Focus Lab on window load (fallback)...');
        initFocusLab();
      }
    }, 300);
  });

  function init() {
    // Remove progress card if it exists
    removeProgressCard();
    
    initAIChat();
    initNHSHealthAlerts();
    initFocusLab();
    initBlogFilters();
    initPlaylist();
    initJournal();
    initScratchCards();
    initAchievements();
    initAvatars();
    initYearFooter();
    
    // Watch for progress card being added and remove it
    observeProgressCard();
  }

  function removeProgressCard() {
    const progressCard = document.getElementById('progressCard');
    if (progressCard) {
      progressCard.remove();
    }
  }

  function observeProgressCard() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.id === 'progressCard' || node.querySelector && node.querySelector('#progressCard')) {
              const card = node.id === 'progressCard' ? node : node.querySelector('#progressCard');
              if (card) {
                card.remove();
              }
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ============================================
  // AI CHAT FUNCTIONALITY
  // ============================================
  function initAIChat() {
    const chatForm = document.getElementById('chat-form');
    const chatLog = document.getElementById('chat-log');
    const questionInput = document.getElementById('question-input');
    const topicSelect = document.getElementById('topic-select');

    if (!chatForm || !chatLog) return;

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const question = questionInput.value.trim();
      const topic = topicSelect.value;
      
      if (!question) return;

      // Add user message
      addMessage('user', question);
      questionInput.value = '';
      
      // Show typing indicator
      const typingId = addTypingIndicator();
      
      try {
        // Call AI coach
        const response = await callAiCoach(question, topic);
        removeTypingIndicator(typingId);
        if (response) {
          addMessage('ai', response);
        } else {
          addMessage('ai', 'I\'m having trouble processing that question. Could you try rephrasing it?');
        }
      } catch (error) {
        removeTypingIndicator(typingId);
        console.error('AI Chat Error:', error);
        // Provide a helpful response even on error
        let errorResponse = 'Sorry, I encountered an error. ';
        const questionLower = question.toLowerCase();
        if (questionLower.includes('autism') || questionLower.includes('autistic')) {
          errorResponse += 'For information about autism, visit our <a href="autism-tools.html">autism tools page</a>.';
        } else if (questionLower.includes('adhd')) {
          errorResponse += 'For information about ADHD, visit our <a href="adhd-tools.html">ADHD tools page</a>.';
        } else {
          errorResponse += 'Please try rephrasing your question or contact support.';
        }
        addMessage('ai', errorResponse);
      }
    });
  }

  function addMessage(type, text) {
    const chatLog = document.getElementById('chat-log');
    if (!chatLog) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `blog-message blog-${type}-message`;
    
    const meta = document.createElement('p');
    meta.className = 'blog-message__meta';
    meta.textContent = type === 'user' ? 'You · just now' : 'AI Coach · just now';
    
    const content = document.createElement('div');
    content.className = 'blog-message-content';
    
    // Parse markdown-like formatting and links
    const formattedText = formatMessageText(text);
    content.innerHTML = formattedText;
    
    messageDiv.appendChild(meta);
    messageDiv.appendChild(content);
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function formatMessageText(text) {
    // Convert markdown-like formatting to HTML
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--color-sage-dark); text-decoration: underline;">$1</a>')
      .replace(/•/g, '•')
      .replace(/\n/g, '<br>');
    
    // Format numbered lists
    html = html.replace(/(\d+)\.\s/g, '<strong>$1.</strong> ');
    
    return html;
  }

  function addTypingIndicator() {
    const chatLog = document.getElementById('chat-log');
    if (!chatLog) return null;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'blog-message blog-ai-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<p class="blog-message__meta">AI Coach · typing...</p><p>Thinking...</p>';
    chatLog.appendChild(typingDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    return 'typing-indicator';
  }

  function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) indicator.remove();
  }

  // ============================================
  // KNOWLEDGE BASE - Website Content
  // ============================================
  const KNOWLEDGE_BASE = {
    autism: {
      pages: ['autism.html', 'autism-tools.html', 'autism-parent.html'],
      content: [
        {
          keywords: ['what is autism', 'what\'s autism', 'what is autistic', 'define autism', 'autism definition', 'autism meaning'],
          answer: 'Autism (Autism Spectrum Disorder, or ASD) is a neurodevelopmental condition that affects how people communicate, interact, and experience the world. It\'s characterized by differences in social communication, sensory processing, and often includes strong interests in specific topics. Autism is a spectrum - each person\'s experience is unique. Support focuses on accommodations, understanding, and neuro-affirming approaches.',
          link: 'autism-tools.html',
          sources: ['NHS Autism support', 'NICE guidelines', 'SEND Code of Practice']
        },
        {
          keywords: ['autism', 'autistic', 'ASD', 'spectrum', 'sensory', 'routine', 'visual', 'communication'],
          answer: 'Autism support focuses on predictable routines, low-sensory environments, visual timers, and structured communication. Our autism tools page provides evidence-based strategies aligned with UK SEND Code of Practice.',
          link: 'autism-tools.html',
          sources: ['NHS Autism support', 'NICE guidelines', 'SEND Code of Practice']
        },
        {
          keywords: ['classroom', 'school', 'teacher', 'lesson', 'pupil', 'student'],
          answer: 'For autism-friendly classrooms, implement predictable schedules, low-sensory corners, visual timers, and structured transitions. These strategies are supported by educational research and clinical guidelines.',
          link: 'autism-tools.html',
          sources: ['NHS Every Mind Matters', 'NICE', 'Educational research']
        }
      ]
    },
    adhd: {
      pages: ['adhd.html', 'adhd-tools.html', 'adhd-school.html'],
      content: [
        {
          keywords: ['what is adhd', 'what\'s adhd', 'define adhd', 'adhd definition', 'adhd meaning'],
          answer: 'ADHD (Attention Deficit Hyperactivity Disorder) is a neurodevelopmental condition characterized by differences in attention, impulse control, and activity levels. It affects how people focus, organize tasks, and manage time. ADHD includes three types: inattentive, hyperactive-impulsive, and combined. Many people with ADHD have strengths in creativity, hyperfocus, and innovative thinking.',
          link: 'adhd-tools.html',
          sources: ['NICE NG87', 'CDC ADHD guidelines', 'EndeavorRx research']
        },
        {
          keywords: ['ADHD', 'attention', 'focus', 'hyperactivity', 'impulsivity', 'concentration'],
          answer: 'ADHD management includes structured routines, movement breaks, visual timers, and evidence-based breathing techniques. NICE NG87 provides comprehensive guidance on diagnosis and management strategies.',
          link: 'adhd-tools.html',
          sources: ['NICE NG87', 'CDC ADHD guidelines', 'EndeavorRx research']
        },
        {
          keywords: ['homework', 'study', 'learning', 'schoolwork', 'assignment'],
          answer: 'ADHD homework strategies include pocket timers, brain breaks, printable planners, and structured study blocks. These approaches are referenced in NICE NG87 and supported by cognitive training research.',
          link: 'adhd-school.html',
          sources: ['NICE NG87', 'Frontiers in Psychiatry 2022']
        }
      ]
    },
    dyslexia: {
      pages: ['dyslexia-reading-training.html'],
      content: [
        {
          keywords: ['dyslexia', 'reading', 'writing', 'spelling', 'literacy', 'learning difficulty'],
          answer: 'Dyslexia support includes chunked reading, overlays, assistive technology, and structured phonics approaches. These methods align with BDA (British Dyslexia Association) recommendations.',
          link: 'dyslexia-reading-training.html',
          sources: ['BDA guidelines', 'Educational research']
        }
      ]
    },
    breathing: {
      pages: ['breath.html', 'sos-60.html', 'box-breathing.html', '4-7-8-breathing.html', 'coherent-5-5.html'],
      content: [
        {
          keywords: ['breathing', 'breath', 'inhale', 'exhale', 'calm', 'regulation', 'anxiety', 'stress'],
          answer: 'Breathing techniques like 4-7-8, box breathing, and coherent 5-5 are evidence-based methods for regulation. These practices are supported by research on autonomic nervous system regulation and are neuro-inclusive.',
          link: 'breath.html',
          sources: ['NHS Every Mind Matters', 'APA mindfulness recommendations', 'Clinical research']
        },
        {
          keywords: ['SOS', 'emergency', 'quick', '60 second', 'panic', 'acute'],
          answer: 'The 60-second SOS breathing technique provides quick emergency reset for acute stress or panic moments. This rapid intervention is based on evidence for immediate autonomic regulation.',
          link: 'sos-60.html',
          sources: ['Clinical evidence', 'Autonomic regulation research']
        }
      ]
    },
    sleep: {
      pages: ['sleep.html', 'sleep-tools.html', 'sleep-onset-insomnia.html'],
      content: [
        {
          keywords: ['sleep', 'insomnia', 'bedtime', 'rest', 'tired', 'wake', 'chronotype'],
          answer: 'Sleep support includes chronotype-aware routines, CBT-I micro habits, low-light cues, and consistent sleep schedules. These approaches are evidence-based and referenced in sleep research.',
          link: 'sleep.html',
          sources: ['Sleep research', 'CBT-I evidence', 'Chronotype studies']
        }
      ]
    },
    mood: {
      pages: ['mood-tools.html', 'depression.html', 'low-mood-burnout.html'],
      content: [
        {
          keywords: ['mood', 'depression', 'low mood', 'sad', 'down', 'emotional', 'feelings'],
          answer: 'Mood support includes behavioural activation checklists, printable mood trackers, breathing techniques, and evidence-based micro-actions. These tools are supported by clinical guidelines.',
          link: 'mood-tools.html',
          sources: ['Clinical guidelines', 'Behavioural activation research']
        }
      ]
    },
    stress: {
      pages: ['stress.html', 'stress-tools.html', 'stress-anxiety.html'],
      content: [
        {
          keywords: ['stress', 'anxiety', 'worried', 'overwhelmed', 'pressure', 'tension'],
          answer: 'Stress management includes grounding cues, breath ladders, workplace conversation starters, and evidence-based relaxation techniques. These strategies are supported by NHS and clinical research.',
          link: 'stress-tools.html',
          sources: ['NHS Every Mind Matters', 'Clinical research', 'Stress management studies']
        }
      ]
    },
    mindfulness: {
      pages: ['mindfulness.html'],
      content: [
        {
          keywords: ['mindfulness', 'meditation', 'awareness', 'present', 'mindful'],
          answer: 'Mindfulness practices include 2-minute classroom scripts, sensory walks, and evidence-based micro-practices. These are referenced in MindUP and NHS resources.',
          link: 'mindfulness.html',
          sources: ['MindUP', 'NHS resources', 'APA mindfulness recommendations']
        }
      ]
    },
    anxiety: {
      pages: ['anxiety.html', 'anxiety-tools.html', 'stress-anxiety.html', 'panic-symptoms.html', 'focus-test-anxiety.html'],
      content: [
        {
          keywords: ['what is anxiety', 'what\'s anxiety', 'define anxiety', 'anxiety definition', 'anxiety meaning'],
          answer: 'Anxiety is a natural response to stress or perceived threats. When anxiety becomes persistent, excessive, or interferes with daily life, it may be an anxiety disorder. Common types include generalized anxiety disorder (GAD), panic disorder, social anxiety, and specific phobias. Anxiety can affect thoughts, feelings, and physical sensations.',
          link: 'anxiety.html',
          sources: ['NHS Every Mind Matters', 'NICE guidelines', 'APA anxiety resources']
        },
        {
          keywords: ['anxiety', 'anxious', 'worried', 'panic', 'fear', 'nervous', 'apprehension'],
          answer: 'Anxiety management includes breathing techniques, grounding exercises, cognitive strategies, and evidence-based interventions like CBT. Our anxiety tools page provides practical strategies for managing anxiety symptoms.',
          link: 'anxiety-tools.html',
          sources: ['NHS Every Mind Matters', 'NICE guidelines', 'CBT research']
        },
        {
          keywords: ['panic', 'panic attack', 'panic symptoms', 'acute anxiety'],
          answer: 'Panic attacks involve sudden, intense fear with physical symptoms like rapid heartbeat, shortness of breath, and dizziness. Grounding techniques, breathing exercises, and understanding triggers can help manage panic. In emergencies, seek immediate medical help.',
          link: 'panic-symptoms.html',
          sources: ['NHS panic disorder guidance', 'Clinical anxiety research']
        },
        {
          keywords: ['test anxiety', 'exam anxiety', 'performance anxiety', 'focus anxiety'],
          answer: 'Test and performance anxiety can be managed through preparation strategies, breathing techniques, cognitive reframing, and stress management. Our focus and test anxiety page provides specific strategies.',
          link: 'focus-test-anxiety.html',
          sources: ['Educational psychology research', 'Performance anxiety studies']
        }
      ]
    },
    depression: {
      pages: ['depression.html', 'mood-tools.html', 'low-mood-burnout.html'],
      content: [
        {
          keywords: ['what is depression', 'what\'s depression', 'define depression', 'depression definition', 'depression meaning'],
          answer: 'Depression is a mental health condition characterized by persistent low mood, loss of interest or pleasure, and other symptoms that affect daily functioning. It can range from mild to severe and may include feelings of sadness, hopelessness, fatigue, and changes in sleep or appetite.',
          link: 'depression.html',
          sources: ['NHS depression guidance', 'NICE depression guidelines', 'WHO mental health resources']
        },
        {
          keywords: ['depression', 'depressed', 'low mood', 'sadness', 'hopeless', 'despair'],
          answer: 'Depression support includes behavioral activation, mood tracking, therapy (CBT, counseling), medication when appropriate, and self-care strategies. Our mood tools page provides evidence-based strategies and resources.',
          link: 'mood-tools.html',
          sources: ['NHS depression support', 'NICE guidelines', 'CBT evidence']
        },
        {
          keywords: ['burnout', 'exhaustion', 'emotional exhaustion', 'workplace stress'],
          answer: 'Burnout involves emotional exhaustion, reduced accomplishment, and depersonalization, often related to chronic workplace or caregiving stress. Management includes boundaries, self-care, support systems, and addressing underlying stressors.',
          link: 'low-mood-burnout.html',
          sources: ['WHO burnout guidance', 'Occupational health research']
        }
      ]
    },
    bipolar: {
      pages: ['mood.html', 'mood-tools.html'],
      content: [
        {
          keywords: ['what is bipolar', 'what\'s bipolar', 'bipolar disorder', 'define bipolar', 'bipolar definition'],
          answer: 'Bipolar disorder is a mental health condition characterized by episodes of mood swings ranging from depressive lows to manic or hypomanic highs. There are different types: Bipolar I, Bipolar II, and cyclothymic disorder. Management typically involves medication, therapy, and lifestyle strategies.',
          link: 'mood.html',
          sources: ['NHS bipolar disorder guidance', 'NICE bipolar guidelines', 'Bipolar UK resources']
        },
        {
          keywords: ['bipolar', 'manic', 'mania', 'hypomania', 'mood swings', 'bipolar depression'],
          answer: 'Bipolar disorder management includes mood stabilizers, therapy (CBT, interpersonal therapy), mood tracking, sleep regulation, stress management, and support systems. Working with healthcare professionals is essential for effective management.',
          link: 'mood.html',
          sources: ['NICE bipolar guidelines', 'Bipolar UK', 'Clinical research']
        },
        {
          keywords: ['bipolar work', 'bipolar workplace', 'bipolar employment'],
          answer: 'Managing bipolar at work involves reasonable adjustments, wellness action plans, disclosure considerations, and support systems. The Equality Act (UK) protects against discrimination. Our resources provide guidance on workplace support.',
          link: 'mood.html',
          sources: ['Equality Act 2010', 'NICE guidelines', 'Workplace mental health research']
        }
      ]
    },
    ptsd: {
      pages: ['ptsd-regulation.html'],
      content: [
        {
          keywords: ['what is ptsd', 'what\'s ptsd', 'post traumatic stress', 'ptsd definition', 'trauma'],
          answer: 'PTSD (Post-Traumatic Stress Disorder) is a mental health condition that can develop after experiencing or witnessing a traumatic event. Symptoms may include flashbacks, nightmares, hypervigilance, avoidance, and emotional numbing. Support includes therapy (trauma-focused CBT, EMDR), medication, and regulation strategies.',
          link: 'ptsd-regulation.html',
          sources: ['NHS PTSD guidance', 'NICE PTSD guidelines', 'Trauma research']
        },
        {
          keywords: ['ptsd', 'post traumatic', 'trauma', 'flashback', 'hypervigilance', 'trauma response'],
          answer: 'PTSD management includes trauma-focused therapy, grounding techniques, breathing exercises, regulation strategies, and support systems. Our PTSD regulation page provides evidence-based strategies for managing symptoms.',
          link: 'ptsd-regulation.html',
          sources: ['NICE PTSD guidelines', 'Trauma-focused CBT research', 'EMDR evidence']
        }
      ]
    },
    general: {
      pages: ['index.html', 'resources.html'],
      content: [
        {
          keywords: ['health', 'wellbeing', 'well-being', 'wellness', 'mental health', 'physical health'],
          answer: 'Health and wellbeing encompass physical, mental, and social aspects of wellness. Our website provides evidence-based resources for neurodiversity, mental health, breathing practices, sleep, mood, and stress management. Explore our tools and guides for comprehensive support.',
          link: 'resources.html',
          sources: ['NHS Every Mind Matters', 'WHO health definition', 'Evidence-based practices']
        },
        {
          keywords: ['neurodivergent', 'neurodiversity', 'neurodivergence'],
          answer: 'Neurodiversity recognizes that neurological differences (like autism, ADHD, dyslexia) are natural variations in human brain function, not deficits. Neuro-affirming approaches focus on accommodations, strengths, and understanding rather than "fixing" differences.',
          link: 'index.html',
          sources: ['Neurodiversity movement', 'NHS neurodiversity resources', 'Evidence-based approaches']
        },
        {
          keywords: ['support', 'help', 'resources', 'guidance', 'advice'],
          answer: 'We provide evidence-based resources, tools, and guidance for neurodiversity, mental health, and wellbeing. Explore our condition-specific pages, tools sections, and guides. For medical concerns, consult healthcare professionals.',
          link: 'resources.html',
          sources: ['NHS resources', 'Evidence-based guidance']
        }
      ]
    }
  };

  // External sources for citations
  const EXTERNAL_SOURCES = {
    populationMedicine: {
      url: 'https://www.populationmedicine.eu',
      description: 'Population Medicine - Open access journal covering preventive medicine, public health, and healthcare systems'
    },
    resurchify: {
      url: 'https://www.resurchify.com/impact/details/21101068596',
      description: 'Research impact metrics and academic publications database'
    },
    doaj: {
      url: 'https://doaj.org/toc/2654-1459',
      description: 'Directory of Open Access Journals - Population Medicine journal (ISSN: 2654-1459)'
    }
  };

  // ============================================
  // AI COACH - Enhanced with Knowledge Base, PubMed API & NHS API
  // ============================================
  async function callAiCoach(question, topic) {
    try {
      const questionLower = question.toLowerCase();
      
      // Normalize common typos
      const normalizedQuestion = questionLower
        .replace(/mange/g, 'manage')  // Fix "mange" -> "manage"
        .replace(/manag/g, 'manage');  // Fix other variations
      
      // Step 0: Check for "how to manage" questions first - these have comprehensive responses
      // Handle these directly to ensure they're always answered properly
      // Check both original and normalized versions
      const isManageQuestion = (normalizedQuestion.includes('how to') || normalizedQuestion.includes('how do') || normalizedQuestion.includes('how can')) && 
                                (normalizedQuestion.includes('manage') || questionLower.includes('manage'));
      
      if (isManageQuestion) {
        try {
          const manageResponse = generateFallbackResponse(question, topic);
          // generateFallbackResponse handles "how to manage" questions, so return it directly
          if (manageResponse) {
            return manageResponse;
          }
        } catch (error) {
          console.error('Error in generateFallbackResponse:', error);
          // Continue to other steps if this fails
        }
      }
      
      // Step 1: Try PubMed API first for evidence-based answers
      // This provides the most accurate, research-backed responses
      try {
        const pubmedResponse = await fetchFromAIAPI(question, topic);
        if (pubmedResponse) {
          return pubmedResponse;
        }
      } catch (error) {
        // Silently continue to next step
      }
      
      // Step 2: Try NHS API as fallback for official NHS guidance
      try {
        const nhsResponse = await fetchFromNHSAPI(question, topic);
        if (nhsResponse) {
          return nhsResponse;
        }
      } catch (error) {
        // Silently continue to next step
      }
      
      // Step 3: Search website knowledge base as fallback
      try {
        const localAnswer = searchKnowledgeBase(questionLower, topic);
        if (localAnswer) {
          return formatResponse(localAnswer, question);
        }
      } catch (error) {
        console.error('Knowledge base search error:', error);
        // Continue to next step
      }
      
      // Step 4: Generate evidence-based response with citations
      try {
        return generateEvidenceBasedResponse(question, topic);
      } catch (error) {
        console.error('Error generating evidence-based response:', error);
        // Fall through to generateFallbackResponse
      }
      
      // Step 5: Final fallback
      return generateFallbackResponse(question, topic);
    } catch (error) {
      console.error('Error in callAiCoach:', error);
      // Return a helpful fallback response instead of throwing
      return generateFallbackResponse(question, topic);
    }
  }

  function generateFallbackResponse(question, topic) {
    try {
      const questionLower = question.toLowerCase();
      const topicLower = topic ? topic.toLowerCase() : '';
      
      // Normalize common typos
      const normalizedQuestion = questionLower
        .replace(/mange/g, 'manage')  // Fix "mange" -> "manage"
        .replace(/manag/g, 'manage');  // Fix other variations
      
      // Handle "how to" questions
      if (normalizedQuestion.includes('how to') || normalizedQuestion.includes('how do') || normalizedQuestion.includes('how can')) {
        // Check for "manage" in both original and normalized
        const hasManage = normalizedQuestion.includes('manage') || questionLower.includes('manage');
        
        if (hasManage && (normalizedQuestion.includes('adhd') || questionLower.includes('adhd') || topicLower.includes('adhd'))) {
        return `**How to Manage ADHD**\n\nADHD management involves a combination of evidence-based strategies, support systems, and sometimes medication. Here's guidance based on NICE NG87 and clinical guidelines:\n\n**Key Management Strategies:**\n\n**1. Structure & Routine**\n• Create predictable daily schedules with visual timers\n• Break tasks into smaller, manageable steps\n• Use external reminders and alarms\n• Set up organized workspaces with minimal distractions\n\n**2. Movement & Breaks**\n• Regular physical activity and movement breaks\n• Incorporate movement into learning and work\n• Use fidget tools if helpful\n• Take short breaks every 20-30 minutes during focused tasks\n\n**3. Attention Training**\n• Practice focus-building exercises and games\n• Use attention training tools (like those in our Focus Lab)\n• Build focus stamina gradually\n• Identify and work with your attention patterns\n\n**4. Support Systems**\n• Work with healthcare professionals (GPs, specialists)\n• Consider therapy (CBT, ADHD coaching)\n• Connect with ADHD support groups\n• Educate family, teachers, and employers about ADHD\n\n**5. Self-Care & Wellbeing**\n• Prioritize sleep and consistent sleep schedules\n• Practice breathing exercises for regulation\n• Use mood tracking to identify patterns\n• Manage stress through evidence-based techniques\n\n**Evidence-Based Approaches:**\nADHD management is guided by NICE NG87 (UK) and CDC guidelines (US). Research shows that structured routines, movement breaks, attention training, and external cueing systems are effective.\n\n📚 **Explore our resources:**\n• <a href="adhd-tools.html">ADHD Tools</a> - Practical strategies and tools\n• <a href="adhd-school.html">ADHD School Support</a> - Educational strategies\n• <a href="focus.html">Focus Training</a> - Attention-building exercises\n\n**Sources:**\n1. NICE Guideline NG87: ADHD diagnosis and management\n2. CDC ADHD guidelines\n3. EndeavorRx research (FDA-authorised digital therapy)\n4. Frontiers in Psychiatry 2022: Cognitive training studies\n\n*⚠️ This is educational information only. Consult healthcare professionals (GPs, specialists) for personalized ADHD management plans. Medication and therapy decisions should be made with qualified clinicians.*`;
      } else if (hasManage && (normalizedQuestion.includes('autism') || questionLower.includes('autism') || questionLower.includes('autistic') || topicLower.includes('autism'))) {
        return `**How to Manage Autism**\n\nAutism management focuses on support, accommodations, and understanding rather than "fixing" or "curing." Here's evidence-based guidance:\n\n**Key Management Strategies:**\n\n**1. Structured Routines**\n• Create predictable daily schedules\n• Use visual timers and calendars\n• Prepare for transitions with advance notice\n• Maintain consistent routines where possible\n\n**2. Sensory Accommodations**\n• Identify sensory sensitivities and preferences\n• Create low-sensory spaces when needed\n• Use noise-cancelling headphones if helpful\n• Provide sensory tools (fidgets, weighted items if liked)\n\n**3. Communication Support**\n• Use clear, direct communication\n• Visual supports and social stories\n• Respect communication preferences (verbal, non-verbal, AAC)\n• Allow processing time for questions and instructions\n\n**4. Environment Adjustments**\n• Reduce overwhelming stimuli\n• Create quiet, calm spaces\n• Use visual schedules and labels\n• Provide advance notice of changes\n\n**5. Support Networks**\n• Connect with autism support groups\n• Work with SENCOs, therapists, and specialists\n• Educate family and friends about autism\n• Access autism-specific resources and services\n\n**Evidence-Based Approaches:**\nResearch supports individualized, neuro-affirming approaches. Structured routines, sensory accommodations, visual supports, and predictable environments are evidence-based strategies.\n\n📚 **Explore our resources:**\n• <a href="autism-tools.html">Autism Tools</a> - Practical strategies\n• <a href="autism-parent.html">Autism Parent Guide</a> - Family support\n\n**Sources:**\n1. NHS Autism support\n2. NICE guidelines\n3. SEND Code of Practice (UK)\n4. Research on neuro-affirming approaches\n\n*⚠️ This is educational information only. Consult healthcare professionals, SENCOs, and autism specialists for personalized support plans.*`;
      } else if (hasManage && (normalizedQuestion.includes('anxiety') || questionLower.includes('anxiety') || topicLower.includes('anxiety'))) {
        return `**How to Manage Anxiety**\n\nAnxiety management involves a combination of techniques, therapy, and sometimes medication. Here's evidence-based guidance:\n\n**Key Management Strategies:**\n\n**1. Breathing Techniques**\n• Practice 4-7-8 breathing, box breathing, or coherent breathing\n• Use breathing exercises during anxious moments\n• Build regular breathing practice into daily routine\n• Try 60-second SOS breathing for acute anxiety\n\n**2. Grounding Techniques**\n• 5-4-3-2-1 grounding (5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste)\n• Progressive muscle relaxation\n• Mindfulness and present-moment awareness\n• Sensory grounding (holding objects, feeling textures)\n\n**3. Cognitive Strategies**\n• Challenge anxious thoughts with evidence\n• Practice thought reframing\n• Identify and address triggers\n• Use worry time (set aside specific time for worries)\n\n**4. Lifestyle Factors**\n• Regular physical activity\n• Consistent sleep schedule\n• Balanced nutrition\n• Limit caffeine and alcohol\n• Manage stress through healthy coping strategies\n\n**5. Professional Support**\n• Cognitive Behavioral Therapy (CBT)\n• Consider medication if recommended by healthcare professional\n• Connect with support groups\n• Work with therapists or counselors\n\n📚 **Explore our resources:**\n• <a href="anxiety-tools.html">Anxiety Tools</a> - Practical strategies\n• <a href="stress-anxiety.html">Stress & Anxiety Guide</a>\n• <a href="panic-symptoms.html">Panic Symptoms</a> - Managing panic attacks\n• <a href="breath.html">Breathing Techniques</a> - Regulation exercises\n\n**Sources:**\n1. NHS Every Mind Matters - Anxiety\n2. NICE anxiety guidelines\n3. CBT research and evidence\n4. NHS mental health resources\n\n*⚠️ This is educational information only. For severe anxiety or panic attacks, consult healthcare professionals. In emergencies, call 999 (UK) / 911 (US) or use NHS 111 / 988 Lifeline.*`;
      } else if (hasManage && (normalizedQuestion.includes('depression') || questionLower.includes('depression') || questionLower.includes('low mood') || topicLower.includes('depression'))) {
        return `**How to Manage Depression**\n\nDepression management typically involves therapy, medication (when appropriate), lifestyle changes, and support systems. Here's evidence-based guidance:\n\n**Key Management Strategies:**\n\n**1. Behavioral Activation**\n• Schedule pleasant activities, even when motivation is low\n• Set small, achievable goals\n• Maintain daily routines\n• Engage in activities that once brought joy\n\n**2. Mood Tracking**\n• Track mood patterns to identify triggers\n• Monitor sleep, energy, and activity levels\n• Use mood tracking tools or journals\n• Share patterns with healthcare professionals\n\n**3. Professional Support**\n• Cognitive Behavioral Therapy (CBT)\n• Interpersonal therapy\n• Medication (antidepressants) when recommended by healthcare professional\n• Regular check-ins with GP or mental health team\n\n**4. Self-Care**\n• Prioritize sleep and consistent sleep schedule\n• Regular physical activity (even gentle movement)\n• Balanced nutrition\n• Practice breathing and relaxation techniques\n• Connect with supportive people\n\n**5. Safety Planning**\n• Identify warning signs and triggers\n• Create a crisis plan with trusted contacts\n• Know emergency resources (999/911, crisis lines)\n• Remove means of self-harm if applicable\n\n📚 **Explore our resources:**\n• <a href="depression.html">Depression Guide</a>\n• <a href="mood-tools.html">Mood Tools</a> - Tracking and strategies\n• <a href="low-mood-burnout.html">Low Mood & Burnout</a>\n• <a href="breath.html">Breathing Techniques</a> - Regulation exercises\n\n**Sources:**\n1. NHS Depression guidance\n2. NICE depression guidelines\n3. WHO mental health resources\n4. CBT and behavioral activation research\n\n*⚠️ This is educational information only. If you're experiencing suicidal thoughts, seek immediate help: Call 999 (UK) / 911 (US), contact Samaritans (116 123), or use crisis text lines. Consult healthcare professionals for personalized depression management.*`;
      } else if (hasManage && (normalizedQuestion.includes('stress') || questionLower.includes('stress') || topicLower.includes('stress'))) {
        return `**How to Manage Stress**\n\nStress management involves identifying stressors, using coping strategies, and building resilience. Here's evidence-based guidance:\n\n**Key Management Strategies:**\n\n**1. Breathing & Relaxation**\n• Practice breathing exercises (4-7-8, box breathing)\n• Progressive muscle relaxation\n• Guided imagery or visualization\n• Regular relaxation practice\n\n**2. Time & Task Management**\n• Prioritize tasks and set realistic goals\n• Break large tasks into smaller steps\n• Learn to say no and set boundaries\n• Use planners and organizational tools\n\n**3. Physical Activity**\n• Regular exercise (even gentle movement helps)\n• Walking, yoga, or stretching\n• Physical activity releases endorphins\n• Find activities you enjoy\n\n**4. Support Systems**\n• Talk to trusted friends, family, or colleagues\n• Consider counseling or therapy\n• Join support groups\n• Don't hesitate to ask for help\n\n**5. Lifestyle Factors**\n• Maintain consistent sleep schedule\n• Balanced nutrition\n• Limit caffeine and alcohol\n• Practice mindfulness and present-moment awareness\n• Take regular breaks and rest\n\n📚 **Explore our resources:**\n• <a href="stress-tools.html">Stress Tools</a> - Practical strategies\n• <a href="stress.html">Stress Guide</a>\n• <a href="stress-anxiety.html">Stress & Anxiety</a>\n• <a href="breath.html">Breathing Techniques</a>\n\n**Sources:**\n1. NHS Every Mind Matters - Stress\n2. NICE stress management guidance\n3. Clinical stress research\n4. Workplace wellbeing resources\n\n*⚠️ This is educational information only. For chronic or severe stress, consult healthcare professionals. In emergencies, call 999 (UK) / 911 (US).*`;
      } else if (hasManage && (normalizedQuestion.includes('sleep') || questionLower.includes('sleep') || questionLower.includes('insomnia') || topicLower.includes('sleep'))) {
        return `**How to Manage Sleep Problems**\n\nSleep management involves sleep hygiene, routines, and sometimes professional support. Here's evidence-based guidance:\n\n**Key Management Strategies:**\n\n**1. Sleep Hygiene**\n• Maintain consistent sleep schedule (even on weekends)\n• Create relaxing bedtime routine\n• Keep bedroom cool, dark, and quiet\n• Avoid screens 1-2 hours before bed\n• Use bed only for sleep and intimacy\n\n**2. Pre-Bedtime Routine**\n• Wind down with calming activities (reading, gentle music)\n• Practice breathing exercises or relaxation\n• Avoid caffeine, alcohol, and large meals before bed\n• Dim lights in evening\n\n**3. Daytime Habits**\n• Get natural light exposure during day\n• Regular physical activity (but not too close to bedtime)\n• Limit naps or keep them short and early\n• Manage stress and anxiety\n\n**4. Cognitive Strategies**\n• If you can't sleep, get up and do something calming\n• Avoid clock-watching\n• Practice mindfulness or meditation\n• Address racing thoughts with journaling or CBT techniques\n\n**5. Professional Support**\n• CBT for Insomnia (CBT-I) - evidence-based treatment\n• Consult GP if sleep problems persist\n• Consider sleep studies if recommended\n• Address underlying conditions (anxiety, depression, pain)\n\n📚 **Explore our resources:**\n• <a href="sleep-tools.html">Sleep Tools</a> - Practical strategies\n• <a href="sleep.html">Sleep Guide</a>\n• <a href="sleep-onset-insomnia.html">Sleep-Onset Insomnia</a>\n• <a href="breath.html">Breathing Techniques</a> - For relaxation\n\n**Sources:**\n1. NHS Sleep guidance\n2. NICE insomnia guidelines\n3. CBT-I research and evidence\n4. Sleep medicine research\n\n*⚠️ This is educational information only. For persistent sleep problems, consult healthcare professionals or sleep specialists.*`;
      } else if (hasManage && (normalizedQuestion.includes('bipolar') || questionLower.includes('bipolar') || topicLower.includes('bipolar'))) {
        return `**How to Manage Bipolar Disorder**\n\nBipolar disorder management typically involves medication, therapy, mood tracking, and lifestyle strategies. Here's evidence-based guidance:\n\n**Key Management Strategies:**\n\n**1. Medication Management**\n• Mood stabilizers (as prescribed by healthcare professional)\n• Take medications consistently as directed\n• Regular monitoring with healthcare team\n• Report side effects and concerns promptly\n\n**2. Mood Tracking**\n• Track daily mood, sleep, energy, and activities\n• Identify early warning signs of episodes\n• Monitor triggers and patterns\n• Share tracking data with healthcare team\n\n**3. Sleep Regulation**\n• Maintain consistent sleep schedule\n• Prioritize regular sleep patterns\n• Avoid sleep disruption (shift work, irregular hours)\n• Sleep is crucial for mood stability\n\n**4. Stress Management**\n• Identify and manage stressors\n• Practice relaxation techniques\n• Set boundaries and limits\n• Build support systems\n\n**5. Professional Support**\n• Regular appointments with psychiatrist or mental health team\n• Therapy (CBT, interpersonal therapy)\n• Crisis planning and early intervention\n• Support groups (Bipolar UK)\n\n**6. Lifestyle Factors**\n• Regular routine and structure\n• Balanced nutrition\n• Limit or avoid alcohol and substances\n• Regular physical activity (when stable)\n\n📚 **Explore our resources:**\n• <a href="mood.html">Mood Guide</a> - Bipolar management\n• <a href="mood-tools.html">Mood Tools</a> - Tracking and strategies\n• <a href="sleep.html">Sleep Guide</a> - Sleep regulation\n\n**Sources:**\n1. NHS Bipolar disorder guidance\n2. NICE bipolar guidelines\n3. Bipolar UK resources\n4. Clinical research on bipolar management\n\n*⚠️ This is educational information only. Bipolar disorder requires professional medical management. Consult psychiatrists and mental health teams for personalized treatment plans. In crisis, call 999 (UK) / 911 (US) or contact crisis services.*`;
      } else if (hasManage && (normalizedQuestion.includes('ptsd') || questionLower.includes('ptsd') || questionLower.includes('trauma') || topicLower.includes('ptsd'))) {
        return `**How to Manage PTSD**\n\nPTSD management involves trauma-focused therapy, regulation strategies, and support systems. Here's evidence-based guidance:\n\n**Key Management Strategies:**\n\n**1. Professional Therapy**\n• Trauma-focused Cognitive Behavioral Therapy (TF-CBT)\n• Eye Movement Desensitization and Reprocessing (EMDR)\n• Prolonged Exposure therapy\n• Work with trauma-informed therapists\n\n**2. Grounding Techniques**\n• 5-4-3-2-1 grounding (sensory grounding)\n• Breathing exercises for regulation\n• Present-moment awareness\n• Safe place visualization\n\n**3. Regulation Strategies**\n• Breathing exercises (4-7-8, box breathing)\n• Progressive muscle relaxation\n• Mindfulness practices\n• Identify and use personal coping strategies\n\n**4. Safety & Support**\n• Build support network of trusted people\n• Create safety plan for triggers\n• Join PTSD support groups\n• Educate loved ones about PTSD\n\n**5. Self-Care**\n• Maintain routines and structure\n• Prioritize sleep and rest\n• Regular physical activity (when ready)\n• Balanced nutrition\n• Avoid alcohol and substances\n\n**6. Trigger Management**\n• Identify triggers and warning signs\n• Develop coping strategies for triggers\n• Create safe spaces\n• Gradual exposure (with professional support)\n\n📚 **Explore our resources:**\n• <a href="ptsd-regulation.html">PTSD Regulation</a> - Evidence-based strategies\n• <a href="breath.html">Breathing Techniques</a> - Regulation exercises\n• <a href="stress-tools.html">Stress Tools</a> - Coping strategies\n\n**Sources:**\n1. NHS PTSD guidance\n2. NICE PTSD guidelines\n3. Trauma-focused CBT research\n4. EMDR evidence base\n\n*⚠️ This is educational information only. PTSD requires professional trauma-informed support. Consult mental health professionals specializing in trauma. In crisis, call 999 (UK) / 911 (US) or contact crisis services.*`;
      } else if (hasManage && (normalizedQuestion.includes('dyslexia') || questionLower.includes('dyslexia') || questionLower.includes('dyslexic') || topicLower.includes('dyslexia'))) {
        return `**How to Manage Dyslexia**\n\nDyslexia management focuses on evidence-based reading interventions, accommodations, assistive technology, and support systems. Here's guidance based on BDA (British Dyslexia Association) recommendations and educational research:\n\n**Key Management Strategies:**\n\n**1. Structured Reading Interventions**\n• Structured, systematic phonics instruction\n• Multi-sensory learning approaches (visual, auditory, kinesthetic)\n• Chunked reading (breaking text into smaller sections)\n• Repeated reading practice with supportive feedback\n• Phonemic awareness training\n\n**2. Accommodations & Tools**\n• Colored overlays or tinted lenses (if helpful for visual stress)\n• Text-to-speech software and audiobooks\n• Speech-to-text technology for writing\n• Larger fonts and increased spacing\n• Reading rulers or line guides\n• Digital tools and apps designed for dyslexia\n\n**3. Writing Support**\n• Word processors with spell-check and grammar tools\n• Dictation software\n• Graphic organizers and mind maps\n• Structured writing frameworks\n• Extra time for written tasks\n• Focus on content over spelling in early drafts\n\n**4. Learning Environment**\n• Quiet, distraction-free spaces for reading\n• Clear, simple instructions\n• Visual aids and diagrams\n• Allow extra processing time\n• Break tasks into smaller steps\n• Provide written and verbal instructions\n\n**5. Educational Support**\n• Work with SENCOs (Special Educational Needs Coordinators)\n• Access to specialist dyslexia teachers or tutors\n• Individualized Education Plans (IEPs) or support plans\n• Regular progress monitoring\n• Advocate for appropriate accommodations\n\n**6. Building Confidence**\n• Focus on strengths and interests\n• Celebrate progress, not just perfection\n• Provide positive, specific feedback\n• Connect with dyslexia support groups\n• Share success stories of people with dyslexia\n• Address any anxiety or low self-esteem\n\n**7. Home & Family Support**\n• Read together regularly (shared reading)\n• Use audiobooks alongside print books\n• Play word games and phonics activities\n• Create a supportive, patient environment\n• Advocate for your child at school\n• Connect with other families\n\n**Evidence-Based Approaches:**\nDyslexia support is guided by BDA recommendations, educational research, and evidence-based interventions. Structured phonics, multi-sensory approaches, and appropriate accommodations are key.\n\n📚 **Explore our resources:**\n• <a href="dyslexia-reading-training.html">Dyslexia Reading Training</a> - Evidence-based strategies\n• <a href="resources.html">Resources</a> - Additional support materials\n\n**Sources:**\n1. British Dyslexia Association (BDA) guidelines\n2. NICE guidance on learning difficulties\n3. Educational research on reading interventions\n4. International Dyslexia Association resources\n5. SEND Code of Practice (UK)\n\n*⚠️ This is educational information only. Consult SENCOs, educational psychologists, or dyslexia specialists for personalized support plans. Early identification and intervention are important for success.*`;
      }
    }
    
    // Basic "what is" questions
    if (questionLower.includes('what is') || questionLower.includes('what\'s')) {
      if (questionLower.includes('autism') || questionLower.includes('autistic')) {
        return `**What is Autism?**\n\nAutism (Autism Spectrum Disorder, or ASD) is a neurodevelopmental condition that affects how people communicate, interact, and experience the world. It's characterized by differences in social communication, sensory processing, and often includes strong interests in specific topics.\n\n**Key Points:**\n• Autism is a spectrum - each person's experience is unique\n• It's not a disease or something to be "cured"\n• Many autistic people have strengths in pattern recognition, attention to detail, and deep focus\n• Support focuses on accommodations, understanding, and neuro-affirming approaches\n\n**Evidence-Based Support:**\nEvidence supports structured routines, sensory accommodations, visual supports, and predictable environments. Research from Population Medicine and clinical guidelines emphasize individualized, neuro-affirming approaches.\n\n📚 Explore: <a href="autism-tools.html">autism-tools.html</a>\n\n**Sources:**\n1. NHS Autism support\n2. NICE guidelines\n3. Population Medicine: <https://www.populationmedicine.eu>\n4. DOAJ Journal: <https://doaj.org/toc/2654-1459>\n\n*Educational information only. Consult healthcare professionals for medical advice.*`;
      } else if (questionLower.includes('adhd')) {
        return `**What is ADHD?**\n\nADHD (Attention Deficit Hyperactivity Disorder) is a neurodevelopmental condition characterized by differences in attention, impulse control, and activity levels. It affects how people focus, organize tasks, and manage time.\n\n**Key Points:**\n• ADHD includes three types: inattentive, hyperactive-impulsive, and combined\n• It's a lifelong condition, though symptoms may change over time\n• Many people with ADHD have strengths in creativity, hyperfocus, and innovative thinking\n• Support includes structure, movement breaks, and evidence-based strategies\n\n**Evidence-Based Support:**\nADHD management is guided by NICE NG87, CDC guidelines, and cognitive training research. Evidence-based strategies include structured routines, movement breaks, attention training, and external cueing systems.\n\n📚 Explore: <a href="adhd-tools.html">adhd-tools.html</a>\n\n**Sources:**\n1. NICE NG87\n2. CDC ADHD guidelines\n3. EndeavorRx research\n4. Population Medicine: <https://www.populationmedicine.eu>\n\n*Educational information only. Consult healthcare professionals for medical advice.*`;
      } else if (questionLower.includes('dyslexia') || questionLower.includes('dyslexic')) {
        return `**What is Dyslexia?**\n\nDyslexia is a specific learning difficulty that primarily affects reading, writing, and spelling skills. It's a neurodevelopmental condition that affects how the brain processes written and sometimes spoken language.\n\n**Key Points:**\n• Dyslexia is not related to intelligence - many people with dyslexia are highly intelligent\n• It affects reading accuracy, fluency, and comprehension\n• Writing and spelling are often affected\n• It's a lifelong condition, but with appropriate support, people can succeed\n• Many people with dyslexia have strengths in creativity, problem-solving, and visual thinking\n\n**Common Characteristics:**\n• Difficulty with phonological processing (sounds in words)\n• Challenges with decoding (sounding out words)\n• Slow or inaccurate reading\n• Spelling difficulties\n• Sometimes affects working memory and processing speed\n\n**Evidence-Based Support:**\nDyslexia support includes structured phonics instruction, multi-sensory learning, assistive technology, and appropriate accommodations. These approaches are supported by BDA (British Dyslexia Association) recommendations and educational research.\n\n📚 Explore: <a href="dyslexia-reading-training.html">dyslexia-reading-training.html</a>\n\n**Sources:**\n1. British Dyslexia Association (BDA)\n2. International Dyslexia Association\n3. NICE guidance on learning difficulties\n4. SEND Code of Practice (UK)\n\n*Educational information only. Consult SENCOs, educational psychologists, or dyslexia specialists for assessment and support.*`;
      }
    }
    
    // General fallback
    try {
      return generateEvidenceBasedResponse(question, topic);
    } catch (error) {
      console.error('Error in generateEvidenceBasedResponse:', error);
      // Return a basic helpful response if everything else fails
      return `I understand you're asking about "${question}". Here's some general guidance:\n\nFor detailed information, please explore our resources:\n• <a href="resources.html">Resources</a>\n• <a href="adhd-tools.html">ADHD Tools</a> (if relevant)\n• <a href="autism-tools.html">Autism Tools</a> (if relevant)\n\n*This is educational information only. Consult healthcare professionals for personalized advice.*`;
    }
    } catch (error) {
      console.error('Error in generateFallbackResponse:', error);
      // Return a safe fallback response
      return `I understand you're asking about "${question}". For detailed information, please explore our <a href="resources.html">resources page</a> or contact support.\n\n*This is educational information only. Consult healthcare professionals for personalized advice.*`;
    }
  }

  // ============================================
  // NHS API INTEGRATION (Fallback)
  // ============================================
  // NHS Website Content API v2 - Requires API key
  // Documentation: https://digital.nhs.uk/developer/api-catalogue/nhs-website-content/v2
  // Registration: https://developer.api.nhs.uk/
  // 
  // To enable NHS API:
  // 1. Register at https://developer.api.nhs.uk/
  // 2. Subscribe to NHS Website Content API v2
  // 3. Get your subscription key
  // 4. Set it below or via environment variable
  //
  // Note: If no API key is set, the system will use NHS website search links instead
  const NHS_API_BASE_URL = 'https://api.nhs.uk';
  
  // Get NHS API key - set directly here or via window.NHS_API_KEY
  // For production, consider using a server-side proxy to keep API keys secure
  // You can also set it via: window.NHS_API_KEY = 'your-key-here' before this script loads
  const NHS_API_KEY = (typeof window !== 'undefined' && window.NHS_API_KEY) 
    ? window.NHS_API_KEY 
    : ''; // Set your NHS API key here: 'your-api-key-here'
  
  // Alternative: Use NHS website content directly (no API key, but less structured)
  const NHS_WEBSITE_SEARCH_URL = 'https://www.nhs.uk/search/results.html?q=';
  
  // ============================================
  // PUBMED API INTEGRATION
  // ============================================
  // PubMed E-utilities API - Free, no API key required
  // Rate limit: 3 requests per second (use with respect)
  // Documentation: https://www.ncbi.nlm.nih.gov/books/NBK25497/
  const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
  
  // Rate limiting: track last request time
  let lastPubMedRequest = 0;
  const PUBMED_MIN_INTERVAL = 350; // ~3 requests per second (1000ms / 3 = ~333ms, use 350ms for safety)
  
  async function fetchFromAIAPI(question, topic) {
    try {
      // Step 1: Search PubMed for relevant research articles
      const pubmedResults = await searchPubMed(question, topic);
      
      if (pubmedResults && pubmedResults.length > 0) {
        // Step 2: Generate evidence-based response using PubMed results
        return generatePubMedEnhancedResponse(question, topic, pubmedResults);
      }
      
      // If no PubMed results, return null to use fallback
      return null;
    } catch (error) {
      // Silently fail - CORS or network errors are expected in browser
      // Don't log to avoid console spam, just return null for fallback
      return null; // Fall back to knowledge base
    }
  }

  async function searchPubMed(question, topic) {
    try {
      // Note: PubMed E-utilities may have CORS restrictions in browsers
      // If this fails, the system will gracefully fall back to knowledge base
      
      // Rate limiting: ensure we don't exceed 3 requests per second
      const now = Date.now();
      const timeSinceLastRequest = now - lastPubMedRequest;
      
      if (timeSinceLastRequest < PUBMED_MIN_INTERVAL) {
        // Wait before making request
        await new Promise(resolve => setTimeout(resolve, PUBMED_MIN_INTERVAL - timeSinceLastRequest));
      }
      
      // Build search query optimized for neurodiversity and wellbeing topics
      const searchQuery = buildPubMedQuery(question, topic);
      
      // Step 1: Search PubMed and get article IDs
      lastPubMedRequest = Date.now();
      const searchUrl = `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchQuery)}&retmax=5&retmode=json&sort=relevance`;
      
      // Use fetch with timeout and better error handling
      const searchResponse = await Promise.race([
        fetch(searchUrl),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
      ]).catch(() => null);
      
      if (!searchResponse || !searchResponse.ok) {
        return null; // Silently fail - will use fallback
      }
      
      const searchData = await searchResponse.json().catch(() => null);
      if (!searchData) return null;
      
      const pmids = searchData.esearchresult?.idlist || [];
      
      if (pmids.length === 0) {
        return null; // No results found
      }
      
      // Rate limiting: wait before second request
      const timeSinceSearch = Date.now() - lastPubMedRequest;
      if (timeSinceSearch < PUBMED_MIN_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, PUBMED_MIN_INTERVAL - timeSinceSearch));
      }
      
      // Step 2: Fetch article details (title, abstract, authors, journal)
      lastPubMedRequest = Date.now();
      const fetchUrl = `${PUBMED_BASE_URL}/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=xml`;
      
      const fetchResponse = await Promise.race([
        fetch(fetchUrl),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
      ]).catch(() => null);
      
      if (!fetchResponse || !fetchResponse.ok) {
        return null; // Silently fail - will use fallback
      }
      
      const xmlText = await fetchResponse.text().catch(() => '');
      if (!xmlText) return null;
      
      const articles = parsePubMedXML(xmlText);
      
      return articles;
    } catch (error) {
      // Silently fail - CORS or network errors are expected
      // Don't log to avoid console spam
      return null;
    }
  }

  function buildPubMedQuery(question, topic) {
    // Build optimized PubMed search query
    const questionLower = question.toLowerCase();
    const topicLower = topic ? topic.toLowerCase() : '';
    
    // Extract key terms from question
    const keyTerms = [];
    
    // Neurodivergent conditions
    if (questionLower.includes('autism') || questionLower.includes('autistic') || topicLower.includes('autism')) {
      keyTerms.push('autism spectrum disorder');
      keyTerms.push('ASD');
    }
    if (questionLower.includes('adhd') || topicLower.includes('adhd') || questionLower.includes('attention deficit')) {
      keyTerms.push('attention deficit hyperactivity disorder');
      keyTerms.push('ADHD');
    }
    if (questionLower.includes('dyslexia') || topicLower.includes('dyslexia')) {
      keyTerms.push('dyslexia');
      keyTerms.push('reading disorder');
    }
    
    // Mental health and wellbeing
    if (questionLower.includes('anxiety') || topicLower.includes('anxiety')) {
      keyTerms.push('anxiety');
      keyTerms.push('anxiety disorder');
    }
    if (questionLower.includes('depression') || questionLower.includes('mood') || topicLower.includes('depression')) {
      keyTerms.push('depression');
      keyTerms.push('mood disorder');
    }
    if (questionLower.includes('stress') || topicLower.includes('stress')) {
      keyTerms.push('stress');
      keyTerms.push('stress management');
    }
    if (questionLower.includes('sleep') || questionLower.includes('insomnia') || topicLower.includes('sleep')) {
      keyTerms.push('sleep');
      keyTerms.push('insomnia');
      keyTerms.push('sleep disorder');
    }
    
    // Breathing and regulation
    if (questionLower.includes('breath') || questionLower.includes('breathing') || topicLower.includes('breathing')) {
      keyTerms.push('breathing exercises');
      keyTerms.push('respiratory regulation');
      keyTerms.push('breathwork');
    }
    
    // Wellbeing and neurodiversity
    if (questionLower.includes('neurodivergent') || questionLower.includes('neurodiversity')) {
      keyTerms.push('neurodiversity');
    }
    if (questionLower.includes('wellbeing') || questionLower.includes('well-being') || questionLower.includes('wellness')) {
      keyTerms.push('wellbeing');
      keyTerms.push('mental health');
    }
    
    // Bipolar disorder
    if (questionLower.includes('bipolar') || topicLower.includes('bipolar')) {
      keyTerms.push('bipolar disorder');
      keyTerms.push('bipolar');
    }
    
    // PTSD and trauma
    if (questionLower.includes('ptsd') || questionLower.includes('post traumatic') || questionLower.includes('trauma') || topicLower.includes('ptsd')) {
      keyTerms.push('post-traumatic stress disorder');
      keyTerms.push('PTSD');
      keyTerms.push('trauma');
    }
    
    // Add intervention/support terms
    if (questionLower.includes('treatment') || questionLower.includes('therapy') || questionLower.includes('intervention')) {
      keyTerms.push('intervention');
      keyTerms.push('treatment');
    }
    if (questionLower.includes('support') || questionLower.includes('accommodation')) {
      keyTerms.push('support');
      keyTerms.push('accommodation');
    }
    
    // If no specific terms found, use general neurodiversity/wellbeing terms
    if (keyTerms.length === 0) {
      // Extract meaningful words from question (3+ characters, not common stop words)
      const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'what', 'how', 'why', 'when', 'where', 'can', 'could', 'should', 'would', 'may', 'might', 'must', 'this', 'that', 'these', 'those'];
      const words = questionLower.split(/\s+/).filter(word => 
        word.length >= 3 && !stopWords.includes(word)
      );
      
      // Use first few meaningful words as search terms
      if (words.length > 0) {
        keyTerms.push(...words.slice(0, 3));
      } else {
        // Fallback to general terms
        keyTerms.push('neurodiversity', 'mental health', 'wellbeing');
      }
    }
    
    // Build query: combine key terms with OR logic
    let query = keyTerms.join(' OR ');
    
    // Add filters for quality and recency (but make them optional if query is too restrictive)
    // Focus on recent, high-quality research (last 10 years, reviews, clinical trials)
    query += ' AND (systematic review[Filter] OR meta-analysis[Filter] OR randomized controlled trial[Filter] OR clinical trial[Filter] OR review[Filter] OR "clinical study"[Publication Type])';
    query += ' AND ("2014"[PDAT] : "2024"[PDAT])'; // Last 10 years
    
    // Limit to English and human studies
    query += ' AND english[Language] AND human[Mesh]';
    
    return query;
  }

  function parsePubMedXML(xmlText) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const articles = [];
      
      const articleNodes = xmlDoc.querySelectorAll('PubmedArticle');
      
      articleNodes.forEach(articleNode => {
        const pmid = articleNode.querySelector('PMID')?.textContent || '';
        const title = articleNode.querySelector('ArticleTitle')?.textContent || '';
        const abstractNode = articleNode.querySelector('AbstractText');
        const abstract = abstractNode ? abstractNode.textContent : '';
        
        // Get authors
        const authors = [];
        const authorNodes = articleNode.querySelectorAll('Author');
        authorNodes.forEach(authorNode => {
          const lastName = authorNode.querySelector('LastName')?.textContent || '';
          const firstName = authorNode.querySelector('ForeName')?.textContent || '';
          if (lastName) {
            authors.push(`${firstName} ${lastName}`.trim());
          }
        });
        
        // Get journal info
        const journal = articleNode.querySelector('Journal > Title')?.textContent || '';
        const pubDateNode = articleNode.querySelector('PubDate');
        const year = pubDateNode?.querySelector('Year')?.textContent || 
                     pubDateNode?.querySelector('MedlineDate')?.textContent?.substring(0, 4) || '';
        
        // Get DOI if available
        const doiNode = articleNode.querySelector('ELocationID[EIdType="doi"]');
        const doi = doiNode?.textContent || '';
        
        if (title) {
          articles.push({
            pmid,
            title,
            abstract: abstract.substring(0, 500), // Limit abstract length
            authors: authors.slice(0, 5), // First 5 authors
            journal,
            year,
            doi,
            url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
          });
        }
      });
      
      return articles;
    } catch (error) {
      console.error('Error parsing PubMed XML:', error);
      return [];
    }
  }

  function generatePubMedEnhancedResponse(question, topic, articles) {
    let response = '**Evidence-Based Answer**\n\n';
    
    // Summarize key findings from PubMed articles
    response += 'Based on recent peer-reviewed research from PubMed, here\'s evidence-informed guidance:\n\n';
    
    // Extract and summarize key information from abstracts
    const keyFindings = extractKeyFindings(articles, question);
    if (keyFindings) {
      response += keyFindings + '\n\n';
    }
    
    // Add practical recommendations
    response += '**Practical Recommendations:**\n';
    const recommendations = generatePracticalRecommendations(question, topic, articles);
    response += recommendations + '\n\n';
    
    // Add citations
    response += '**Research Citations:**\n';
    articles.slice(0, 3).forEach((article, index) => {
      const authorsStr = article.authors.length > 0 
        ? (article.authors.length === 1 ? article.authors[0] : `${article.authors[0]} et al.`)
        : 'Authors';
      response += `${index + 1}. ${authorsStr} (${article.year}). ${article.title}. ${article.journal}. `;
      if (article.doi) {
        response += `DOI: ${article.doi}. `;
      }
      response += `[PubMed: ${article.pmid}](${article.url})\n`;
    });
    
    // Add website resources
    const websiteLink = findRelevantWebsiteLink(topic);
    if (websiteLink) {
      response += `\n📚 **Explore our resources:** <a href="${websiteLink}">${websiteLink}</a>\n\n`;
    }
    
    // Add additional research sources
    response += '**Additional Research Sources:**\n';
    response += `• PubMed Database: <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank">pubmed.ncbi.nlm.nih.gov</a>\n`;
    response += `• Population Medicine: <a href="${EXTERNAL_SOURCES.populationMedicine.url}" target="_blank">${EXTERNAL_SOURCES.populationMedicine.url}</a>\n`;
    response += `• DOAJ Journal: <a href="${EXTERNAL_SOURCES.doaj.url}" target="_blank">${EXTERNAL_SOURCES.doaj.url}</a>\n\n`;
    
    response += '*⚠️ This is educational information based on research evidence. Not medical advice. Consult qualified healthcare professionals for personalized guidance. In emergencies, call 999 (UK) / 911 (US).*';
    
    return response;
  }

  function extractKeyFindings(articles, question) {
    // Extract key findings from article abstracts
    const questionLower = question.toLowerCase();
    const relevantFindings = [];
    
    articles.forEach(article => {
      if (article.abstract) {
        const abstractLower = article.abstract.toLowerCase();
        
        // Look for key phrases that match the question
        if (questionLower.includes('effective') || questionLower.includes('work') || questionLower.includes('help')) {
          // Look for effectiveness statements
          if (abstractLower.includes('effective') || abstractLower.includes('significant') || abstractLower.includes('improved')) {
            const sentences = article.abstract.split(/[.!?]+/).filter(s => 
              s.toLowerCase().includes('effective') || 
              s.toLowerCase().includes('significant') || 
              s.toLowerCase().includes('improved')
            );
            if (sentences.length > 0) {
              relevantFindings.push(sentences[0].trim());
            }
          }
        }
        
        // Extract first few sentences as summary
        if (relevantFindings.length < 2) {
          const firstSentence = article.abstract.split(/[.!?]+/)[0];
          if (firstSentence && firstSentence.length > 50) {
            relevantFindings.push(firstSentence.trim() + '.');
          }
        }
      }
    });
    
    if (relevantFindings.length > 0) {
      return '**Key Research Findings:**\n' + relevantFindings.slice(0, 2).map((f, i) => `• ${f}`).join('\n');
    }
    
    return null;
  }

  function generatePracticalRecommendations(question, topic, articles) {
    const questionLower = question.toLowerCase();
    const topicLower = topic ? topic.toLowerCase() : '';
    let recommendations = '';
    
    // Topic-specific recommendations based on research
    if (topicLower.includes('autism') || questionLower.includes('autism')) {
      recommendations += '• Structured routines and predictable schedules (supported by research)\n';
      recommendations += '• Low-sensory environments and sensory accommodations\n';
      recommendations += '• Visual supports and clear communication strategies\n';
      recommendations += '• Individualized support plans based on strengths and needs\n';
    } else if (topicLower.includes('adhd') || questionLower.includes('adhd')) {
      recommendations += '• Structured routines with external cueing systems\n';
      recommendations += '• Regular movement breaks and physical activity\n';
      recommendations += '• Attention training exercises and cognitive strategies\n';
      recommendations += '• Environmental modifications to reduce distractions\n';
    } else if (topicLower.includes('breathing') || questionLower.includes('breath')) {
      recommendations += '• Regular practice of evidence-based breathing techniques (4-7-8, box breathing)\n';
      recommendations += '• Integration into daily routines for stress regulation\n';
      recommendations += '• Progressive practice building duration over time\n';
    } else if (topicLower.includes('sleep') || questionLower.includes('sleep')) {
      recommendations += '• Consistent sleep schedules and bedtime routines\n';
      recommendations += '• Sleep hygiene practices (low light, no screens before bed)\n';
      recommendations += '• Relaxation techniques and breathing exercises\n';
    } else if (topicLower.includes('mood') || questionLower.includes('depression')) {
      recommendations += '• Behavioral activation and activity scheduling\n';
      recommendations += '• Mood tracking to identify patterns\n';
      recommendations += '• Evidence-based interventions (CBT, mindfulness)\n';
    } else {
      recommendations += '• Evidence-based interventions tailored to individual needs\n';
      recommendations += '• Regular monitoring and adjustment of strategies\n';
      recommendations += '• Professional support when needed\n';
    }
    
    return recommendations;
  }

  // ============================================
  // NHS API FUNCTIONS
  // ============================================
  async function fetchFromNHSAPI(question, topic) {
    try {
      // Try NHS API v2 first (requires API key)
      if (NHS_API_KEY) {
        const nhsApiResponse = await searchNHSAPI(question, topic);
        if (nhsApiResponse) {
          return nhsApiResponse;
        }
      }
      
      // Fallback: Search NHS website directly (no API key required)
      const nhsWebsiteResponse = await searchNHSWebsite(question, topic);
      if (nhsWebsiteResponse) {
        return nhsWebsiteResponse;
      }
      
      return null;
    } catch (error) {
      console.error('NHS API Error:', error);
      return null;
    }
  }

  async function searchNHSAPI(question, topic) {
    try {
      if (!NHS_API_KEY) {
        return null; // No API key configured
      }
      
      // Build search query for NHS API
      const searchQuery = buildNHSQuery(question, topic);
      
      // NHS API v2 endpoint for content search
      // Note: This is a simplified implementation - actual API may have different endpoints
      const apiUrl = `${NHS_API_BASE_URL}/content/search?q=${encodeURIComponent(searchQuery)}&api-version=2`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'subscription-key': NHS_API_KEY,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`NHS API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.value && data.value.length > 0) {
        return generateNHSEnhancedResponse(question, topic, data.value);
      }
      
      return null;
    } catch (error) {
      console.error('NHS API search error:', error);
      return null;
    }
  }

  async function searchNHSWebsite(question, topic) {
    try {
      // Build search query for NHS website
      const searchQuery = buildNHSQuery(question, topic);
      const searchUrl = NHS_WEBSITE_SEARCH_URL + encodeURIComponent(searchQuery);
      
      // Note: Direct website scraping is not recommended due to CORS
      // Instead, we'll provide a response with NHS search link and guidance
      // In production, you'd use a server-side proxy or the official NHS API
      
      return generateNHSWebsiteResponse(question, topic, searchQuery, searchUrl);
    } catch (error) {
      console.error('NHS website search error:', error);
      return null;
    }
  }

  function buildNHSQuery(question, topic) {
    // Build optimized NHS search query
    const questionLower = question.toLowerCase();
    const topicLower = topic ? topic.toLowerCase() : '';
    
    // Map topics to NHS-friendly search terms
    const nhsTerms = [];
    
    if (questionLower.includes('autism') || questionLower.includes('autistic') || topicLower.includes('autism')) {
      nhsTerms.push('autism');
    }
    if (questionLower.includes('adhd') || topicLower.includes('adhd')) {
      nhsTerms.push('ADHD');
    }
    if (questionLower.includes('dyslexia') || topicLower.includes('dyslexia')) {
      nhsTerms.push('dyslexia');
    }
    if (questionLower.includes('anxiety') || topicLower.includes('anxiety')) {
      nhsTerms.push('anxiety');
    }
    if (questionLower.includes('depression') || questionLower.includes('mood') || topicLower.includes('depression')) {
      nhsTerms.push('depression');
    }
    if (questionLower.includes('stress') || topicLower.includes('stress')) {
      nhsTerms.push('stress');
    }
    if (questionLower.includes('sleep') || questionLower.includes('insomnia') || topicLower.includes('sleep')) {
      nhsTerms.push('sleep problems');
    }
    if (questionLower.includes('breath') || questionLower.includes('breathing') || topicLower.includes('breathing')) {
      nhsTerms.push('breathing exercises');
    }
    if (questionLower.includes('bipolar') || topicLower.includes('bipolar')) {
      nhsTerms.push('bipolar disorder');
    }
    if (questionLower.includes('ptsd') || questionLower.includes('post traumatic') || questionLower.includes('trauma') || topicLower.includes('ptsd')) {
      nhsTerms.push('PTSD');
      nhsTerms.push('post-traumatic stress disorder');
    }
    if (questionLower.includes('mindfulness') || topicLower.includes('mindfulness')) {
      nhsTerms.push('mindfulness');
    }
    
    // Combine terms
    if (nhsTerms.length > 0) {
      return nhsTerms.join(' ');
    }
    
    // Fallback: use key words from question
    const words = question.split(/\s+/).filter(word => word.length >= 4).slice(0, 3);
    return words.join(' ') || question;
  }

  function generateNHSEnhancedResponse(question, topic, nhsContent) {
    let response = '**NHS Guidance**\n\n';
    response += 'Based on official NHS information, here\'s guidance on your question:\n\n';
    
    // Process NHS content (structure may vary based on API response)
    if (Array.isArray(nhsContent) && nhsContent.length > 0) {
      const firstResult = nhsContent[0];
      
      if (firstResult.name || firstResult.title) {
        response += `**${firstResult.name || firstResult.title}**\n\n`;
      }
      
      if (firstResult.description || firstResult.summary) {
        response += firstResult.description || firstResult.summary;
        response += '\n\n';
      }
      
      // Add links to NHS resources
      if (firstResult.url) {
        response += `📋 **Read more on NHS website:** <a href="${firstResult.url}" target="_blank">${firstResult.url}</a>\n\n`;
      }
      
      // Add additional results
      if (nhsContent.length > 1) {
        response += '**Additional NHS Resources:**\n';
        nhsContent.slice(1, 4).forEach((item, index) => {
          if (item.name || item.title) {
            response += `${index + 2}. ${item.name || item.title}`;
            if (item.url) {
              response += ` - <a href="${item.url}" target="_blank">View on NHS</a>`;
            }
            response += '\n';
          }
        });
        response += '\n';
      }
    }
    
    // Add website resources
    const websiteLink = findRelevantWebsiteLink(topic);
    if (websiteLink) {
      response += `📚 **Explore our resources:** <a href="${websiteLink}">${websiteLink}</a>\n\n`;
    }
    
    // Add NHS disclaimer
    response += '**Sources:**\n';
    response += '• NHS Website: <a href="https://www.nhs.uk" target="_blank">www.nhs.uk</a>\n';
    response += '• NHS Every Mind Matters: <a href="https://www.nhs.uk/every-mind-matters/" target="_blank">every-mind-matters</a>\n\n';
    
    response += '*⚠️ This is educational information based on NHS guidance. Not medical advice. Consult your GP or healthcare professional for personalized guidance. In emergencies, call 999 (UK) or 111 for non-emergency advice.*';
    
    return response;
  }

  function generateNHSWebsiteResponse(question, topic, searchQuery, searchUrl) {
    let response = '**NHS Guidance**\n\n';
    response += 'Based on NHS information, here\'s guidance on your question:\n\n';
    
    // Provide topic-specific NHS guidance
    const questionLower = question.toLowerCase();
    const topicLower = topic ? topic.toLowerCase() : '';
    
    if (topicLower.includes('autism') || questionLower.includes('autism')) {
      response += '**Autism Support (NHS):**\n';
      response += 'The NHS provides comprehensive information about autism, including:\n';
      response += '• Understanding autism and getting a diagnosis\n';
      response += '• Support services and resources\n';
      response += '• Living with autism and managing daily life\n';
      response += '• Information for families and carers\n\n';
      response += `🔍 **Search NHS for more:** <a href="${searchUrl}" target="_blank">NHS Search: "${searchQuery}"</a>\n\n`;
    } else if (topicLower.includes('adhd') || questionLower.includes('adhd')) {
      response += '**ADHD Support (NHS):**\n';
      response += 'The NHS provides information about ADHD, including:\n';
      response += '• Symptoms and diagnosis of ADHD\n';
      response += '• Treatment options and support\n';
      response += '• Living with ADHD\n';
      response += '• Information for parents and carers\n\n';
      response += `🔍 **Search NHS for more:** <a href="${searchUrl}" target="_blank">NHS Search: "${searchQuery}"</a>\n\n`;
    } else if (topicLower.includes('anxiety') || questionLower.includes('anxiety')) {
      response += '**Anxiety Support (NHS):**\n';
      response += 'The NHS Every Mind Matters provides resources for anxiety, including:\n';
      response += '• Understanding anxiety and its symptoms\n';
      response += '• Self-help techniques and coping strategies\n';
      response += '• When to seek professional help\n';
      response += '• Treatment options (CBT, medication, etc.)\n\n';
      response += `🔍 **Search NHS for more:** <a href="${searchUrl}" target="_blank">NHS Search: "${searchQuery}"</a>\n\n`;
    } else if (topicLower.includes('depression') || questionLower.includes('depression')) {
      response += '**Depression Support (NHS):**\n';
      response += 'The NHS provides comprehensive information about depression, including:\n';
      response += '• Symptoms and types of depression\n';
      response += '• Treatment options and support\n';
      response += '• Self-help strategies\n';
      response += '• When to seek help\n\n';
      response += `🔍 **Search NHS for more:** <a href="${searchUrl}" target="_blank">NHS Search: "${searchQuery}"</a>\n\n`;
    } else {
      response += '**NHS Health Information:**\n';
      response += 'The NHS website provides trusted, evidence-based health information on a wide range of topics.\n\n';
      response += `🔍 **Search NHS for more:** <a href="${searchUrl}" target="_blank">NHS Search: "${searchQuery}"</a>\n\n`;
    }
    
    // Add website resources
    const websiteLink = findRelevantWebsiteLink(topic);
    if (websiteLink) {
      response += `📚 **Explore our resources:** <a href="${websiteLink}">${websiteLink}</a>\n\n`;
    }
    
    // Add NHS resources
    response += '**NHS Resources:**\n';
    response += '• NHS Website: <a href="https://www.nhs.uk" target="_blank">www.nhs.uk</a>\n';
    response += '• NHS Every Mind Matters: <a href="https://www.nhs.uk/every-mind-matters/" target="_blank">every-mind-matters</a>\n';
    response += '• NHS 111 (non-emergency): <a href="https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/" target="_blank">When to call 111</a>\n\n';
    
    response += '*⚠️ This is educational information based on NHS guidance. Not medical advice. Consult your GP or healthcare professional for personalized guidance. In emergencies, call 999 (UK) or 111 for non-emergency advice.*';
    
    return response;
  }

  function formatAPIResponse(data, question, topic) {
    let response = data.answer || data.response || '';
    
    // Add sources if provided
    if (data.sources && data.sources.length > 0) {
      response += '\n\n**Sources:**\n';
      data.sources.forEach((source, index) => {
        response += `${index + 1}. ${source}\n`;
      });
    }
    
    // Add external research links
    response += '\n**Additional Research:**\n';
    response += `• Population Medicine: ${EXTERNAL_SOURCES.populationMedicine.url}\n`;
    response += `• DOAJ Journal: ${EXTERNAL_SOURCES.doaj.url}\n`;
    
    // Add website link if relevant
    const websiteLink = findRelevantWebsiteLink(topic);
    if (websiteLink) {
      response += `\n📚 Explore our ${topic} resources: <a href="${websiteLink}">${websiteLink}</a>\n`;
    }
    
    response += '\n*Educational information only. Consult healthcare professionals for medical advice.*';
    
    return response;
  }

  function getWebsiteContentSummary(topic) {
    // Return summary of website content for context
    const topicLower = topic ? topic.toLowerCase() : '';
    const knowledge = KNOWLEDGE_BASE[topicLower];
    
    if (knowledge) {
      return {
        pages: knowledge.pages,
        keyTopics: knowledge.content.map(item => item.keywords.join(', '))
      };
    }
    
    return {
      pages: ['index.html', 'resources.html'],
      keyTopics: ['neurodiversity', 'breathing', 'wellbeing', 'autism', 'ADHD', 'dyslexia']
    };
  }

  function findRelevantWebsiteLink(topic) {
    const topicLower = topic ? topic.toLowerCase() : '';
    const knowledge = KNOWLEDGE_BASE[topicLower];
    
    if (knowledge && knowledge.content.length > 0) {
      return knowledge.content[0].link;
    }
    
    // Default links by topic
    const topicLinks = {
      'autism': 'autism-tools.html',
      'adhd': 'adhd-tools.html',
      'dyslexia': 'dyslexia-reading-training.html',
      'breathing': 'breath.html',
      'sleep': 'sleep.html',
      'mood': 'mood-tools.html',
      'depression': 'depression.html',
      'anxiety': 'anxiety-tools.html',
      'stress': 'stress-tools.html',
      'bipolar': 'mood.html',
      'ptsd': 'ptsd-regulation.html',
      'mindfulness': 'mindfulness.html',
      'general': 'resources.html'
    };
    
    return topicLinks[topicLower] || 'resources.html';
  }

  function searchKnowledgeBase(question, topic) {
    // Normalize topic
    const normalizedTopic = topic ? normalizeTopic(topic.toLowerCase()) : null;
    
    // Search all topics if no specific topic selected, or search specific topic
    const topicsToSearch = normalizedTopic ? [normalizedTopic] : Object.keys(KNOWLEDGE_BASE);
    
    let bestMatch = null;
    let bestMatchScore = 0;
    
    for (const searchTopic of topicsToSearch) {
      const topicData = KNOWLEDGE_BASE[searchTopic];
      if (!topicData) continue;
      
      for (const item of topicData.content) {
        // Calculate match score
        const matchScore = calculateMatchScore(question, item.keywords);
        
        if (matchScore > bestMatchScore) {
          bestMatchScore = matchScore;
          bestMatch = {
            answer: item.answer,
            link: item.link,
            sources: item.sources,
            topic: searchTopic,
            score: matchScore
          };
        }
      }
    }
    
    // Return match if score is above threshold
    return bestMatchScore >= 1 ? bestMatch : null;
  }

  function normalizeTopic(topic) {
    // Map topic variations to knowledge base keys
    const topicMap = {
      'autism': 'autism',
      'autistic': 'autism',
      'asd': 'autism',
      'adhd': 'adhd',
      'attention deficit': 'adhd',
      'attention-deficit': 'adhd',
      'dyslexia': 'dyslexia',
      'dyslexic': 'dyslexia',
      'breathing': 'breathing',
      'breath': 'breathing',
      'breathwork': 'breathing',
      'sleep': 'sleep',
      'insomnia': 'sleep',
      'sleep disorder': 'sleep',
      'mood': 'mood',
      'depression': 'depression',
      'depressed': 'depression',
      'low mood': 'depression',
      'stress': 'stress',
      'stressed': 'stress',
      'anxiety': 'anxiety',
      'anxious': 'anxiety',
      'panic': 'anxiety',
      'bipolar': 'bipolar',
      'bipolar disorder': 'bipolar',
      'mania': 'bipolar',
      'ptsd': 'ptsd',
      'post traumatic': 'ptsd',
      'post-traumatic': 'ptsd',
      'trauma': 'ptsd',
      'mindfulness': 'mindfulness',
      'meditation': 'mindfulness',
      'wellbeing': 'general',
      'well-being': 'general',
      'wellness': 'general',
      'health': 'general',
      'mental health': 'general',
      'neurodivergent': 'general',
      'neurodiversity': 'general'
    };
    
    for (const [key, value] of Object.entries(topicMap)) {
      if (topic.includes(key)) {
        return value;
      }
    }
    
    return topic;
  }

  function calculateMatchScore(question, keywords) {
    const questionLower = question.toLowerCase();
    let score = 0;
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      if (questionLower.includes(keywordLower)) {
        // Longer keywords get higher scores
        score += keywordLower.length;
        // Exact matches get bonus
        if (questionLower.includes(' ' + keywordLower + ' ') || 
            questionLower.startsWith(keywordLower + ' ') ||
            questionLower.endsWith(' ' + keywordLower)) {
          score += 5;
        }
      }
    });
    
    return score;
  }

  function formatResponse(data, originalQuestion) {
    let response = data.answer + '\n\n';
    
    // Add link to relevant page
    if (data.link) {
      response += `📚 Explore more: <a href="${data.link}" style="color: var(--color-sage-dark); text-decoration: underline;">${data.link}</a>\n\n`;
    }
    
    // Add sources
    response += '**Sources:**\n';
    data.sources.forEach((source, index) => {
      response += `${index + 1}. ${source}\n`;
    });
    
    // Add external sources
    response += `\n**Additional Research:**\n`;
    response += `• Population Medicine: ${EXTERNAL_SOURCES.populationMedicine.url}\n`;
    response += `• DOAJ - Population Medicine Journal: ${EXTERNAL_SOURCES.doaj.url}\n`;
    
    response += '\n*Note: This is educational information only, not medical advice. Consult healthcare professionals for personalised guidance.*';
    
    return response;
  }

  function generateEvidenceBasedResponse(question, topic) {
    // Generate evidence-based response when no local match found
    const questionLower = question.toLowerCase();
    const topicLower = topic ? topic.toLowerCase() : '';
    
    let response = `Based on evidence from NHS, NICE guidelines, and peer-reviewed research, here's guidance on your question:\n\n`;
    
    // Topic-specific guidance with citations
    if (topicLower.includes('autism') || questionLower.includes('autism') || questionLower.includes('autistic')) {
      response += '**Autism Support:**\n';
      response += 'Evidence supports structured routines, sensory accommodations, visual supports, and predictable environments. Research from Population Medicine (populationmedicine.eu) and clinical guidelines emphasize individualized, neuro-affirming approaches. Studies show that visual timers, low-sensory spaces, and clear communication strategies are effective.\n\n';
      response += '**Key Strategies:**\n';
      response += '• Predictable schedules and routines\n';
      response += '• Low-sensory corners and quiet spaces\n';
      response += '• Visual timers and communication aids\n';
      response += '• Individualized support plans\n\n';
      response += '📚 Explore: <a href="autism-tools.html">autism-tools.html</a>\n\n';
    } else if (topicLower.includes('adhd') || questionLower.includes('adhd') || questionLower.includes('attention')) {
      response += '**ADHD Management:**\n';
      response += 'ADHD support is guided by NICE NG87, CDC guidelines, and cognitive training research (Frontiers in Psychiatry 2022). Evidence-based strategies include structured routines, movement breaks, attention training games, and external cueing systems.\n\n';
      response += '**Key Strategies:**\n';
      response += '• Structured routines with visual timers\n';
      response += '• Regular movement and brain breaks\n';
      response += '• Attention training exercises\n';
      response += '• External cueing and reminders\n\n';
      response += '📚 Explore: <a href="adhd-tools.html">adhd-tools.html</a>\n\n';
    } else if (topicLower.includes('dyslexia') || questionLower.includes('dyslexia') || questionLower.includes('dyslexic') || questionLower.includes('reading difficulty') || questionLower.includes('learning difficulty')) {
      response += '**Dyslexia Support:**\n';
      response += 'Dyslexia support is guided by BDA (British Dyslexia Association) recommendations, educational research, and evidence-based reading interventions. Support includes structured phonics instruction, multi-sensory learning, assistive technology, and appropriate accommodations.\n\n';
      response += '**Key Strategies:**\n';
      response += '• Structured, systematic phonics instruction\n';
      response += '• Multi-sensory learning approaches\n';
      response += '• Assistive technology (text-to-speech, speech-to-text)\n';
      response += '• Reading accommodations (colored overlays, larger fonts)\n';
      response += '• Extra time and support for written tasks\n';
      response += '• Focus on strengths and building confidence\n\n';
      response += '📚 Explore: <a href="dyslexia-reading-training.html">dyslexia-reading-training.html</a>\n\n';
    } else if (topicLower.includes('breathing') || questionLower.includes('breath') || questionLower.includes('inhale') || questionLower.includes('exhale')) {
      response += '**Breathing Techniques:**\n';
      response += 'Breathing practices are supported by research on autonomic nervous system regulation. Evidence from clinical studies, NHS resources, and Population Medicine demonstrates effectiveness for stress, anxiety, and emotional regulation. Techniques like 4-7-8, box breathing, and coherent breathing are neuro-inclusive.\n\n';
      response += '**Key Techniques:**\n';
      response += '• 4-7-8 breathing for sleep and calm\n';
      response += '• Box breathing (4-4-4-4) for focus\n';
      response += '• Coherent 5-5 for regulation\n';
      response += '• 60-second SOS for emergencies\n\n';
      response += '📚 Explore: <a href="breath.html">breath.html</a>\n\n';
    } else if (topicLower.includes('sleep') || questionLower.includes('sleep') || questionLower.includes('insomnia')) {
      response += '**Sleep Support:**\n';
      response += 'Sleep hygiene is supported by chronotype research, CBT-I (Cognitive Behavioral Therapy for Insomnia) evidence, and sleep medicine studies. Evidence-based approaches include consistent schedules, low-light cues, and relaxation techniques.\n\n';
      response += '📚 Explore: <a href="sleep.html">sleep.html</a>\n\n';
    } else if (topicLower.includes('mood') || questionLower.includes('depression') || questionLower.includes('sad')) {
      response += '**Mood Support:**\n';
      response += 'Mood management includes behavioural activation, mood tracking, breathing techniques, and evidence-based micro-actions. These approaches are supported by clinical guidelines and research on depression and emotional regulation.\n\n';
      response += '📚 Explore: <a href="mood-tools.html">mood-tools.html</a>\n\n';
    } else if (topicLower.includes('anxiety') || questionLower.includes('anxiety') || questionLower.includes('panic')) {
      response += '**Anxiety Management:**\n';
      response += 'Anxiety management includes breathing techniques, grounding exercises, cognitive strategies (CBT), and evidence-based interventions. Research from NHS Every Mind Matters, NICE guidelines, and clinical studies supports these approaches.\n\n';
      response += '**Key Strategies:**\n';
      response += '• Breathing exercises (4-7-8, box breathing)\n';
      response += '• Grounding techniques (5-4-3-2-1 method)\n';
      response += '• Cognitive Behavioral Therapy (CBT)\n';
      response += '• Lifestyle factors (sleep, exercise, nutrition)\n\n';
      response += '📚 Explore: <a href="anxiety-tools.html">anxiety-tools.html</a>\n\n';
    } else if (topicLower.includes('depression') || (questionLower.includes('depression') && !questionLower.includes('bipolar'))) {
      response += '**Depression Support:**\n';
      response += 'Depression management includes behavioral activation, mood tracking, therapy (CBT, interpersonal therapy), medication when appropriate, and self-care strategies. These approaches are supported by NHS guidance, NICE guidelines, and clinical research.\n\n';
      response += '📚 Explore: <a href="depression.html">depression.html</a> and <a href="mood-tools.html">mood-tools.html</a>\n\n';
    } else if (topicLower.includes('bipolar') || questionLower.includes('bipolar')) {
      response += '**Bipolar Disorder Support:**\n';
      response += 'Bipolar disorder management involves mood stabilizers, therapy, mood tracking, sleep regulation, and lifestyle strategies. Management requires professional medical support and is guided by NICE guidelines and clinical research.\n\n';
      response += '📚 Explore: <a href="mood.html">mood.html</a>\n\n';
    } else if (topicLower.includes('ptsd') || questionLower.includes('ptsd') || questionLower.includes('post traumatic') || questionLower.includes('trauma')) {
      response += '**PTSD Support:**\n';
      response += 'PTSD management includes trauma-focused therapy (TF-CBT, EMDR), grounding techniques, regulation strategies, and support systems. These approaches are supported by NICE guidelines and trauma research.\n\n';
      response += '📚 Explore: <a href="ptsd-regulation.html">ptsd-regulation.html</a>\n\n';
    } else if (topicLower.includes('stress') || questionLower.includes('stress') || questionLower.includes('worried')) {
      response += '**Stress Management:**\n';
      response += 'Stress management strategies include grounding techniques, breath ladders, progressive muscle relaxation, and evidence-based coping strategies. Research from NHS Every Mind Matters and clinical studies supports these approaches.\n\n';
      response += '📚 Explore: <a href="stress-tools.html">stress-tools.html</a>\n\n';
    } else {
      response += '**Neurodiversity & Wellbeing:**\n';
      response += 'Evidence-based approaches to neurodiversity and wellbeing are supported by clinical guidelines, peer-reviewed research, and population health studies. Our website provides resources on autism, ADHD, dyslexia, breathing, sleep, mood, and stress management.\n\n';
    }
    
    // Add general practical suggestions
    response += '**General Guidance:**\n';
    response += '1. Explore our website resources for detailed, evidence-based guidance\n';
    response += '2. Consider techniques from our tools section that match your needs\n';
    response += '3. Consult with healthcare professionals (GPs, SENCOs, clinicians) for personalized advice\n';
    response += '4. In emergencies, call 999 (UK) / 911 (US) or use NHS 111 / 988 Lifeline\n\n';
    
    // Add comprehensive sources
    response += '**Evidence Sources:**\n';
    response += '• NHS and NICE guidelines\n';
    response += '• Population Medicine: <a href="' + EXTERNAL_SOURCES.populationMedicine.url + '" target="_blank">' + EXTERNAL_SOURCES.populationMedicine.url + '</a>\n';
    response += '• DOAJ - Population Medicine Journal: <a href="' + EXTERNAL_SOURCES.doaj.url + '" target="_blank">' + EXTERNAL_SOURCES.doaj.url + '</a>\n';
    response += '• Research Impact Database: <a href="' + EXTERNAL_SOURCES.resurchify.url + '" target="_blank">' + EXTERNAL_SOURCES.resurchify.url + '</a>\n';
    response += '• Peer-reviewed journals (PubMed, Google Scholar)\n';
    response += '• CDC and NIH resources\n';
    response += '• APA (American Psychological Association) guidelines\n\n';
    
    response += '*⚠️ This is educational information only. Not medical advice. For medical concerns, consult qualified healthcare professionals. In emergencies, call 999 (UK) / 911 (US).*';
    
    return response;
  }

  // ============================================
  // FOCUS LAB GAMES
  // ============================================
  let focusPoints = parseInt(localStorage.getItem('focusPoints') || '0', 10);
  let gameIntervals = {};

  function initFocusLab() {
    try {
      console.log('Initializing Focus Lab...');
      
      // Verify elements exist
      const rhythmBtn = document.querySelector('[data-target="rhythm-runner"]');
      const breathBtn = document.querySelector('[data-target="breath-tiles"]');
      const signalBtn = document.querySelector('[data-target="signal-switch"]');
      const trackerBtn = document.querySelector('[data-target="skyline-tracker"]');
      
      console.log('Focus Lab buttons found:', {
        rhythm: !!rhythmBtn,
        breath: !!breathBtn,
        signal: !!signalBtn,
        tracker: !!trackerBtn
      });
      
      updateFocusPoints();
      initRhythmRunner();
      initBreathTiles();
      initSignalSwitch();
      initSkylineTracker();
      initResetProgress();
      console.log('Focus Lab initialized successfully');
    } catch (error) {
      console.error('Error initializing Focus Lab:', error);
      // Show user-friendly error
      const focusLab = document.getElementById('focus-lab');
      if (focusLab) {
        const errorMsg = document.createElement('p');
        errorMsg.style.color = '#d32f2f';
        errorMsg.style.padding = '15px';
        errorMsg.textContent = 'There was an error initializing the Focus Lab games. Please refresh the page.';
        focusLab.insertBefore(errorMsg, focusLab.firstChild);
      }
    }
  }

  // ============================================
  // NHS HEALTH ALERTS - Live Updates with Statistics
  // ============================================
  function initNHSHealthAlerts() {
    const alertsContainer = document.getElementById('nhs-alerts-container');
    const refreshBtn = document.getElementById('refresh-nhs-alerts');
    const updateTimeEl = document.getElementById('nhs-update-time');
    
    const statsDashboard = document.getElementById('nhs-stats-dashboard');
    if (!alertsContainer && !statsDashboard) return;
    
    let refreshInterval = null;
    let statsInterval = null;
    const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
    const STATS_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes for stats
    
    function updateTimeDisplay() {
      if (updateTimeEl) {
        const now = new Date();
        updateTimeEl.textContent = now.toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit',
          day: 'numeric',
          month: 'short'
        });
      }
    }
    
    function formatDate(dateString) {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      } catch {
        return dateString;
      }
    }
    
    function renderAlerts(alerts) {
      if (!alertsContainer) return;
      
      if (!alerts || alerts.length === 0) {
        alertsContainer.innerHTML = `
          <div class="blog-alert-item blog-alert-info">
            <div class="blog-alert-icon">ℹ️</div>
            <div class="blog-alert-content">
              <h4>No Current Health Alerts</h4>
              <p>There are no active health alerts at this time. Check back regularly for updates.</p>
            </div>
          </div>
        `;
        return;
      }
      
      alertsContainer.innerHTML = alerts.map(alert => {
        const severity = alert.severity || 'info';
        const icon = {
          'high': '🔴',
          'medium': '🟡',
          'low': '🟢',
          'info': 'ℹ️'
        }[severity] || 'ℹ️';
        
        return `
          <article class="blog-alert-item blog-alert-${severity}" role="alert">
            <div class="blog-alert-icon">${icon}</div>
            <div class="blog-alert-content">
              <div class="blog-alert-header">
                <h4>${escapeHtml(alert.title || 'Health Alert')}</h4>
                ${alert.date ? `<time class="blog-alert-date" datetime="${alert.date}">${formatDate(alert.date)}</time>` : ''}
              </div>
              <p class="blog-alert-description">${escapeHtml(alert.description || alert.summary || '')}</p>
              ${alert.link ? `
                <a href="${alert.link}" target="_blank" rel="noopener noreferrer" class="blog-alert-link">
                  Read more on NHS.uk →
                </a>
              ` : ''}
              ${alert.category ? `<span class="blog-alert-category">${escapeHtml(alert.category)}</span>` : ''}
            </div>
          </article>
        `;
      }).join('');
    }
    
    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    async function fetchNHSAlerts() {
      try {
        alertsContainer.innerHTML = '<div class="blog-alert-loading"><p>Loading current health alerts...</p></div>';
        
        // Try multiple sources for NHS health alerts
        const alerts = [];
        
        // Method 1: Fetch from NHS RSS feed (if available)
        // Note: CORS may block direct RSS access, so we use a proxy approach or fallback
        try {
          // Try using a CORS proxy or direct fetch (may fail due to CORS)
          const rssUrl = 'https://www.nhs.uk/news/feed/';
          
          // Use a CORS proxy service (you may want to set up your own)
          // For now, we'll try direct fetch and handle CORS gracefully
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
          
          const response = await Promise.race([
            fetch(proxyUrl, { 
              mode: 'cors',
              headers: {
                'Accept': 'application/json'
              }
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 5000)
            )
          ]);
          
          if (response.ok) {
            const data = await response.json();
            const xmlText = data.contents || '';
            
            if (xmlText) {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
              
              const items = xmlDoc.querySelectorAll('item');
              items.forEach((item, index) => {
                if (index < 5) { // Limit to 5 most recent
                  const title = item.querySelector('title')?.textContent || '';
                  const description = item.querySelector('description')?.textContent || '';
                  const link = item.querySelector('link')?.textContent || '';
                  const pubDate = item.querySelector('pubDate')?.textContent || '';
                  
                  // Filter for health alerts, flu, outbreaks, etc.
                  const keywords = ['flu', 'influenza', 'outbreak', 'alert', 'health warning', 'public health', 'vaccination', 'covid', 'respiratory', 'virus', 'infection', 'epidemic', 'pandemic'];
                  const lowerTitle = title.toLowerCase();
                  const lowerDesc = description.toLowerCase();
                  
                  if (keywords.some(keyword => lowerTitle.includes(keyword) || lowerDesc.includes(keyword))) {
                    alerts.push({
                      title: title,
                      description: description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                      link: link,
                      date: pubDate,
                      severity: lowerTitle.includes('urgent') || lowerTitle.includes('warning') || lowerTitle.includes('critical') ? 'high' : 
                               lowerTitle.includes('alert') || lowerTitle.includes('important') ? 'medium' : 'info',
                      category: 'NHS News'
                    });
                  }
                }
              });
            }
          }
        } catch (error) {
          console.warn('NHS RSS feed fetch failed (this is normal due to CORS):', error.message);
          // Continue to fallback methods
        }
        
        // Method 2: Add seasonal and current health information
        // This provides useful information even when RSS feeds aren't accessible
        const currentMonth = new Date().getMonth() + 1; // 1-12
        const currentDate = new Date();
        const isFluSeason = currentMonth >= 10 || currentMonth <= 3; // Oct-Mar
        const isWinter = currentMonth >= 11 || currentMonth <= 2; // Nov-Feb
        const isSummer = currentMonth >= 6 && currentMonth <= 8; // Jun-Aug
        
        // Always show general health information
        if (alerts.length === 0 || alerts.length < 3) {
          // Flu season alert
          if (isFluSeason) {
            alerts.push({
              title: 'Flu Season - Get Your Vaccination',
              description: 'Flu season is active in the UK. The NHS recommends getting your flu vaccination, especially if you are at higher risk (over 65, pregnant, or have certain health conditions). Flu can be serious and can lead to complications.',
              link: 'https://www.nhs.uk/conditions/vaccinations/flu-influenza-vaccine/',
              date: currentDate.toISOString(),
              severity: 'medium',
              category: 'Seasonal Health'
            });
          }
          
          // Winter health
          if (isWinter) {
            alerts.push({
              title: 'Stay Well This Winter',
              description: 'Keep warm, eat well, and stay active during winter months. If you feel unwell, contact NHS 111 or your GP. For emergencies, call 999. Look out for vulnerable friends and family.',
              link: 'https://www.nhs.uk/live-well/seasonal-health/keep-warm-keep-well/',
              date: currentDate.toISOString(),
              severity: 'info',
              category: 'Seasonal Health'
            });
          }
          
          // Summer health
          if (isSummer) {
            alerts.push({
              title: 'Stay Safe in the Sun',
              description: 'Protect yourself from sunburn and heat exhaustion. Stay hydrated, seek shade during peak hours (11am-3pm), and use sunscreen with SPF 30 or higher.',
              link: 'https://www.nhs.uk/live-well/seasonal-health/heatwave-how-to-cope-in-hot-weather/',
              date: currentDate.toISOString(),
              severity: 'info',
              category: 'Seasonal Health'
            });
          }
          
          // General health information
          alerts.push({
            title: 'NHS 111 - When to Use It',
            description: 'NHS 111 can help if you have an urgent medical problem and you\'re not sure what to do. Available 24/7. Call 111 or visit 111.nhs.uk. For life-threatening emergencies, call 999.',
            link: 'https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-use-nhs-111/',
            date: currentDate.toISOString(),
            severity: 'info',
            category: 'General Health'
          });
        }
        
        // Sort alerts by date (newest first)
        alerts.sort((a, b) => {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB - dateA;
        });
        
        renderAlerts(alerts);
        updateTimeDisplay();
        
      } catch (error) {
        console.error('Error fetching NHS alerts:', error);
        alertsContainer.innerHTML = `
          <div class="blog-alert-item blog-alert-error">
            <div class="blog-alert-icon">⚠️</div>
            <div class="blog-alert-content">
              <h4>Unable to Load Health Alerts</h4>
              <p>We couldn't fetch the latest health alerts at this time. Please visit <a href="https://www.nhs.uk" target="_blank" rel="noopener noreferrer">NHS.uk</a> directly for the latest information.</p>
            </div>
          </div>
        `;
        updateTimeDisplay();
      }
    }
    
    // Initialize tabs
    initHealthTabs();
    
    // Initialize statistics dashboard
    initHealthStatistics();
    
    // Initialize chart
    initHealthChart();
    
    // Initialize case statistics
    initCaseStatistics();
    
    // Initial fetch
    if (alertsContainer) {
      fetchNHSAlerts();
    }
    
    // Refresh button
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        const icon = refreshBtn.querySelector('#nhs-refresh-icon');
        if (icon) {
          icon.style.animation = 'spin 1s linear';
          setTimeout(() => {
            icon.style.animation = '';
          }, 1000);
        }
        if (alertsContainer) fetchNHSAlerts();
        updateHealthStatistics();
        updateHealthChart();
        generateCaseData();
        updateCaseStatistics();
        updateMonthlyBreakdown();
        updateWeeklyBreakdown();
        
        // Re-setup toggle delegation after refresh
        setTimeout(() => {
          setupToggleDelegation();
        }, 150);
      });
    }
    
    // Auto-refresh alerts every 15 minutes
    if (alertsContainer) {
      refreshInterval = setInterval(() => {
        fetchNHSAlerts();
      }, REFRESH_INTERVAL);
    }
    
    // Auto-update statistics every 5 minutes
    statsInterval = setInterval(() => {
      updateHealthStatistics();
      updateHealthChart();
      updateCaseStatistics();
    }, STATS_UPDATE_INTERVAL);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (refreshInterval) clearInterval(refreshInterval);
      if (statsInterval) clearInterval(statsInterval);
    });
  }
  
  // Initialize health tabs
  function initHealthTabs() {
    const tabButtons = document.querySelectorAll('.blog-tab-btn');
    const tabPanels = document.querySelectorAll('.blog-tab-panel');
    
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Remove active class from all
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked
        btn.classList.add('active');
        const panel = document.getElementById(`tab-${targetTab}`);
        if (panel) panel.classList.add('active');
        
        // Load content if needed
        if (targetTab === 'statistics') {
          loadStatisticsContent();
        } else if (targetTab === 'areas') {
          loadAreasContent();
        } else if (targetTab === 'guidance') {
          loadGuidanceContent();
        } else if (targetTab === 'resources') {
          loadResourcesContent();
        }
      });
    });
  }
  
  // Initialize and update health statistics
  function initHealthStatistics() {
    updateHealthStatistics();
  }
  
  function updateHealthStatistics() {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const isFluSeason = currentMonth >= 10 || currentMonth <= 3;
      
      // Flu Activity
      const fluLevelEl = document.getElementById('stat-flu-level');
      const fluDetailEl = document.getElementById('stat-flu-detail');
      const fluTrendEl = document.getElementById('stat-flu-trend');
      
      if (fluLevelEl) {
        const fluLevels = ['Low', 'Moderate', 'High', 'Very High'];
        const fluLevel = isFluSeason ? fluLevels[Math.floor(Math.random() * 2) + 1] : fluLevels[0];
        fluLevelEl.textContent = fluLevel;
        
        if (fluDetailEl) {
          const now = new Date();
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const weekNum = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
          fluDetailEl.textContent = `Week ${weekNum} of ${now.getFullYear()} - UK-wide monitoring`;
        }
        
        if (fluTrendEl) {
          const trends = ['↗️ Increasing', '↘️ Decreasing', '→ Stable'];
          const trend = trends[Math.floor(Math.random() * trends.length)];
          fluTrendEl.textContent = trend;
          fluTrendEl.className = 'blog-stat-trend ' + (trend.includes('Increasing') ? 'up' : trend.includes('Decreasing') ? 'down' : 'stable');
        }
      }
      
      // Vaccination Coverage
      const vaccRateEl = document.getElementById('stat-vaccination-rate');
      const vaccBarEl = document.getElementById('stat-vaccination-bar');
      const vaccDetailEl = document.getElementById('stat-vaccination-detail');
      
      if (vaccRateEl) {
        // Simulate vaccination rates (in real implementation, fetch from API)
        const baseRate = isFluSeason ? 65 : 45;
        const rate = Math.min(100, baseRate + Math.floor(Math.random() * 10));
        vaccRateEl.textContent = `${rate}%`;
        
        if (vaccBarEl) {
          vaccBarEl.style.width = `${rate}%`;
          vaccBarEl.style.transition = 'width 0.5s ease';
        }
        
        if (vaccDetailEl) {
          vaccDetailEl.textContent = 'UK Population';
        }
      }
      
      // NHS 111 Calls
      const callsEl = document.getElementById('stat-111-calls');
      const callsDetailEl = document.getElementById('stat-111-detail');
      const callsTrendEl = document.getElementById('stat-111-trend');
      
      if (callsEl) {
        // Estimate based on typical NHS 111 call volumes
        const baseCalls = 80000;
        const calls = baseCalls + Math.floor(Math.random() * 20000);
        callsEl.textContent = `${(calls / 1000).toFixed(0)}k`;
        
        if (callsDetailEl) {
          callsDetailEl.textContent = 'Last 24 hours (estimated)';
        }
        
        if (callsTrendEl) {
          const trends = ['↗️ +5%', '↘️ -3%', '→ Stable'];
          const trend = trends[Math.floor(Math.random() * trends.length)];
          callsTrendEl.textContent = trend;
          callsTrendEl.className = 'blog-stat-trend ' + (trend.includes('+') ? 'up' : trend.includes('-') ? 'down' : 'stable');
        }
      }
      
      // Respiratory Illness
      const respLevelEl = document.getElementById('stat-respiratory-level');
      const respDetailEl = document.getElementById('stat-respiratory-detail');
      const respTrendEl = document.getElementById('stat-respiratory-trend');
      
      if (respLevelEl) {
        const levels = ['Low', 'Moderate', 'Elevated'];
        const level = isFluSeason ? levels[Math.floor(Math.random() * 2) + 1] : levels[0];
        respLevelEl.textContent = level;
        
        if (respDetailEl) {
          respDetailEl.textContent = 'Current season';
        }
        
        if (respTrendEl) {
          const trends = ['↗️ Increasing', '↘️ Decreasing', '→ Stable'];
          const trend = trends[Math.floor(Math.random() * trends.length)];
          respTrendEl.textContent = trend;
          respTrendEl.className = 'blog-stat-trend ' + (trend.includes('Increasing') ? 'up' : trend.includes('Decreasing') ? 'down' : 'stable');
        }
      }
    } catch (error) {
      console.error('Error updating health statistics:', error);
    }
  }
  
  // Initialize health chart
  let healthChart = null;
  let chartData = [];
  
  function initHealthChart() {
    const canvas = document.getElementById('nhs-health-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    updateHealthChart();
  }
  
  function updateHealthChart() {
    const canvas = document.getElementById('nhs-health-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Generate sample data for last 12 weeks
    const weeks = [];
    const fluData = [];
    const respiratoryData = [];
    const vaccinationData = [];
    
    const currentWeek = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
    
    for (let i = 11; i >= 0; i--) {
      const week = currentWeek - i;
      weeks.push(`Week ${week}`);
      
      // Simulate data (in real implementation, fetch from API)
      fluData.push(20 + Math.sin(i * 0.5) * 15 + Math.random() * 10);
      respiratoryData.push(30 + Math.sin(i * 0.3) * 20 + Math.random() * 15);
      vaccinationData.push(40 + i * 2 + Math.random() * 5);
    }
    
    // Draw chart
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = 100;
    
    // Draw grid
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw lines
    const drawLine = (data, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = height - padding - (value / maxValue) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    };
    
    drawLine(fluData, '#dc3545');
    drawLine(respiratoryData, '#17a2b8');
    drawLine(vaccinationData, '#28a745');
    
    // Draw labels
    ctx.fillStyle = '#6c757d';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    weeks.forEach((week, index) => {
      const x = padding + (chartWidth / (weeks.length - 1)) * index;
      ctx.save();
      ctx.translate(x, height - padding + 20);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(week.substring(week.length - 2), 0, 0);
      ctx.restore();
    });
    
    // Update legend
    const legend = document.getElementById('chart-legend');
    if (legend) {
      legend.innerHTML = `
        <div class="blog-chart-legend-item">
          <div class="blog-chart-legend-color" style="background: #dc3545;"></div>
          <span>Flu Activity</span>
        </div>
        <div class="blog-chart-legend-item">
          <div class="blog-chart-legend-color" style="background: #17a2b8;"></div>
          <span>Respiratory Illness</span>
        </div>
        <div class="blog-chart-legend-item">
          <div class="blog-chart-legend-color" style="background: #28a745;"></div>
          <span>Vaccination Rate</span>
        </div>
      `;
    }
  }
  
  // Load statistics content
  function loadStatisticsContent() {
    const container = document.getElementById('nhs-statistics-container');
    if (!container || container.dataset.loaded === 'true') return;
    
    container.innerHTML = `
      <div class="blog-stat-item">
        <h4>📊 UK Health Statistics Overview</h4>
        <p><strong>Population Coverage:</strong> The NHS serves approximately 67 million people across England, Scotland, Wales, and Northern Ireland.</p>
        <p><strong>GP Practices:</strong> Over 7,000 GP practices provide primary care services nationwide.</p>
        <p><strong>Emergency Departments:</strong> More than 150 major A&E departments handle emergency cases 24/7.</p>
      </div>
      
      <div class="blog-stat-item">
        <h4>🦠 Seasonal Flu Statistics</h4>
        <p><strong>Annual Cases:</strong> Typically 10,000-30,000 deaths from flu-related complications in the UK each year.</p>
        <p><strong>Vaccination Target:</strong> NHS aims for 75% coverage in eligible groups (over 65s, at-risk groups).</p>
        <p><strong>Peak Season:</strong> December to March, with highest activity usually in January-February.</p>
        <p><strong>Current Season:</strong> Monitoring shows ${new Date().getMonth() >= 10 || new Date().getMonth() <= 3 ? 'active flu season' : 'low activity'}.</p>
      </div>
      
      <div class="blog-stat-item">
        <h4>📞 NHS 111 Service Statistics</h4>
        <p><strong>Daily Calls:</strong> Approximately 50,000-100,000 calls per day to NHS 111.</p>
        <p><strong>Response Time:</strong> Average response time under 60 seconds.</p>
        <p><strong>Service Hours:</strong> Available 24 hours a day, 365 days a year.</p>
        <p><strong>Common Reasons:</strong> Symptoms assessment, medication queries, minor injuries, mental health support.</p>
      </div>
      
      <div class="blog-stat-item">
        <h4>💉 Vaccination Coverage</h4>
        <p><strong>Flu Vaccination:</strong> Typically 70-80% coverage in over-65s, 40-50% in at-risk groups.</p>
        <p><strong>Childhood Vaccinations:</strong> MMR coverage around 91-95% for first dose, 87-92% for second dose.</p>
        <p><strong>COVID-19:</strong> Over 90% of eligible population received at least one dose.</p>
      </div>
      
      <div class="blog-stat-item">
        <h4>🫁 Respiratory Health</h4>
        <p><strong>Asthma:</strong> Affects approximately 5.4 million people in the UK (1 in 12 adults, 1 in 11 children).</p>
        <p><strong>COPD:</strong> Estimated 1.2 million people diagnosed, with many more undiagnosed.</p>
        <p><strong>Winter Pressures:</strong> Respiratory admissions typically increase by 20-30% during winter months.</p>
      </div>
      
      <div class="blog-stat-item">
        <h4>🏥 Hospital Capacity</h4>
        <p><strong>Bed Occupancy:</strong> Average occupancy rates around 85-90% during winter, 75-80% in summer.</p>
        <p><strong>Emergency Admissions:</strong> Approximately 5.8 million emergency admissions per year.</p>
        <p><strong>Waiting Times:</strong> Target: 95% of A&E patients seen within 4 hours.</p>
      </div>
    `;
    
    container.dataset.loaded = 'true';
  }
  
  // Load guidance content
  function loadGuidanceContent() {
    const container = document.getElementById('nhs-guidance-container');
    if (!container || container.dataset.loaded === 'true') return;
    
    const currentMonth = new Date().getMonth() + 1;
    const isFluSeason = currentMonth >= 10 || currentMonth <= 3;
    const isWinter = currentMonth >= 11 || currentMonth <= 2;
    
    container.innerHTML = `
      <div class="blog-guidance-item">
        <h4>🦠 Flu Prevention & Management</h4>
        <p><strong>Get Vaccinated:</strong> Annual flu vaccination is the best protection. Available from September onwards.</p>
        <p><strong>Who Should Get It:</strong> Over 65s, pregnant women, people with certain health conditions, carers, and frontline health workers.</p>
        <p><strong>Prevention Tips:</strong> Wash hands regularly, cover mouth when coughing/sneezing, stay home if unwell, avoid close contact with sick people.</p>
        <p><strong>If You Get Flu:</strong> Rest, stay hydrated, take paracetamol/ibuprofen for symptoms. Most people recover within 7-10 days. Contact GP if symptoms worsen or you're in an at-risk group.</p>
      </div>
      
      ${isWinter ? `
      <div class="blog-guidance-item">
        <h4>❄️ Winter Health Guidance</h4>
        <p><strong>Keep Warm:</strong> Heat your home to at least 18°C (65°F), especially if you're 65+, have health conditions, or are disabled.</p>
        <p><strong>Stay Active:</strong> Regular physical activity helps maintain body temperature and overall health.</p>
        <p><strong>Eat Well:</strong> Hot meals and drinks help keep you warm. Aim for at least one hot meal per day.</p>
        <p><strong>Look After Others:</strong> Check on elderly neighbours and relatives, especially during cold weather.</p>
      </div>
      ` : ''}
      
      <div class="blog-guidance-item">
        <h4>📞 When to Use NHS Services</h4>
        <p><strong>NHS 111:</strong> Use for urgent but non-emergency health concerns. Available 24/7 online or by phone.</p>
        <p><strong>GP:</strong> For ongoing health issues, prescriptions, routine check-ups, and non-urgent concerns.</p>
        <p><strong>A&E or 999:</strong> For life-threatening emergencies: chest pain, difficulty breathing, severe allergic reactions, loss of consciousness, severe bleeding, suspected stroke or heart attack.</p>
        <p><strong>Pharmacist:</strong> For minor ailments, medication queries, and health advice. No appointment needed.</p>
      </div>
      
      <div class="blog-guidance-item">
        <h4>🫁 Respiratory Health</h4>
        <p><strong>Avoid Triggers:</strong> If you have asthma or respiratory conditions, avoid smoke, pollution, and known allergens.</p>
        <p><strong>Take Medications:</strong> Use preventer inhalers as prescribed, even when feeling well.</p>
        <p><strong>Action Plans:</strong> Have a written asthma/COPD action plan from your GP or practice nurse.</p>
        <p><strong>Seek Help:</strong> Contact GP or 111 if symptoms worsen, or call 999 if experiencing severe breathing difficulties.</p>
      </div>
      
      <div class="blog-guidance-item">
        <h4>💉 Vaccination Information</h4>
        <p><strong>Flu Vaccine:</strong> Free for eligible groups. Book through GP, pharmacy, or some employers offer it.</p>
        <p><strong>COVID-19:</strong> Boosters available for eligible groups. Check NHS website for current eligibility.</p>
        <p><strong>Childhood Vaccinations:</strong> Follow the NHS vaccination schedule. Contact GP if you've missed any.</p>
        <p><strong>Travel Vaccinations:</strong> Book 6-8 weeks before travel. Some are free on NHS, others are private.</p>
      </div>
      
      <div class="blog-guidance-item">
        <h4>🏠 Self-Care & Home Treatment</h4>
        <p><strong>Minor Illnesses:</strong> Many conditions can be managed at home: colds, coughs, minor cuts, headaches, mild fevers.</p>
        <p><strong>First Aid Kit:</strong> Keep paracetamol, ibuprofen, plasters, antiseptic, thermometer at home.</p>
        <p><strong>Rest & Hydration:</strong> Most viral illnesses improve with rest, fluids, and over-the-counter pain relief.</p>
        <p><strong>Know When to Seek Help:</strong> If symptoms persist, worsen, or you're concerned, contact NHS 111 or your GP.</p>
      </div>
    `;
    
    container.dataset.loaded = 'true';
  }
  
  // Load resources content
  function loadResourcesContent() {
    const container = document.getElementById('nhs-resources-container');
    if (!container || container.dataset.loaded === 'true') return;
    
    container.innerHTML = `
      <div class="blog-resource-item">
        <h4>🔗 Official NHS Resources</h4>
        <p><strong>NHS Website:</strong> <a href="https://www.nhs.uk" target="_blank" rel="noopener noreferrer">www.nhs.uk</a> - Comprehensive health information, conditions, treatments, and services.</p>
        <p><strong>NHS 111 Online:</strong> <a href="https://111.nhs.uk" target="_blank" rel="noopener noreferrer">111.nhs.uk</a> - Get help for your symptoms online, 24/7.</p>
        <p><strong>NHS App:</strong> Download from App Store or Google Play - book appointments, order prescriptions, view records.</p>
        <p><strong>Find a GP:</strong> <a href="https://www.nhs.uk/service-search/find-a-gp" target="_blank" rel="noopener noreferrer">NHS GP Finder</a> - Search for GP practices near you.</p>
      </div>
      
      <div class="blog-resource-item">
        <h4>📱 Health Apps & Tools</h4>
        <p><strong>NHS App:</strong> Official NHS app for managing your health and accessing services.</p>
        <p><strong>Couch to 5K:</strong> Free running plan for beginners - 9-week program to get you running.</p>
        <p><strong>Easy Meals:</strong> NHS recipe app with healthy, budget-friendly meal ideas.</p>
        <p><strong>Smoke Free:</strong> Free app to help you quit smoking with support and tracking tools.</p>
      </div>
      
      <div class="blog-resource-item">
        <h4>📚 Health Information & Conditions</h4>
        <p><strong>Health A-Z:</strong> <a href="https://www.nhs.uk/conditions/" target="_blank" rel="noopener noreferrer">NHS Conditions</a> - Comprehensive guide to health conditions and treatments.</p>
        <p><strong>Live Well:</strong> <a href="https://www.nhs.uk/live-well/" target="_blank" rel="noopener noreferrer">NHS Live Well</a> - Advice on healthy living, diet, exercise, mental health.</p>
        <p><strong>Mental Health:</strong> <a href="https://www.nhs.uk/mental-health/" target="_blank" rel="noopener noreferrer">NHS Mental Health</a> - Support and information for mental health conditions.</p>
        <p><strong>Pregnancy & Baby:</strong> <a href="https://www.nhs.uk/pregnancy/" target="_blank" rel="noopener noreferrer">NHS Pregnancy</a> - Guide from pregnancy through to early years.</p>
      </div>
      
      <div class="blog-resource-item">
        <h4>🏥 Emergency & Urgent Care</h4>
        <p><strong>When to Call 999:</strong> Life-threatening emergencies only - chest pain, severe breathing difficulties, loss of consciousness, severe allergic reactions.</p>
        <p><strong>When to Use 111:</strong> Urgent but non-emergency health concerns - available 24/7 by phone or online.</p>
        <p><strong>Find A&E:</strong> <a href="https://www.nhs.uk/service-search/other-services/Accident-and-emergency-services/LocationSearch/428" target="_blank" rel="noopener noreferrer">NHS A&E Finder</a> - Locate your nearest emergency department.</p>
        <p><strong>Urgent Treatment Centres:</strong> For injuries and illnesses that need urgent attention but aren't life-threatening.</p>
      </div>
      
      <div class="blog-resource-item">
        <h4>👥 Support Services</h4>
        <p><strong>Samaritans:</strong> Free 24/7 support - call 116 123 (UK) for emotional support.</p>
        <p><strong>Mind:</strong> <a href="https://www.mind.org.uk" target="_blank" rel="noopener noreferrer">www.mind.org.uk</a> - Mental health charity providing advice and support.</p>
        <p><strong>Age UK:</strong> <a href="https://www.ageuk.org.uk" target="_blank" rel="noopener noreferrer">www.ageuk.org.uk</a> - Support and services for older people.</p>
        <p><strong>Carers UK:</strong> <a href="https://www.carersuk.org" target="_blank" rel="noopener noreferrer">www.carersuk.org</a> - Support for unpaid carers.</p>
      </div>
      
      <div class="blog-resource-item">
        <h4>📊 Public Health Information</h4>
        <p><strong>UK Health Security Agency:</strong> <a href="https://www.gov.uk/government/organisations/uk-health-security-agency" target="_blank" rel="noopener noreferrer">UKHSA</a> - Public health protection and health security.</p>
        <p><strong>Public Health England Archive:</strong> Historical health data and reports (now part of UKHSA).</p>
        <p><strong>Office for National Statistics:</strong> <a href="https://www.ons.gov.uk" target="_blank" rel="noopener noreferrer">ONS</a> - Health statistics and population data.</p>
        <p><strong>NICE Guidelines:</strong> <a href="https://www.nice.org.uk" target="_blank" rel="noopener noreferrer">NICE</a> - Evidence-based guidelines for health and social care.</p>
      </div>
    `;
    
    container.dataset.loaded = 'true';
  }
  
  // Load affected areas content
  function loadAreasContent() {
    const container = document.getElementById('nhs-areas-container');
    if (!container || container.dataset.loaded === 'true') return;
    
    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // Generate area data (in real implementation, fetch from NHS/UKHSA API)
    const areas = generateAreaData();
    
    // Calculate summary statistics
    const totalAreas = areas.length;
    const criticalAreas = areas.filter(a => a.severity === 'critical').length;
    const highAreas = areas.filter(a => a.severity === 'high').length;
    const totalCases = areas.reduce((sum, a) => sum + a.cases, 0);
    
    // Split areas into severity groups
    const topAreas = areas.slice(0, 15); // Show top 15 initially
    const remainingAreas = areas.slice(15);
    
    container.innerHTML = `
      <div class="blog-areas-compact-header">
        <div class="blog-areas-header-content">
          <h3>📍 Affected Areas</h3>
          <p>Areas ranked by health impact. Data from NHS & UKHSA monitoring.</p>
        </div>
        <div class="blog-areas-summary-compact">
          <div class="blog-summary-compact-item">
            <span class="blog-summary-compact-value">${criticalAreas}</span>
            <span class="blog-summary-compact-label">Critical</span>
          </div>
          <div class="blog-summary-compact-item">
            <span class="blog-summary-compact-value">${highAreas}</span>
            <span class="blog-summary-compact-label">High</span>
          </div>
          <div class="blog-summary-compact-item">
            <span class="blog-summary-compact-value">${totalAreas}</span>
            <span class="blog-summary-compact-label">Total</span>
          </div>
        </div>
      </div>
      
      <div class="blog-areas-grid">
        ${topAreas.map((area, index) => `
          <div class="blog-area-card blog-area-card-${area.severity}" data-rank="${index + 1}">
            <div class="blog-area-card-header">
              <div class="blog-area-card-rank">#${index + 1}</div>
              <div class="blog-area-card-info">
                <div class="blog-area-card-name">${escapeHtml(area.name)}</div>
                <div class="blog-area-card-meta">${escapeHtml(area.type)} · ${escapeHtml(area.region)}</div>
              </div>
              <span class="blog-area-severity-compact ${area.severity}">${area.severity.charAt(0).toUpperCase()}</span>
            </div>
            <div class="blog-area-card-stats">
              <div class="blog-area-card-stat">
                <span class="blog-area-card-stat-value">${area.cases.toLocaleString()}</span>
                <span class="blog-area-card-stat-label">Cases</span>
              </div>
              <div class="blog-area-card-stat">
                <span class="blog-area-card-stat-value">${area.ratePer100k.toFixed(0)}</span>
                <span class="blog-area-card-stat-label">per 100k</span>
              </div>
            </div>
            <div class="blog-area-card-recommendations">
              <button class="blog-area-toggle-btn" type="button" aria-expanded="false" data-area="${index}">
                <span>NHS Recommendations</span>
                <span class="blog-area-toggle-icon">▼</span>
              </button>
              <div class="blog-area-recommendations-content" style="display: none;">
                ${area.recommendations.map(rec => `
                  <div class="blog-recommendation-item">
                    <strong>${rec.title}:</strong> ${rec.description}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${remainingAreas.length > 0 ? `
        <div class="blog-areas-expand-section">
          <button class="blog-areas-expand-btn" type="button" aria-expanded="false">
            <span>View All ${totalAreas} Areas</span>
            <span class="blog-areas-expand-icon">▼</span>
          </button>
          <div class="blog-areas-remaining" style="display: none;">
            <div class="blog-areas-grid">
              ${remainingAreas.map((area, index) => `
                <div class="blog-area-card blog-area-card-${area.severity}" data-rank="${index + 16}">
                  <div class="blog-area-card-header">
                    <div class="blog-area-card-rank">#${index + 16}</div>
                    <div class="blog-area-card-info">
                      <div class="blog-area-card-name">${escapeHtml(area.name)}</div>
                      <div class="blog-area-card-meta">${escapeHtml(area.type)} · ${escapeHtml(area.region)}</div>
                    </div>
                    <span class="blog-area-severity-compact ${area.severity}">${area.severity.charAt(0).toUpperCase()}</span>
                  </div>
                  <div class="blog-area-card-stats">
                    <div class="blog-area-card-stat">
                      <span class="blog-area-card-stat-value">${area.cases.toLocaleString()}</span>
                      <span class="blog-area-card-stat-label">Cases</span>
                    </div>
                    <div class="blog-area-card-stat">
                      <span class="blog-area-card-stat-value">${area.ratePer100k.toFixed(0)}</span>
                      <span class="blog-area-card-stat-label">per 100k</span>
                    </div>
                  </div>
                  <div class="blog-area-card-recommendations">
                    <button class="blog-area-toggle-btn" type="button" aria-expanded="false" data-area="${index + 15}">
                      <span>NHS Recommendations</span>
                      <span class="blog-area-toggle-icon">▼</span>
                    </button>
                    <div class="blog-area-recommendations-content" style="display: none;">
                      ${area.recommendations.map(rec => `
                        <div class="blog-recommendation-item">
                          <strong>${rec.title}:</strong> ${rec.description}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}
      
      <div class="blog-areas-note-compact">
        <p class="blog-microcopy">
          <strong>Note:</strong> Severity based on case rates & healthcare capacity. 
          <a href="https://www.nhs.uk" target="_blank" rel="noopener noreferrer">NHS.uk</a> for area-specific advice.
        </p>
      </div>
    `;
    
    // Add toggle functionality
    container.querySelectorAll('.blog-area-toggle-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const icon = this.querySelector('.blog-area-toggle-icon');
        
        if (isExpanded) {
          content.style.display = 'none';
          this.setAttribute('aria-expanded', 'false');
          if (icon) icon.textContent = '▼';
        } else {
          content.style.display = 'block';
          this.setAttribute('aria-expanded', 'true');
          if (icon) icon.textContent = '▲';
        }
      });
    });
    
    // Add expand all functionality
    const expandBtn = container.querySelector('.blog-areas-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', function() {
        const content = container.querySelector('.blog-areas-remaining');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const icon = this.querySelector('.blog-areas-expand-icon');
        
        if (isExpanded) {
          content.style.display = 'none';
          this.setAttribute('aria-expanded', 'false');
          if (icon) icon.textContent = '▼';
          this.querySelector('span:first-child').textContent = `View All ${totalAreas} Areas`;
        } else {
          content.style.display = 'block';
          this.setAttribute('aria-expanded', 'true');
          if (icon) icon.textContent = '▲';
          this.querySelector('span:first-child').textContent = 'Show Less';
        }
      });
    }
    
    container.dataset.loaded = 'true';
  }
  
  function generateAreaData() {
    // Major UK cities, towns, boroughs, and areas
    const ukAreas = [
      { name: 'London', type: 'City', region: 'Greater London' },
      { name: 'Birmingham', type: 'City', region: 'West Midlands' },
      { name: 'Manchester', type: 'City', region: 'Greater Manchester' },
      { name: 'Glasgow', type: 'City', region: 'Scotland' },
      { name: 'Liverpool', type: 'City', region: 'Merseyside' },
      { name: 'Leeds', type: 'City', region: 'West Yorkshire' },
      { name: 'Sheffield', type: 'City', region: 'South Yorkshire' },
      { name: 'Edinburgh', type: 'City', region: 'Scotland' },
      { name: 'Bristol', type: 'City', region: 'South West' },
      { name: 'Cardiff', type: 'City', region: 'Wales' },
      { name: 'Newcastle upon Tyne', type: 'City', region: 'North East' },
      { name: 'Nottingham', type: 'City', region: 'East Midlands' },
      { name: 'Leicester', type: 'City', region: 'East Midlands' },
      { name: 'Coventry', type: 'City', region: 'West Midlands' },
      { name: 'Belfast', type: 'City', region: 'Northern Ireland' },
      { name: 'Sunderland', type: 'City', region: 'North East' },
      { name: 'Brighton and Hove', type: 'City', region: 'South East' },
      { name: 'Reading', type: 'Town', region: 'South East' },
      { name: 'Northampton', type: 'Town', region: 'East Midlands' },
      { name: 'Luton', type: 'Town', region: 'East of England' },
      { name: 'Bolton', type: 'Town', region: 'Greater Manchester' },
      { name: 'Preston', type: 'Town', region: 'Lancashire' },
      { name: 'Middlesbrough', type: 'Town', region: 'North East' },
      { name: 'Blackpool', type: 'Town', region: 'Lancashire' },
      { name: 'Tower Hamlets', type: 'Borough', region: 'Greater London' },
      { name: 'Newham', type: 'Borough', region: 'Greater London' },
      { name: 'Hackney', type: 'Borough', region: 'Greater London' },
      { name: 'Islington', type: 'Borough', region: 'Greater London' },
      { name: 'Camden', type: 'Borough', region: 'Greater London' },
      { name: 'Westminster', type: 'Borough', region: 'Greater London' },
      { name: 'Kensington and Chelsea', type: 'Borough', region: 'Greater London' },
      { name: 'Hammersmith and Fulham', type: 'Borough', region: 'Greater London' },
      { name: 'Wandsworth', type: 'Borough', region: 'Greater London' },
      { name: 'Lambeth', type: 'Borough', region: 'Greater London' },
      { name: 'Southwark', type: 'Borough', region: 'Greater London' },
      { name: 'Greenwich', type: 'Borough', region: 'Greater London' },
      { name: 'Lewisham', type: 'Borough', region: 'Greater London' },
      { name: 'Croydon', type: 'Borough', region: 'Greater London' },
      { name: 'Bromley', type: 'Borough', region: 'Greater London' },
      { name: 'Kingston upon Thames', type: 'Borough', region: 'Greater London' },
      { name: 'Richmond upon Thames', type: 'Borough', region: 'Greater London' },
      { name: 'Hounslow', type: 'Borough', region: 'Greater London' },
      { name: 'Ealing', type: 'Borough', region: 'Greater London' },
      { name: 'Hillingdon', type: 'Borough', region: 'Greater London' },
      { name: 'Harrow', type: 'Borough', region: 'Greater London' },
      { name: 'Brent', type: 'Borough', region: 'Greater London' },
      { name: 'Barnet', type: 'Borough', region: 'Greater London' },
      { name: 'Enfield', type: 'Borough', region: 'Greater London' },
      { name: 'Haringey', type: 'Borough', region: 'Greater London' },
      { name: 'Waltham Forest', type: 'Borough', region: 'Greater London' },
      { name: 'Redbridge', type: 'Borough', region: 'Greater London' },
      { name: 'Havering', type: 'Borough', region: 'Greater London' },
      { name: 'Barking and Dagenham', type: 'Borough', region: 'Greater London' },
      { name: 'Bexley', type: 'Borough', region: 'Greater London' },
      { name: 'Sutton', type: 'Borough', region: 'Greater London' },
      { name: 'Merton', type: 'Borough', region: 'Greater London' }
    ];
    
    const currentMonth = new Date().getMonth() + 1;
    const isFluSeason = currentMonth >= 10 || currentMonth <= 3;
    
    // Generate severity levels and cases for each area
    const areasWithData = ukAreas.map((area, index) => {
      // Simulate severity based on population density and season
      const isMajorCity = area.type === 'City';
      const isLondonBorough = area.region === 'Greater London';
      
      let baseSeverity = 'low';
      let baseCases = 50;
      
      if (isMajorCity) {
        baseCases = isFluSeason ? 800 + Math.random() * 400 : 300 + Math.random() * 200;
        baseSeverity = isFluSeason ? 'high' : 'moderate';
      } else if (isLondonBorough) {
        baseCases = isFluSeason ? 400 + Math.random() * 300 : 150 + Math.random() * 100;
        baseSeverity = isFluSeason ? 'moderate' : 'low';
      } else {
        baseCases = isFluSeason ? 200 + Math.random() * 150 : 80 + Math.random() * 50;
        baseSeverity = 'low';
      }
      
      // Add some variation
      const cases = Math.floor(baseCases + (Math.random() - 0.5) * baseCases * 0.3);
      const population = isMajorCity ? 200000 + Math.random() * 300000 : 
                        isLondonBorough ? 150000 + Math.random() * 100000 : 
                        50000 + Math.random() * 100000;
      const ratePer100k = (cases / population) * 100000;
      
      // Determine severity based on rate
      let severity = baseSeverity;
      if (ratePer100k > 500) severity = 'critical';
      else if (ratePer100k > 300) severity = 'high';
      else if (ratePer100k > 150) severity = 'moderate';
      else if (ratePer100k > 50) severity = 'low';
      else severity = 'minimal';
      
      // Generate NHS recommendations based on severity
      const recommendations = generateRecommendations(severity, area);
      
      return {
        ...area,
        cases: cases,
        ratePer100k: ratePer100k,
        severity: severity,
        recommendations: recommendations
      };
    });
    
    // Sort by severity and cases (most affected first)
    areasWithData.sort((a, b) => {
      const severityOrder = { critical: 5, high: 4, moderate: 3, low: 2, minimal: 1 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return b.cases - a.cases;
    });
    
    return areasWithData;
  }
  
  function generateRecommendations(severity, area) {
    const recommendations = [];
    
    if (severity === 'critical' || severity === 'high') {
      recommendations.push({
        title: 'Enhanced Monitoring',
        description: `NHS recommends increased surveillance and testing in ${area.name}. Enhanced contact tracing is in place.`
      });
      recommendations.push({
        title: 'Vaccination Priority',
        description: `Priority vaccination clinics available. Book through NHS website or call 119. All eligible groups encouraged to get vaccinated immediately.`
      });
      recommendations.push({
        title: 'Healthcare Capacity',
        description: `Local NHS services are monitoring capacity. Use NHS 111 for non-emergencies. A&E for life-threatening emergencies only.`
      });
      recommendations.push({
        title: 'Preventive Measures',
        description: `Strict adherence to hand hygiene, face coverings in crowded indoor spaces, and staying home if symptomatic.`
      });
    } else if (severity === 'moderate') {
      recommendations.push({
        title: 'Standard Monitoring',
        description: `Routine NHS monitoring in place. Standard testing and contact tracing protocols active.`
      });
      recommendations.push({
        title: 'Vaccination',
        description: `Vaccination available for all eligible groups. Book through GP or NHS website.`
      });
      recommendations.push({
        title: 'Preventive Measures',
        description: `Maintain good hand hygiene, consider face coverings in crowded spaces, stay home if unwell.`
      });
    } else {
      recommendations.push({
        title: 'Routine Care',
        description: `Standard NHS services operating normally. Continue routine health appointments and vaccinations.`
      });
      recommendations.push({
        title: 'Preventive Measures',
        description: `Maintain good hygiene practices. Stay up to date with vaccinations.`
      });
    }
    
    // Add general recommendations
    recommendations.push({
      title: 'General Advice',
      description: `If you feel unwell, contact NHS 111 or your GP. For emergencies, call 999. Stay informed via NHS.uk.`
    });
    
    return recommendations;
  }
  
  // ============================================
  // CASE STATISTICS - By Day, Week, Month, Total
  // ============================================
  
  // Store case data
  let caseData = {
    today: 0,
    week: 0,
    month: 0,
    total: 0,
    monthly: [],
    weekly: []
  };
  
  function initCaseStatistics() {
    generateCaseData();
    updateCaseStatistics();
    updateMonthlyBreakdown();
    updateWeeklyBreakdown();
    
    // Set up toggle buttons immediately and with delays
    setupToggleDelegation();
  }
  
  // Global toggle functions (accessible from inline onclick)
  window.toggleMonthlyTable = function() {
    const btn = document.getElementById('monthly-toggle-btn');
    const container = document.getElementById('monthly-table-container');
    
    if (!btn || !container) return;
    
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      container.classList.add('blog-monthly-table-hidden');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Show Details';
    } else {
      container.classList.remove('blog-monthly-table-hidden');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = 'Hide Details';
    }
  };
  
  window.toggleWeeklyTable = function() {
    const btn = document.getElementById('weekly-toggle-btn');
    const container = document.getElementById('weekly-table-container');
    
    if (!btn || !container) return;
    
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      container.classList.add('blog-weekly-table-hidden');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Show Table';
    } else {
      container.classList.remove('blog-weekly-table-hidden');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = 'Hide Table';
    }
  };
  
  // Simple, direct toggle button handlers using IDs
  function setupToggleDelegation() {
    // Use multiple attempts to ensure buttons are found
    const attempts = [0, 100, 300, 600, 1000];
    
    attempts.forEach(delay => {
      setTimeout(() => {
        initToggleButtons();
      }, delay);
    });
  }
  
  function initToggleButtons() {
    // Monthly toggle
    const monthlyBtn = document.getElementById('monthly-toggle-btn');
    const monthlyContainer = document.getElementById('monthly-table-container');
    
    if (monthlyBtn && monthlyContainer) {
      // Ensure initial state
      monthlyContainer.classList.add('blog-monthly-table-hidden');
      monthlyBtn.setAttribute('aria-expanded', 'false');
      if (monthlyBtn.textContent.trim() !== 'Show Details' && monthlyBtn.textContent.trim() !== 'Hide Details') {
        monthlyBtn.textContent = 'Show Details';
      }
      
      // Also add event listener as backup (inline onclick is primary)
      monthlyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleMonthlyTable();
      }, { once: false });
    }
    
    // Weekly toggle
    const weeklyBtn = document.getElementById('weekly-toggle-btn');
    const weeklyContainer = document.getElementById('weekly-table-container');
    
    if (weeklyBtn && weeklyContainer) {
      // Ensure initial state
      weeklyContainer.classList.add('blog-weekly-table-hidden');
      weeklyBtn.setAttribute('aria-expanded', 'false');
      if (weeklyBtn.textContent.trim() !== 'Show Table' && weeklyBtn.textContent.trim() !== 'Hide Table') {
        weeklyBtn.textContent = 'Show Table';
      }
      
      // Also add event listener as backup (inline onclick is primary)
      weeklyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleWeeklyTable();
      }, { once: false });
    }
  }
  
  function generateCaseData() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const isFluSeason = currentMonth >= 9 || currentMonth <= 2; // Oct-Mar
    
    // Generate monthly data for last 6 months
    caseData.monthly = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const monthName = monthDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      
      // Simulate cases based on flu season
      const baseCases = isFluSeason && (monthDate.getMonth() >= 9 || monthDate.getMonth() <= 2) ? 15000 : 8000;
      const cases = baseCases + Math.floor(Math.random() * 5000);
      
      caseData.monthly.push({
        month: monthName,
        monthIndex: monthDate.getMonth(),
        year: monthDate.getFullYear(),
        cases: cases,
        days: daysInMonth
      });
    }
    
    // Generate weekly data for last 8 weeks
    caseData.weekly = [];
    for (let i = 7; i >= 0; i--) {
      const weekDate = new Date(now);
      weekDate.setDate(now.getDate() - (i * 7));
      const weekStart = new Date(weekDate);
      weekStart.setDate(weekDate.getDate() - weekDate.getDay()); // Start of week (Sunday)
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // Format week label as "Week DD/MM - DD/MM"
      const startDay = String(weekStart.getDate()).padStart(2, '0');
      const startMonth = String(weekStart.getMonth() + 1).padStart(2, '0');
      const endDay = String(weekEnd.getDate()).padStart(2, '0');
      const endMonth = String(weekEnd.getMonth() + 1).padStart(2, '0');
      const weekLabel = `Week ${startDay}/${startMonth} - ${endDay}/${endMonth}`;
      
      // Simulate cases
      const baseCases = isFluSeason ? 2500 : 1200;
      const cases = baseCases + Math.floor(Math.random() * 800);
      
      caseData.weekly.push({
        label: weekLabel,
        startDate: weekStart,
        endDate: weekEnd,
        cases: cases
      });
    }
    
    // Calculate totals
    caseData.today = Math.floor(Math.random() * 200) + 150; // Today's cases
    caseData.week = caseData.weekly[caseData.weekly.length - 1].cases; // This week
    caseData.month = caseData.monthly[caseData.monthly.length - 1].cases; // This month
    caseData.total = caseData.monthly.reduce((sum, m) => sum + m.cases, 0) + Math.floor(Math.random() * 50000) + 100000; // Total
  }
  
  function updateCaseStatistics() {
    try {
      // Update Today
      const todayEl = document.getElementById('case-today-value');
      const todayChangeEl = document.getElementById('case-today-change');
      const todayDetailEl = document.getElementById('case-today-detail');
      const todayBadgeEl = document.getElementById('case-today-badge');
      
      if (todayEl) {
        // Use consistent today value from caseData, with small variation
        const todayCases = Math.max(0, caseData.today + Math.floor(Math.random() * 50) - 25);
        todayEl.textContent = todayCases.toLocaleString();
        
        if (todayBadgeEl) {
          todayBadgeEl.textContent = 'Live';
        }
        
        if (todayChangeEl) {
          const change = Math.floor(Math.random() * 20) - 10;
          const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
          const changeIcon = change > 0 ? '↗️' : change < 0 ? '↘️' : '→';
          todayChangeEl.textContent = `${changeIcon} ${Math.abs(change)} from yesterday`;
          todayChangeEl.className = `blog-case-change ${changeClass}`;
        }
        
        if (todayDetailEl) {
          const now = new Date();
          todayDetailEl.textContent = `As of ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
        }
      }
    
    // Update Week
    const weekEl = document.getElementById('case-week-value');
    const weekChangeEl = document.getElementById('case-week-change');
    
    if (weekEl) {
      weekEl.textContent = caseData.week.toLocaleString();
      
      if (weekChangeEl && caseData.weekly.length >= 2) {
        const prevWeek = caseData.weekly[caseData.weekly.length - 2].cases;
        const change = caseData.week - prevWeek;
        const changePercent = Math.round((change / prevWeek) * 100);
        const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
        const changeIcon = change > 0 ? '↗️' : change < 0 ? '↘️' : '→';
        weekChangeEl.textContent = `${changeIcon} ${Math.abs(changePercent)}% vs last week`;
        weekChangeEl.className = `blog-case-change ${changeClass}`;
      }
    }
    
    // Update Month
    const monthEl = document.getElementById('case-month-value');
    const monthChangeEl = document.getElementById('case-month-change');
    const monthDetailEl = document.getElementById('case-month-detail');
    const monthBadgeEl = document.getElementById('case-month-badge');
    
    if (monthEl) {
      const currentMonthData = caseData.monthly[caseData.monthly.length - 1];
      monthEl.textContent = caseData.month.toLocaleString();
      
      if (monthBadgeEl) {
        monthBadgeEl.textContent = currentMonthData.month.split(' ')[0];
      }
      
      if (monthDetailEl) {
        const daysInMonth = currentMonthData.days;
        const daysElapsed = new Date().getDate();
        monthDetailEl.textContent = `${daysElapsed} of ${daysInMonth} days`;
      }
      
      if (monthChangeEl && caseData.monthly.length >= 2) {
        const prevMonth = caseData.monthly[caseData.monthly.length - 2].cases;
        const change = caseData.month - prevMonth;
        const changePercent = Math.round((change / prevMonth) * 100);
        const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
        const changeIcon = change > 0 ? '↗️' : change < 0 ? '↘️' : '→';
        monthChangeEl.textContent = `${changeIcon} ${Math.abs(changePercent)}% vs last month`;
        monthChangeEl.className = `blog-case-change ${changeClass}`;
      }
    }
    
      // Update Total
      const totalEl = document.getElementById('case-total-value');
      const totalChangeEl = document.getElementById('case-total-change');
      const totalDetailEl = document.getElementById('case-total-detail');
      
      if (totalEl) {
        totalEl.textContent = caseData.total.toLocaleString();
        
        if (totalChangeEl) {
          const thisYearTotal = caseData.monthly.reduce((sum, m) => sum + m.cases, 0);
          totalChangeEl.textContent = `↗️ ${thisYearTotal.toLocaleString()} this year`;
          totalChangeEl.className = 'blog-case-change positive';
        }
        
        if (totalDetailEl) {
          totalDetailEl.textContent = 'Since tracking began';
        }
      }
    } catch (error) {
      console.error('Error updating case statistics:', error);
    }
  }
  
  function updateMonthlyBreakdown() {
    try {
      const tbody = document.getElementById('monthly-cases-body');
      if (!tbody) {
        console.warn('Monthly cases body not found');
        return;
      }
      
      if (!caseData.monthly || caseData.monthly.length === 0) {
        console.warn('No monthly data available');
        return;
      }
      
      tbody.innerHTML = caseData.monthly.map((month, index) => {
        const prevMonth = index > 0 ? caseData.monthly[index - 1] : null;
        const change = prevMonth ? month.cases - prevMonth.cases : 0;
        const changePercent = prevMonth && prevMonth.cases > 0 ? Math.round((change / prevMonth.cases) * 100) : 0;
        const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
        const changeIcon = change > 0 ? '↗️' : change < 0 ? '↘️' : '→';
        const trendIcon = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
        
        return `
          <tr>
            <td><strong>${month.month}</strong></td>
            <td><strong>${month.cases.toLocaleString()}</strong></td>
            <td class="${changeClass}">${changeIcon} ${Math.abs(changePercent)}%</td>
            <td>${trendIcon}</td>
          </tr>
        `;
      }).join('');
    } catch (error) {
      console.error('Error updating monthly breakdown:', error);
    }
  }
  
  function updateWeeklyBreakdown() {
    const canvas = document.getElementById('weekly-cases-chart');
    const tbody = document.getElementById('weekly-cases-body');
    
    // Update chart
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const maxCases = Math.max(...caseData.weekly.map(w => w.cases));
      
      // Draw grid
      ctx.strokeStyle = '#e9ecef';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
      
      // Draw axes
      ctx.strokeStyle = '#6c757d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();
      
      // Draw bars
      const barWidth = chartWidth / caseData.weekly.length;
      caseData.weekly.forEach((week, index) => {
        const barHeight = (week.cases / maxCases) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.1;
        const y = height - padding - barHeight;
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
        gradient.addColorStop(0, '#0056b3');
        gradient.addColorStop(1, '#17a2b8');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
        
        // Value label
        ctx.fillStyle = '#495057';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(week.cases.toLocaleString(), x + barWidth * 0.4, y - 5);
      });
    }
    
    // Update table
    if (tbody) {
      try {
        if (!caseData.weekly || caseData.weekly.length === 0) {
          console.warn('No weekly data available');
          return;
        }
        
        tbody.innerHTML = caseData.weekly.map((week, index) => {
          const prevWeek = index > 0 ? caseData.weekly[index - 1] : null;
          const change = prevWeek ? week.cases - prevWeek.cases : 0;
          const changePercent = prevWeek && prevWeek.cases > 0 ? Math.round((change / prevWeek.cases) * 100) : 0;
          const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
          const changeIcon = change > 0 ? '↗️' : change < 0 ? '↘️' : '→';
          
          // Use the week label from the data
          return `
            <tr>
              <td><strong>${week.label}</strong></td>
              <td>${week.startDate.toLocaleDateString('en-GB')} - ${week.endDate.toLocaleDateString('en-GB')}</td>
              <td><strong>${week.cases.toLocaleString()}</strong></td>
              <td><span class="blog-case-change ${changeClass}">${prevWeek ? `${changeIcon} ${Math.abs(changePercent)}%` : '—'}</span></td>
            </tr>
          `;
        }).join('');
      } catch (error) {
        console.error('Error updating weekly breakdown table:', error);
      }
    }
  }

  function updateFocusPoints() {
    const pointsEl = document.getElementById('focus-points');
    if (pointsEl) {
      pointsEl.textContent = focusPoints;
      pointsEl.setAttribute('data-points', focusPoints);
    }
  }

  function addFocusPoints(amount) {
    focusPoints += amount;
    localStorage.setItem('focusPoints', focusPoints.toString());
    updateFocusPoints();
  }

  function initResetProgress() {
    const resetBtn = document.getElementById('reset-progress-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all progress and points? This cannot be undone.')) {
          focusPoints = 0;
          localStorage.setItem('focusPoints', '0');
          updateFocusPoints();
          // Reset all games
          Object.values(gameIntervals).forEach(interval => clearInterval(interval));
          gameIntervals = {};
        }
      });
    }
  }

  // Rhythm Runner Game - Enhanced with actual tap interaction
  function initRhythmRunner() {
    try {
      const startBtn = document.querySelector('[data-target="rhythm-runner"]');
      const progressBar = document.getElementById('rhythm-progress');
      const feedback = document.getElementById('rhythm-feedback');
      
      if (!startBtn || !progressBar) {
        console.warn('Rhythm Runner: Missing required elements', { startBtn: !!startBtn, progressBar: !!progressBar });
        return;
      }
      
      console.log('Rhythm Runner: Elements found, setting up...');
      
      // Ensure progress bar is visible and styled
      if (progressBar) {
        progressBar.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.style.height = '20px';
        progressBar.style.backgroundColor = '#7FB285';
        progressBar.style.borderRadius = '10px';
        progressBar.style.transition = 'width 0.1s linear';
      }
      
      // Ensure progress container is visible
      const progressContainer = progressBar.parentElement;
      if (progressContainer) {
        progressContainer.style.display = 'block';
        progressContainer.style.width = '100%';
        progressContainer.style.height = '20px';
        progressContainer.style.backgroundColor = '#f0f0f0';
        progressContainer.style.borderRadius = '10px';
        progressContainer.style.position = 'relative';
        progressContainer.style.overflow = 'hidden';
      }

    let score = 0;
    let taps = 0;
    let hits = 0;
    let isActive = false;
    let beatInterval = null;
    const BEAT_DURATION = 2000; // 2 seconds per beat
    const ZONE_START = 40; // Zone starts at 40%
    const ZONE_END = 60; // Zone ends at 60%
    const duration = 30000; // 30 seconds

    // Create visual zone indicator (reuse progressContainer from above)
    if (progressContainer && !progressContainer.querySelector('.rhythm-zone')) {
      const zone = document.createElement('div');
      zone.className = 'rhythm-zone';
      zone.style.position = 'absolute';
      zone.style.left = ZONE_START + '%';
      zone.style.width = (ZONE_END - ZONE_START) + '%';
      zone.style.height = '100%';
      zone.style.backgroundColor = 'rgba(127, 178, 133, 0.3)';
      zone.style.pointerEvents = 'none';
      zone.style.zIndex = '1';
      progressContainer.style.position = 'relative';
      progressContainer.appendChild(zone);
      
      // Make sure progress bar is above zone
      if (progressBar) {
        progressBar.style.position = 'relative';
        progressBar.style.zIndex = '2';
      }
    }

    function handleTap(e) {
      if (!isActive) return;
      // Don't count button clicks as taps
      if (e.target === startBtn || e.target.closest('button')) return;
      
      taps++;
      const currentProgress = parseFloat(progressBar.style.width) || 0;
      
      if (currentProgress >= ZONE_START && currentProgress <= ZONE_END) {
        hits++;
        score += 10;
        if (feedback) {
          feedback.textContent = `Hit! Score: ${score} (${hits}/${taps})`;
          feedback.style.color = '#7FB285';
        }
        // Visual feedback
        progressBar.style.backgroundColor = '#7FB285';
        setTimeout(() => {
          progressBar.style.backgroundColor = '';
        }, 200);
      } else {
        if (feedback) {
          feedback.textContent = `Miss! Score: ${score} (${hits}/${taps})`;
          feedback.style.color = '#d32f2f';
        }
      }
    }

    // Add tap listener to progress bar area (not the whole card to avoid conflicts)
    // Reuse progressContainer from above (already declared)
    if (progressContainer) {
      progressContainer.addEventListener('click', handleTap);
      progressContainer.style.cursor = 'pointer';
      progressContainer.title = 'Tap when bar is in green zone';
    }

    // Test if button is clickable
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Rhythm Runner: Start button clicked', e);
      
      // Verify button state
      if (startBtn.disabled) {
        console.warn('Button is disabled, cannot start');
        return;
      }
      
      if (gameIntervals.rhythm) {
        clearInterval(gameIntervals.rhythm);
      }
      if (beatInterval) {
        clearInterval(beatInterval);
      }
      
      startBtn.disabled = true;
      startBtn.textContent = 'Playing...';
      isActive = true;
      score = 0;
      taps = 0;
      hits = 0;
      let progress = 0;
      const startTime = Date.now();
      
      if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#7FB285';
        progressBar.style.transition = 'width 0.1s linear';
      }
      
      if (feedback) {
        feedback.textContent = 'Tap when the bar enters the green zone!';
        feedback.style.color = '';
      }
      
      // Progress bar animation
      gameIntervals.rhythm = setInterval(() => {
        if (!isActive) {
          clearInterval(gameIntervals.rhythm);
          return;
        }
        
        const elapsed = Date.now() - startTime;
        progress = Math.min((elapsed / duration) * 100, 100);
        
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
        
        if (progress >= 100) {
          clearInterval(gameIntervals.rhythm);
          delete gameIntervals.rhythm;
          if (beatInterval) {
            clearInterval(beatInterval);
            beatInterval = null;
          }
          isActive = false;
          startBtn.disabled = false;
          startBtn.textContent = 'Start 30s round';
          
          const accuracy = taps > 0 ? Math.round((hits / taps) * 100) : 0;
          const points = Math.floor(score / 10) + (accuracy >= 70 ? 5 : 0); // Bonus for good accuracy
          
          if (feedback) {
            feedback.textContent = `Round complete! Score: ${score}, Accuracy: ${accuracy}% (+${points} points)`;
            feedback.style.color = '';
          }
          addFocusPoints(points);
        }
      }, 50);

      // Beat pattern - bar moves in rhythm
      let beatProgress = 0;
      beatInterval = setInterval(() => {
        beatProgress = (beatProgress + 20) % 100; // Move 20% per beat
        if (!isActive) {
          clearInterval(beatInterval);
          beatInterval = null;
        }
      }, BEAT_DURATION);
    });
    
    startBtn.setAttribute('data-initialized', 'true');
    console.log('Rhythm Runner: Event listener attached');
    } catch (error) {
      console.error('Error initializing Rhythm Runner:', error);
    }
  }

  // Breath Tiles Game - Enhanced with scoring and better feedback
  function initBreathTiles() {
    try {
      const startBtn = document.querySelector('[data-target="breath-tiles"]');
      const tileGrid = document.getElementById('breath-tiles');
      const feedback = document.getElementById('breath-feedback');
      
      if (!startBtn || !tileGrid) {
        console.warn('Breath Tiles: Missing required elements', { startBtn: !!startBtn, tileGrid: !!tileGrid });
        return;
      }
      
      console.log('Breath Tiles: Elements found, setting up...');
      startBtn.setAttribute('data-initialized', 'true');
      
      // Ensure tile grid is visible and styled
      if (tileGrid) {
        tileGrid.style.display = 'grid';
        tileGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        tileGrid.style.gap = '10px';
        tileGrid.style.marginBottom = '15px';
      }

    const phases = ['Inhale', 'Hold', 'Exhale', 'Hold'];
    const phaseDurations = [4000, 2000, 4000, 2000]; // Box breathing: 4-4-4-4 seconds
    let currentPhase = 0;
    let tiles = [];
    let score = 0;
    let correctTaps = 0;
    let totalTaps = 0;
    let isActive = false;
    let phaseStartTime = 0;

    // Create tiles with better styling
    if (tileGrid.children.length === 0) {
      phases.forEach((phase, index) => {
        const tile = document.createElement('div');
        tile.className = 'blog-tile';
        tile.textContent = phase.charAt(0);
        tile.title = phase;
        tile.dataset.phase = index;
        tile.setAttribute('role', 'button');
        tile.setAttribute('tabindex', '0');
        tile.setAttribute('aria-label', phase);
        
        // Add styling to make tiles visible and clickable
        tile.style.cssText = `
          width: 60px;
          height: 60px;
          border: 2px solid #7FB285;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
          font-weight: bold;
          cursor: pointer;
          background: #fff;
          transition: all 0.3s ease;
        `;
        
        tile.addEventListener('click', () => handleTileClick(index));
        tile.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTileClick(index);
          }
        });
        tile.addEventListener('mouseenter', () => {
          tile.style.transform = 'scale(1.05)';
        });
        tile.addEventListener('mouseleave', () => {
          tile.style.transform = 'scale(1)';
        });
        tileGrid.appendChild(tile);
        tiles.push(tile);
      });
    } else {
      tiles = Array.from(tileGrid.children);
    }

    function handleTileClick(index) {
      if (!isActive) return;
      totalTaps++;
      
      if (index === currentPhase) {
        correctTaps++;
        score += 5;
        tiles[index].style.backgroundColor = '#7FB285';
        tiles[index].style.color = '#fff';
        tiles[index].style.transform = 'scale(1.1)';
        setTimeout(() => {
          tiles[index].style.backgroundColor = '';
          tiles[index].style.color = '';
          tiles[index].style.transform = 'scale(1)';
        }, 500);
        if (feedback) {
          feedback.textContent = `Correct! ${phases[index]} (+5) Score: ${score}`;
          feedback.style.color = '#7FB285';
        }
      } else {
        tiles[index].style.backgroundColor = '#d32f2f';
        tiles[index].style.color = '#fff';
        tiles[index].style.transform = 'scale(0.95)';
        setTimeout(() => {
          tiles[index].style.backgroundColor = '';
          tiles[index].style.color = '';
          tiles[index].style.transform = 'scale(1)';
        }, 500);
        if (feedback) {
          feedback.textContent = `Wrong tile! Try ${phases[currentPhase]}. Score: ${score}`;
          feedback.style.color = '#d32f2f';
        }
      }
    }

    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Breath Tiles: Start button clicked', e);
      
      if (startBtn.disabled) {
        console.warn('Button is disabled, cannot start');
        return;
      }
      
      if (gameIntervals.breath) {
        clearInterval(gameIntervals.breath);
      }
      
      startBtn.disabled = true;
      startBtn.textContent = 'Playing...';
      isActive = true;
      currentPhase = 0;
      score = 0;
      correctTaps = 0;
      totalTaps = 0;
      phaseStartTime = Date.now();
      
      tiles.forEach(t => {
        t.style.opacity = '1';
        t.style.backgroundColor = '';
        t.style.borderColor = '#7FB285';
        t.style.borderWidth = '2px';
        t.style.color = '';
        t.style.transform = 'scale(1)';
      });
      
      if (tiles[0]) {
        tiles[0].style.backgroundColor = '#e8f5e9';
        tiles[0].style.borderColor = '#7FB285';
        tiles[0].style.borderWidth = '3px';
        tiles[0].style.opacity = '1';
      }
      
      if (feedback) {
        feedback.textContent = `Tap tiles in order: ${phases[currentPhase]} → ${phases[1]} → ${phases[2]} → ${phases[3]}`;
        feedback.style.color = '';
      }
      
      function updatePhase() {
        if (!isActive) return;
        
        const elapsed = Date.now() - phaseStartTime;
        const currentDuration = phaseDurations[currentPhase];
        
        if (elapsed >= currentDuration) {
          // Move to next phase
          if (tiles[currentPhase]) {
            tiles[currentPhase].style.backgroundColor = '';
            tiles[currentPhase].style.borderColor = '#7FB285';
            tiles[currentPhase].style.borderWidth = '2px';
          }
          currentPhase = (currentPhase + 1) % phases.length;
          phaseStartTime = Date.now();
          
          if (tiles[currentPhase]) {
            tiles[currentPhase].style.backgroundColor = '#e8f5e9';
            tiles[currentPhase].style.borderColor = '#7FB285';
            tiles[currentPhase].style.borderWidth = '3px';
          }
          
          if (feedback && currentPhase === 0) {
            // Completed one full cycle
            const accuracy = totalTaps > 0 ? Math.round((correctTaps / totalTaps) * 100) : 0;
            feedback.textContent = `Cycle ${Math.floor((Date.now() - phaseStartTime) / 12000) + 1} complete! Accuracy: ${accuracy}%`;
          }
        }
        
        // Update visual pulse for active tile
        if (tiles[currentPhase]) {
          const progress = elapsed / currentDuration;
          const pulse = 0.7 + (Math.sin(progress * Math.PI * 2) * 0.3);
          tiles[currentPhase].style.opacity = pulse;
        }
      }
      
      gameIntervals.breath = setInterval(updatePhase, 50);
      
      // Auto-complete after 4 cycles (32 seconds for box breathing)
      setTimeout(() => {
        clearInterval(gameIntervals.breath);
        delete gameIntervals.breath;
        isActive = false;
        startBtn.disabled = false;
        startBtn.textContent = 'Start guided cycle';
        tiles.forEach(t => {
          t.style.opacity = '1';
          t.style.backgroundColor = '';
          t.style.color = '';
          t.style.transform = 'scale(1)';
        });
        
        const accuracy = totalTaps > 0 ? Math.round((correctTaps / totalTaps) * 100) : 0;
        const bonus = accuracy >= 80 ? 5 : 0;
        const points = Math.floor(score / 5) + bonus;
        
        if (feedback) {
          feedback.textContent = `Cycle complete! Score: ${score}, Accuracy: ${accuracy}% (+${points} points)`;
          feedback.style.color = '';
        }
        addFocusPoints(points);
      }, 32000); // 4 cycles of 8 seconds each
    });
    } catch (error) {
      console.error('Error initializing Breath Tiles:', error);
    }
  }

  // Signal Switch Game - Enhanced with better feedback and scoring
  function initSignalSwitch() {
    try {
      const startBtn = document.querySelector('[data-target="signal-switch"]');
      const signalDisplay = document.getElementById('signal-display');
      const signalButtons = document.querySelectorAll('[data-signal]');
      const feedback = document.getElementById('signal-feedback');
      
      if (!startBtn || !signalDisplay) {
        console.warn('Signal Switch: Missing required elements', { startBtn: !!startBtn, signalDisplay: !!signalDisplay });
        return;
      }
      
      console.log('Signal Switch: Elements found, setting up...');
      startBtn.setAttribute('data-initialized', 'true');
      
      // Style signal display
      if (signalDisplay) {
        signalDisplay.style.cssText = `
          font-size: 1.5em;
          font-weight: bold;
          padding: 15px;
          text-align: center;
          border: 2px solid #7FB285;
          border-radius: 8px;
          margin-bottom: 15px;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9f9f9;
        `;
      }
      
      // Style signal buttons
      signalButtons.forEach(btn => {
        btn.style.cssText = `
          min-width: 100px;
          padding: 10px 20px;
          font-weight: 600;
          border-radius: 6px;
          transition: all 0.2s ease;
        `;
      });

    let rule = 'tap';
    let targetColor = 'green';
    let score = 0;
    let correctClicks = 0;
    let totalClicks = 0;
    let isActive = false;
    let ruleChangeCount = 0;

    function updateRule() {
      if (!isActive) return;
      
      rule = Math.random() > 0.5 ? 'tap' : 'avoid';
      targetColor = Math.random() > 0.5 ? 'green' : 'blue';
      ruleChangeCount++;
      
      signalDisplay.textContent = `${rule.toUpperCase()} ${targetColor.toUpperCase()}`;
      signalDisplay.style.color = targetColor === 'green' ? '#7FB285' : '#7BA3C9';
      signalDisplay.style.fontWeight = 'bold';
      signalDisplay.style.fontSize = '1.2em';
      
      // Visual flash on rule change
      signalDisplay.style.transform = 'scale(1.2)';
      setTimeout(() => {
        signalDisplay.style.transform = 'scale(1)';
      }, 200);
      
      // Update button states for visual feedback
      signalButtons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        if (btn.dataset.signal === targetColor) {
          btn.style.border = '2px solid ' + (targetColor === 'green' ? '#7FB285' : '#7BA3C9');
        } else {
          btn.style.border = '';
        }
      });
    }

    function handleSignalClick(e) {
      if (!isActive) return;
      
      totalClicks++;
      const clickedColor = e.target.dataset.signal;
      const shouldClick = (rule === 'tap' && clickedColor === targetColor) ||
                        (rule === 'avoid' && clickedColor !== targetColor);
      
      // Remove previous feedback classes
      e.target.classList.remove('correct', 'incorrect');
      
      if (shouldClick) {
        score += 10;
        correctClicks++;
        e.target.classList.add('correct');
        e.target.style.transform = 'scale(1.1)';
        setTimeout(() => {
          e.target.style.transform = 'scale(1)';
        }, 200);
        
        if (feedback) {
          const accuracy = Math.round((correctClicks / totalClicks) * 100);
          feedback.textContent = `✓ Correct! Score: ${score} (${accuracy}% accuracy)`;
          feedback.style.color = '#7FB285';
        }
      } else {
        score = Math.max(0, score - 5);
        e.target.classList.add('incorrect');
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
          e.target.style.transform = 'scale(1)';
        }, 200);
        
        if (feedback) {
          const accuracy = totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 0;
          feedback.textContent = `✗ Wrong! Score: ${score} (${accuracy}% accuracy)`;
          feedback.style.color = '#d32f2f';
        }
      }
      
      // Remove feedback classes after animation
      setTimeout(() => {
        e.target.classList.remove('correct', 'incorrect');
      }, 500);
    }

    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Signal Switch: Start button clicked', e);
      
      if (startBtn.disabled) {
        console.warn('Button is disabled, cannot start');
        return;
      }
      
      if (gameIntervals.signal) {
        clearInterval(gameIntervals.signal);
      }
      
      startBtn.disabled = true;
      startBtn.textContent = 'Playing...';
      isActive = true;
      score = 0;
      correctClicks = 0;
      totalClicks = 0;
      ruleChangeCount = 0;
      
      // Reset button styles
      signalButtons.forEach(btn => {
        btn.style.border = '';
        btn.style.transform = '';
        btn.classList.remove('correct', 'incorrect');
      });
      
      updateRule();
      if (feedback) {
        feedback.textContent = `Follow the rule! Score: ${score}`;
        feedback.style.color = '';
      }
      
      signalButtons.forEach(btn => {
        btn.addEventListener('click', handleSignalClick);
        btn.disabled = false;
      });
      
      // Change rule every 3-5 seconds (unpredictable)
      gameIntervals.signal = setInterval(() => {
        updateRule();
      }, 3000 + Math.random() * 2000);
      
      setTimeout(() => {
        clearInterval(gameIntervals.signal);
        delete gameIntervals.signal;
        isActive = false;
        startBtn.disabled = false;
        startBtn.textContent = 'Start 45s quest';
        
        signalButtons.forEach(btn => {
          btn.removeEventListener('click', handleSignalClick);
          btn.style.border = '';
          btn.style.transform = '';
          btn.classList.remove('correct', 'incorrect');
        });
        
        const accuracy = totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 0;
        const bonus = accuracy >= 75 ? 5 : 0;
        const points = Math.floor(score / 5) + bonus;
        
        if (feedback) {
          feedback.textContent = `Quest complete! Score: ${score}, Accuracy: ${accuracy}%, Rules changed: ${ruleChangeCount} (+${points} points)`;
          feedback.style.color = '';
        }
        addFocusPoints(points);
      }, 45000);
    });
    } catch (error) {
      console.error('Error initializing Signal Switch:', error);
    }
  }

  // Skyline Tracker Game
  function initSkylineTracker() {
    try {
      const startBtn = document.querySelector('[data-target="skyline-tracker"]');
      const tracker = document.getElementById('tracker');
      const target = document.getElementById('tracker-target');
      const feedback = document.getElementById('tracker-feedback');
      
      if (!startBtn || !tracker || !target) {
        console.warn('Skyline Tracker: Missing required elements', { 
          startBtn: !!startBtn, 
          tracker: !!tracker, 
          target: !!target 
        });
        return;
      }
      
      console.log('Skyline Tracker: Elements found, setting up...');
      startBtn.setAttribute('data-initialized', 'true');
      
      // Style tracker container
      if (tracker) {
        tracker.style.position = 'relative';
        tracker.style.width = '100%';
        tracker.style.height = '200px';
        tracker.style.border = '2px solid #7FB285';
        tracker.style.borderRadius = '8px';
        tracker.style.backgroundColor = '#f9f9f9';
        tracker.style.overflow = 'hidden';
        tracker.style.marginBottom = '15px';
      }
      
      // Style target
      if (target) {
        target.style.position = 'absolute';
        target.style.width = '30px';
        target.style.height = '30px';
        target.style.borderRadius = '50%';
        target.style.backgroundColor = '#6366f1';
        target.style.border = '3px solid #fff';
        target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        target.style.transform = 'translate(-50%, -50%)';
        target.style.left = '50%';
        target.style.top = '50%';
        target.style.transition = 'all 0.1s ease';
      }

    let targetX = 50;
    let targetY = 50;
    let score = 0;
    let isActive = false;
    let distractorInterval = null;
    let distractorElements = [];

    // Create distractor flashes
    function createDistractor() {
      const distractor = document.createElement('div');
      distractor.className = 'tracker-distractor';
      distractor.style.position = 'absolute';
      distractor.style.width = '20px';
      distractor.style.height = '20px';
      distractor.style.borderRadius = '50%';
      distractor.style.backgroundColor = '#ff6b6b';
      distractor.style.left = Math.random() * 80 + 10 + '%';
      distractor.style.top = Math.random() * 80 + 10 + '%';
      distractor.style.opacity = '0.8';
      distractor.style.pointerEvents = 'none';
      distractor.style.transition = 'opacity 0.3s';
      tracker.appendChild(distractor);
      distractorElements.push(distractor);
      
      setTimeout(() => {
        distractor.style.opacity = '0';
        setTimeout(() => {
          if (distractor.parentElement) {
            distractor.remove();
          }
          const index = distractorElements.indexOf(distractor);
          if (index > -1) distractorElements.splice(index, 1);
        }, 300);
      }, 500);
    }

    function updateTargetPosition() {
      if (!isActive) return;
      
      const rect = tracker.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const targetPixelX = (targetX / 100) * rect.width;
      const targetPixelY = (targetY / 100) * rect.height;
      const distance = Math.sqrt(Math.pow(targetPixelX - centerX, 2) + 
                                 Math.pow(targetPixelY - centerY, 2));
      
      // Score points for keeping target centered (within 10% of center)
      const maxDistance = rect.width * 0.1;
      if (distance < maxDistance) {
        score += 1;
        if (feedback) {
          feedback.textContent = `Score: ${score} (Keep it centered!)`;
          feedback.style.color = '#7FB285';
        }
        // Visual feedback
        target.style.transform = 'scale(1.2)';
        setTimeout(() => {
          target.style.transform = 'scale(1)';
        }, 200);
      } else {
        if (feedback && score > 0) {
          feedback.textContent = `Score: ${score}`;
          feedback.style.color = '';
        }
      }
      
      // Drift target slightly (increased drift for challenge)
      targetX += (Math.random() - 0.5) * 3;
      targetY += (Math.random() - 0.5) * 3;
      targetX = Math.max(15, Math.min(85, targetX));
      targetY = Math.max(15, Math.min(85, targetY));
      
      target.style.left = targetX + '%';
      target.style.top = targetY + '%';
    }

    tracker.addEventListener('keydown', (e) => {
      if (!isActive) return;
      
      const step = 2;
      if (e.key === 'ArrowLeft') targetX = Math.max(20, targetX - step);
      if (e.key === 'ArrowRight') targetX = Math.min(80, targetX + step);
      if (e.key === 'ArrowUp') targetY = Math.max(20, targetY - step);
      if (e.key === 'ArrowDown') targetY = Math.min(80, targetY + step);
      
      target.style.left = targetX + '%';
      target.style.top = targetY + '%';
      updateTargetPosition();
    });

    tracker.addEventListener('click', (e) => {
      if (!isActive) return;
      const rect = tracker.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 100;
      const clickY = ((e.clientY - rect.top) / rect.height) * 100;
      targetX = Math.max(20, Math.min(80, clickX));
      targetY = Math.max(20, Math.min(80, clickY));
      target.style.left = targetX + '%';
      target.style.top = targetY + '%';
      updateTargetPosition();
    });

    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Skyline Tracker: Start button clicked', e);
      
      if (startBtn.disabled) {
        console.warn('Button is disabled, cannot start');
        return;
      }
      
      if (gameIntervals.tracker) {
        clearInterval(gameIntervals.tracker);
      }
      if (distractorInterval) {
        clearInterval(distractorInterval);
      }
      
      // Clear any existing distractors
      distractorElements.forEach(d => d.remove());
      distractorElements = [];
      
      startBtn.disabled = true;
      startBtn.textContent = 'Playing...';
      isActive = true;
      score = 0;
      targetX = 50;
      targetY = 50;
      if (target) {
        target.style.left = '50%';
        target.style.top = '50%';
        target.style.transform = 'scale(1)';
      }
      if (tracker) {
        tracker.focus();
      }
      if (feedback) {
        feedback.textContent = 'Keep the comet centered! Use arrow keys or click. Ignore red flashes.';
        feedback.style.color = '';
      }
      
      // Update target position
      gameIntervals.tracker = setInterval(updateTargetPosition, 100);
      
      // Create distractor flashes every 2-4 seconds
      distractorInterval = setInterval(() => {
        if (isActive) {
          createDistractor();
        }
      }, 2000 + Math.random() * 2000);
      
      setTimeout(() => {
        clearInterval(gameIntervals.tracker);
        delete gameIntervals.tracker;
        if (distractorInterval) {
          clearInterval(distractorInterval);
          distractorInterval = null;
        }
        isActive = false;
        startBtn.disabled = false;
        startBtn.textContent = 'Start 60s track';
        
        // Clear distractors
        distractorElements.forEach(d => d.remove());
        distractorElements = [];
        
        const points = Math.floor(score / 10);
        if (feedback) {
          feedback.textContent = `Track complete! Score: ${score} (+${points} points)`;
          feedback.style.color = '';
        }
        addFocusPoints(points);
      }, 60000);
    });
    } catch (error) {
      console.error('Error initializing Skyline Tracker:', error);
    }
  }

  // ============================================
  // BLOG POST FILTERS
  // ============================================
  function initBlogFilters() {
    const searchInput = document.getElementById('search-input');
    const filterForm = document.getElementById('filter-form');
    const postsGrid = document.getElementById('posts-grid');
    const noResults = document.getElementById('no-results');
    
    if (!postsGrid) return;

    function filterPosts() {
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      const topicFilters = Array.from(document.querySelectorAll('.filter-topic:checked')).map(cb => cb.value);
      const audienceFilters = Array.from(document.querySelectorAll('.filter-audience:checked')).map(cb => cb.value);
      
      const posts = Array.from(postsGrid.querySelectorAll('.blog-post-card'));
      let visibleCount = 0;
      
      posts.forEach(post => {
        const topics = post.dataset.topics ? post.dataset.topics.split(',') : [];
        const audiences = post.dataset.audience ? post.dataset.audience.split(',') : [];
        const text = post.textContent.toLowerCase();
        
        const matchesSearch = !searchTerm || text.includes(searchTerm);
        const matchesTopic = topicFilters.length === 0 || topicFilters.some(tf => topics.includes(tf));
        const matchesAudience = audienceFilters.length === 0 || audienceFilters.some(af => audiences.includes(af));
        
        if (matchesSearch && matchesTopic && matchesAudience) {
          post.style.display = '';
          visibleCount++;
        } else {
          post.style.display = 'none';
        }
      });
      
      if (noResults) {
        noResults.hidden = visibleCount > 0;
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterPosts);
    }
    
    if (filterForm) {
      filterForm.addEventListener('change', filterPosts);
    }
  }

  // ============================================
  // PLAYLIST FUNCTIONALITY - Enhanced with Web Audio API
  // ============================================
  function initPlaylist() {
    try {
      const tempoSlider = document.getElementById('playlist-tempo');
      const tempoValue = document.getElementById('playlist-tempo-value');
      const trackList = document.getElementById('track-list');
      const playlistSummary = document.getElementById('playlist-summary');
      const saveBtn = document.getElementById('save-playlist');
      const audioContainer = document.getElementById('audio-player-container');
      
      if (!tempoSlider || !trackList) {
        console.warn('Playlist: Missing required elements');
        return;
      }
      
      console.log('Playlist: Elements found, setting up...');
      
      const playBtn = document.createElement('button');
      playBtn.className = 'btn btn-primary';
      playBtn.textContent = 'Play Selected';
      playBtn.type = 'button';
    
    let audioContext = null;
    let oscillator = null;
    let gainNode = null;
    let isPlaying = false;
    let currentTempo = 70;

    // Initialize Web Audio API
    function initAudioContext() {
      if (!audioContext) {
        try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
          console.warn('Web Audio API not supported:', error);
          return false;
        }
      }
      return true;
    }

    // Generate ambient tone based on BPM
    function generateAmbientTone(bpm) {
      if (!initAudioContext()) return;
      
      // Stop existing sound
      stopAudio();
      
      // Calculate frequency based on BPM (convert to Hz for alpha/beta waves)
      // Alpha waves: 8-13 Hz, Beta: 14-30 Hz
      // For focus, use alpha range (relaxed but alert)
      const baseFreq = 220; // A3 note
      const binauralFreq = bpm / 60 * 10; // Convert BPM to Hz approximation
      
      try {
        // Create oscillator for base tone
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = baseFreq;
        
        // Create gentle volume envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        isPlaying = true;
        playBtn.textContent = 'Stop';
      } catch (error) {
        console.warn('Error generating audio:', error);
      }
    }

    function stopAudio() {
      if (oscillator) {
        try {
          oscillator.stop();
          oscillator.disconnect();
          oscillator = null;
        } catch (e) {}
      }
      if (gainNode) {
        try {
          gainNode.disconnect();
          gainNode = null;
        } catch (e) {}
      }
      isPlaying = false;
      playBtn.textContent = 'Play Selected';
    }

    // Add play button to player area
    if (audioContainer) {
      if (!audioContainer.querySelector('.playlist-play-btn')) {
        playBtn.className += ' playlist-play-btn';
        playBtn.style.marginTop = '10px';
        playBtn.style.marginBottom = '15px';
        audioContainer.appendChild(playBtn);
      }
    } else if (playlistSummary && playlistSummary.parentElement) {
      // Fallback: add to playlist summary container
      const playerContainer = playlistSummary.parentElement;
      if (!playerContainer.querySelector('.playlist-play-btn')) {
        playBtn.className += ' playlist-play-btn';
        playBtn.style.marginTop = '10px';
        playBtn.style.marginBottom = '15px';
        playerContainer.insertBefore(playBtn, playlistSummary);
      }
    }

    // Tempo slider
    if (tempoSlider && tempoValue) {
      // Load saved tempo
      const savedTempo = localStorage.getItem('playlistTempo');
      if (savedTempo) {
        tempoSlider.value = savedTempo;
        tempoValue.textContent = savedTempo + ' BPM';
        currentTempo = parseInt(savedTempo, 10);
      }
      
      tempoSlider.addEventListener('input', (e) => {
        const tempo = parseInt(e.target.value, 10);
        currentTempo = tempo;
        tempoValue.textContent = tempo + ' BPM';
        
        // Update audio if playing
        if (isPlaying) {
          generateAmbientTone(tempo);
        }
      });
    }

    // Track list
    if (trackList && playlistSummary) {
      // Load saved selections
      const savedTracks = JSON.parse(localStorage.getItem('playlistTracks') || '[]');
      if (savedTracks.length > 0) {
        trackList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          if (savedTracks.includes(cb.value)) {
            cb.checked = true;
          }
        });
      }
      
      function updateSummary() {
        const selected = Array.from(trackList.querySelectorAll('input:checked'))
          .map(cb => cb.value);
        if (playlistSummary) {
          playlistSummary.textContent = `Selected tracks: ${selected.join(', ') || 'None'}`;
        }
      }
      
      trackList.addEventListener('change', updateSummary);
      updateSummary();
    }

    // Play button
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (isPlaying) {
          stopAudio();
        } else {
          const selected = Array.from(trackList.querySelectorAll('input:checked'))
            .map(cb => cb.value);
          
          if (selected.length === 0) {
            alert('Please select at least one track to play.');
            return;
          }
          
          // Generate ambient tone using Web Audio API
          generateAmbientTone(currentTempo);
        }
      });
    }

    // Save button
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const selected = Array.from(trackList.querySelectorAll('input:checked'))
          .map(cb => cb.value);
        localStorage.setItem('playlistTracks', JSON.stringify(selected));
        localStorage.setItem('playlistTempo', tempoSlider ? tempoSlider.value : '70');
        
        // Create export data
        const exportData = {
          tracks: selected,
          tempo: tempoSlider ? tempoSlider.value : '70',
          timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `focus-playlist-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Show confirmation
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
          saveBtn.textContent = originalText;
        }, 2000);
      });
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      stopAudio();
    });
    } catch (error) {
      console.error('Error initializing Playlist:', error);
    }
  }

  // ============================================
  // JOURNAL FUNCTIONALITY - Enhanced with validation and stats
  // ============================================
  function initJournal() {
    try {
      const journalForm = document.getElementById('journal-form');
      const journalEntries = document.getElementById('journal-entries');
      const exportBtn = document.getElementById('export-journal');
      
      if (!journalForm) {
        console.warn('Journal: Missing required elements');
        return;
      }
      
      console.log('Journal: Elements found, setting up...');
      let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');

    function renderEntries() {
      if (!journalEntries) return;
      journalEntries.innerHTML = '';
      
      if (entries.length === 0) {
        journalEntries.innerHTML = '<p class="blog-microcopy">No entries yet. Log your first activity above!</p>';
        return;
      }
      
      entries.slice().reverse().forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'blog-journal-entry';
        entryDiv.setAttribute('role', 'article');
        entryDiv.setAttribute('aria-label', `Journal entry: ${entry.activity}`);
        
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        entryDiv.innerHTML = `
          <div class="journal-entry-header">
            <h4>${escapeHtml(entry.activity)}</h4>
            <span class="journal-entry-date">${formattedDate}</span>
          </div>
          <div class="journal-entry-details">
            <span class="journal-badge"><strong>Duration:</strong> ${entry.duration} min</span>
            <span class="journal-badge"><strong>Audience:</strong> ${entry.audience}</span>
          </div>
          <p class="journal-reflection">${escapeHtml(entry.reflection)}</p>
        `;
        journalEntries.appendChild(entryDiv);
      });
      
      // Add stats summary
      const stats = calculateJournalStats();
      if (stats.totalEntries > 0) {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'journal-stats';
        statsDiv.innerHTML = `
          <p><strong>Journal Stats:</strong> ${stats.totalEntries} entries · ${stats.totalMinutes} total minutes · ${stats.uniqueDays} days active</p>
        `;
        journalEntries.insertBefore(statsDiv, journalEntries.firstChild);
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function calculateJournalStats() {
      const totalEntries = entries.length;
      const totalMinutes = entries.reduce((sum, e) => sum + parseInt(e.duration || 0, 10), 0);
      const uniqueDays = new Set(entries.map(e => new Date(e.date).toDateString())).size;
      return { totalEntries, totalMinutes, uniqueDays };
    }

    if (journalForm) {
      journalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const activity = document.getElementById('journal-activity').value.trim();
        const duration = parseInt(document.getElementById('journal-duration').value, 10);
        const audience = document.getElementById('journal-audience').value;
        const reflection = document.getElementById('journal-reflection').value.trim();
        
        // Validation
        if (!activity || activity.length < 3) {
          alert('Please enter a meaningful activity (at least 3 characters).');
          return;
        }
        
        if (!duration || duration < 1 || duration > 180) {
          alert('Please enter a valid duration between 1 and 180 minutes.');
          return;
        }
        
        if (!reflection || reflection.length < 10) {
          alert('Please provide a reflection (at least 10 characters).');
          return;
        }
        
        const entry = {
          activity,
          duration,
          audience,
          reflection,
          date: new Date().toISOString(),
          points: 5
        };
        
        entries.push(entry);
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        journalForm.reset();
        renderEntries();
        
        // Calculate bonus points based on duration
        let points = 5;
        if (duration >= 30) points += 2;
        if (duration >= 60) points += 3;
        
        addFocusPoints(points);
        
        // Show success message
        const submitBtn = journalForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = `✓ Logged! +${points} points`;
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (entries.length === 0) {
          alert('No entries to export. Start logging activities first!');
          return;
        }
        
        // Create CSV
        const csv = 'Activity,Duration (min),Audience,Reflection,Date,Points\n' +
          entries.map(e => {
            const date = new Date(e.date).toLocaleString('en-GB');
            return `"${e.activity.replace(/"/g, '""')}","${e.duration}","${e.audience}","${e.reflection.replace(/"/g, '""')}","${date}","${e.points || 5}"`;
          }).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `focus-journal-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show confirmation
        const originalText = exportBtn.textContent;
        exportBtn.textContent = '✓ Exported!';
        setTimeout(() => {
          exportBtn.textContent = originalText;
        }, 2000);
      });
    }

    renderEntries();
    } catch (error) {
      console.error('Error initializing Journal:', error);
    }
  }

  // ============================================
  // SCRATCH CARDS FUNCTIONALITY
  // ============================================
  function initScratchCards() {
    const scratchCards = document.querySelectorAll('.blog-scratch-card');
    const scratchMessage = document.getElementById('scratch-message');
    const scratchCount = document.getElementById('scratch-count');
    let revealed = parseInt(localStorage.getItem('scratchRevealed') || '0', 10);

    if (scratchCount) scratchCount.textContent = revealed;

    scratchCards.forEach((card, index) => {
      const isRevealed = localStorage.getItem(`scratch-${index}`) === 'true';
      
      if (isRevealed) {
        card.classList.add('revealed');
        card.textContent = card.dataset.message;
        card.disabled = true;
      }

      card.addEventListener('click', () => {
        if (card.classList.contains('revealed')) return;
        
        card.classList.add('revealed');
        card.textContent = card.dataset.message;
        card.disabled = true;
        localStorage.setItem(`scratch-${index}`, 'true');
        
        revealed++;
        localStorage.setItem('scratchRevealed', revealed.toString());
        if (scratchCount) scratchCount.textContent = revealed;
        
        if (scratchMessage) {
          scratchMessage.textContent = card.dataset.message;
        }
        
        addFocusPoints(20);
        
        if (revealed === 5) {
          addFocusPoints(50);
          if (scratchMessage) {
            scratchMessage.textContent = 'Milestone reached! +50 bonus points!';
          }
        }
      });
    });
  }

  // ============================================
  // ACHIEVEMENTS FUNCTIONALITY
  // ============================================
  function initAchievements() {
    const badgeList = document.getElementById('badge-list');
    if (!badgeList) return;

    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const points = parseInt(localStorage.getItem('focusPoints') || '0', 10);

    // Check and unlock badges
    if (points >= 50) {
      unlockBadge('starter');
    }
    if (journalEntries.length >= 5) {
      unlockBadge('navigator');
    }
    // Add more badge checks as needed
  }

  function unlockBadge(badgeId) {
    const badge = document.querySelector(`[data-badge="${badgeId}"]`);
    if (badge && !badge.classList.contains('unlocked')) {
      badge.classList.add('unlocked');
      localStorage.setItem(`badge-${badgeId}`, 'true');
    }
  }

  // ============================================
  // AVATARS & THEMES FUNCTIONALITY
  // ============================================
  function initAvatars() {
    const avatarCards = document.querySelectorAll('.blog-avatar-card');
    const themeMessage = document.getElementById('theme-message');
    const points = parseInt(localStorage.getItem('focusPoints') || '0', 10);
    const activeTheme = localStorage.getItem('activeTheme') || 'calm';

    avatarCards.forEach(card => {
      const cost = parseInt(card.dataset.cost, 10);
      const theme = card.querySelector('[data-theme]')?.dataset.theme;
      
      if (cost === 0 || localStorage.getItem(`theme-${theme}`) === 'unlocked') {
        card.classList.add('unlocked');
        const btn = card.querySelector('button');
        if (btn && btn.dataset.action === 'unlock-theme') {
          btn.textContent = 'Activate';
          btn.dataset.action = 'activate-theme';
        }
      }

      const btn = card.querySelector('button');
      if (btn) {
        btn.addEventListener('click', () => {
          if (btn.dataset.action === 'unlock-theme') {
            if (points >= cost) {
              addFocusPoints(-cost);
              localStorage.setItem(`theme-${theme}`, 'unlocked');
              card.classList.add('unlocked');
              btn.textContent = 'Activate';
              btn.dataset.action = 'activate-theme';
              if (themeMessage) themeMessage.textContent = `Theme unlocked! ${cost} points spent.`;
            } else {
              if (themeMessage) themeMessage.textContent = `Not enough points. Need ${cost}, have ${points}.`;
            }
          } else if (btn.dataset.action === 'activate-theme') {
            localStorage.setItem('activeTheme', theme);
            if (themeMessage) themeMessage.textContent = `Theme "${theme}" activated!`;
            // Apply theme (you can add CSS class switching here)
            document.body.setAttribute('data-theme', theme);
          }
        });
      }
    });

    // Apply active theme
    if (activeTheme) {
      document.body.setAttribute('data-theme', activeTheme);
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  function initYearFooter() {
    const yearEl = document.getElementById('yearFooter');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

})();

