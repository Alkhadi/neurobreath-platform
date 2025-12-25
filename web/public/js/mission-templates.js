// =============================================
// MISSION TEMPLATES
// Defines mission types for each category with input forms
// =============================================

window.MISSION_TEMPLATES = {
  'prompt-engineering': {
    id: 'prompt-engineering',
    name: 'Build a Better Prompt',
    category: 'prompt-engineering',
    description: 'Create an improved prompt for your specific need',
    estimatedTime: '3-5 minutes',
    inputs: [
      {
        id: 'goal',
        label: 'What do you want the AI to do?',
        type: 'textarea',
        placeholder: 'e.g., Help me write a professional email to my manager',
        required: true
      },
      {
        id: 'context',
        label: 'Context or background',
        type: 'textarea',
        placeholder: 'Any important context the AI should know...',
        required: false
      },
      {
        id: 'outputFormat',
        label: 'Desired output format',
        type: 'select',
        options: [
          { value: '', label: 'Any format' },
          { value: 'email', label: 'Email' },
          { value: 'list', label: 'List/Bullet Points' },
          { value: 'table', label: 'Table' },
          { value: 'paragraph', label: 'Paragraph' },
          { value: 'steps', label: 'Step-by-step' }
        ],
        required: false
      }
    ],
    generatePrompt: function(inputs) {
      let prompt = `You are an expert AI prompt engineer. Help me create an effective prompt for the following goal:\n\n`;
      prompt += `Goal: ${inputs.goal || '[not specified]'}\n\n`;
      if (inputs.context) {
        prompt += `Context: ${inputs.context}\n\n`;
      }
      if (inputs.outputFormat) {
        prompt += `I need the output in ${inputs.outputFormat} format.\n\n`;
      }
      prompt += `Please provide:\n1. An optimized prompt that will achieve this goal\n2. Tips for using it effectively\n3. Example variations`;
      return prompt;
    }
  },
  'writing-communication': {
    id: 'writing-communication',
    name: 'Send a Clearer Message',
    category: 'writing-communication',
    description: 'Craft a clear, professional communication',
    estimatedTime: '3-7 minutes',
    inputs: [
      {
        id: 'recipient',
        label: 'Who are you communicating with?',
        type: 'text',
        placeholder: 'e.g., Manager, Colleague, Client',
        required: true
      },
      {
        id: 'purpose',
        label: 'What is the purpose?',
        type: 'textarea',
        placeholder: 'e.g., Request time off, Follow up on project, Address concern',
        required: true
      },
      {
        id: 'tone',
        label: 'Desired tone',
        type: 'select',
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'friendly', label: 'Friendly & Professional' },
          { value: 'formal', label: 'Formal' },
          { value: 'empathetic', label: 'Empathetic' },
          { value: 'assertive', label: 'Assertive' }
        ],
        required: true
      },
      {
        id: 'keyPoints',
        label: 'Key points to include',
        type: 'textarea',
        placeholder: 'List the main points you need to cover...',
        required: false
      }
    ],
    generatePrompt: function(inputs) {
      return `Act as a professional communications assistant. Draft a ${inputs.tone || 'professional'} message to ${inputs.recipient || '[recipient]'}.\n\nPurpose: ${inputs.purpose || '[purpose]'}\n\n${inputs.keyPoints ? `Key points to include:\n${inputs.keyPoints}\n\n` : ''}Please create a clear, well-structured message that achieves this purpose effectively.`;
    }
  },
  'learning-study': {
    id: 'learning-study',
    name: 'Understand & Remember in 10 Minutes',
    category: 'learning-study',
    description: 'Break down complex topics for quick understanding',
    estimatedTime: '5-10 minutes',
    inputs: [
      {
        id: 'topic',
        label: 'What do you want to learn?',
        type: 'textarea',
        placeholder: 'e.g., How blockchain works, The water cycle, Python functions',
        required: true
      },
      {
        id: 'audience',
        label: 'Your knowledge level',
        type: 'select',
        options: [
          { value: 'beginner', label: 'Complete Beginner' },
          { value: 'some-knowledge', label: 'Some Knowledge' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' }
        ],
        required: true
      },
      {
        id: 'goal',
        label: 'Learning goal',
        type: 'textarea',
        placeholder: 'What do you need to be able to do after learning this?',
        required: false
      }
    ],
    generatePrompt: function(inputs) {
      return `Explain ${inputs.topic || '[topic]'} to me. Assume I am at ${inputs.audience || 'beginner'} level.\n\n${inputs.goal ? `My goal is to: ${inputs.goal}\n\n` : ''}Please:\n1. Use simple language and analogies\n2. Break it into key concepts\n3. Provide practical examples\n4. Create a summary I can review later`;
    }
  },
  'productivity': {
    id: 'productivity',
    name: 'Reduce Overwhelm → Next 3 Actions',
    category: 'productivity',
    description: 'Turn overwhelm into a clear action plan',
    estimatedTime: '3-5 minutes',
    inputs: [
      {
        id: 'currentSituation',
        label: 'What feels overwhelming right now?',
        type: 'textarea',
        placeholder: 'Describe what you\'re dealing with...',
        required: true
      },
      {
        id: 'timeAvailable',
        label: 'Time available today',
        type: 'select',
        options: [
          { value: '15min', label: '15 minutes' },
          { value: '30min', label: '30 minutes' },
          { value: '1hour', label: '1 hour' },
          { value: '2hours', label: '2+ hours' }
        ],
        required: true
      },
      {
        id: 'deadlines',
        label: 'Any urgent deadlines?',
        type: 'textarea',
        placeholder: 'List any deadlines or time-sensitive items...',
        required: false
      }
    ],
    generatePrompt: function(inputs) {
      return `I'm feeling overwhelmed. Help me create a clear action plan.\n\nCurrent situation: ${inputs.currentSituation || '[not specified]'}\n\nTime available today: ${inputs.timeAvailable || 'unknown'}\n\n${inputs.deadlines ? `Deadlines: ${inputs.deadlines}\n\n` : ''}Please:\n1. Identify the 3 most important actions I can take right now\n2. Break each into small, achievable steps\n3. Prioritize by urgency and impact\n4. Suggest how to handle less urgent items`;
    }
  },
  'health-wellbeing': {
    id: 'health-wellbeing',
    name: 'Meal / Fitness / Wellbeing Plan',
    category: 'health-wellbeing',
    description: 'Create a personalized health plan',
    estimatedTime: '5-7 minutes',
    inputs: [
      {
        id: 'planType',
        label: 'Type of plan',
        type: 'select',
        options: [
          { value: 'meal', label: 'Meal Plan' },
          { value: 'fitness', label: 'Fitness Plan' },
          { value: 'wellbeing', label: 'Wellbeing Plan' },
          { value: 'combined', label: 'Combined Plan' }
        ],
        required: true
      },
      {
        id: 'goals',
        label: 'Your goals',
        type: 'textarea',
        placeholder: 'e.g., Eat healthier, Increase strength, Reduce stress',
        required: true
      },
      {
        id: 'constraints',
        label: 'Constraints or preferences',
        type: 'textarea',
        placeholder: 'e.g., Allergies, Dietary preferences, Time constraints, Equipment available',
        required: false
      },
      {
        id: 'duration',
        label: 'Plan duration',
        type: 'select',
        options: [
          { value: '1week', label: '1 Week' },
          { value: '2weeks', label: '2 Weeks' },
          { value: '1month', label: '1 Month' }
        ],
        required: true
      }
    ],
    generatePrompt: function(inputs) {
      let prompt = `Create a ${inputs.duration || '1 week'} ${inputs.planType || 'wellbeing'} plan for me.\n\n`;
      prompt += `Goals: ${inputs.goals || '[not specified]'}\n\n`;
      if (inputs.constraints) {
        prompt += `Constraints: ${inputs.constraints}\n\n`;
      }
      prompt += `Please provide:\n1. A structured plan with daily actions\n2. Shopping list (if meal plan)\n3. Tips for success\n4. How to adapt if needed`;
      return prompt;
    }
  },
  'send-carers': {
    id: 'send-carers',
    name: 'EHCP Evidence / Behaviour Reflection / Daily Structure',
    category: 'parenting-teaching',
    description: 'Support for SEND planning and documentation',
    estimatedTime: '5-10 minutes',
    inputs: [
      {
        id: 'documentType',
        label: 'Type of document',
        type: 'select',
        options: [
          { value: 'ehcp-evidence', label: 'EHCP Evidence' },
          { value: 'behaviour-reflection', label: 'Behaviour Reflection' },
          { value: 'daily-structure', label: 'Daily Structure Plan' },
          { value: 'progress-report', label: 'Progress Report' }
        ],
        required: true
      },
      {
        id: 'childInfo',
        label: 'Child/Young Person Information',
        type: 'textarea',
        placeholder: 'Age, needs, strengths, current situation...',
        required: true
      },
      {
        id: 'specificFocus',
        label: 'Specific focus area',
        type: 'textarea',
        placeholder: 'What specifically needs to be addressed or documented?',
        required: true
      },
      {
        id: 'context',
        label: 'Relevant context',
        type: 'textarea',
        placeholder: 'Recent events, observations, concerns...',
        required: false
      }
    ],
    generatePrompt: function(inputs) {
      let prompt = `Help me create ${inputs.documentType || 'documentation'} for a child/young person.\n\n`;
      prompt += `Information: ${inputs.childInfo || '[not specified]'}\n\n`;
      prompt += `Focus area: ${inputs.specificFocus || '[not specified]'}\n\n`;
      if (inputs.context) {
        prompt += `Context: ${inputs.context}\n\n`;
      }
      prompt += `Please provide:\n1. Structured documentation appropriate for ${inputs.documentType}\n2. Evidence-based language\n3. Clear, professional format\n4. Actionable next steps`;
      return prompt;
    }
  },
  'automation': {
    id: 'automation',
    name: 'Design a Workflow',
    category: 'ai-automation',
    description: 'Create an automated workflow for repetitive tasks',
    estimatedTime: '5-10 minutes',
    inputs: [
      {
        id: 'task',
        label: 'What task do you want to automate?',
        type: 'textarea',
        placeholder: 'Describe the repetitive task...',
        required: true
      },
      {
        id: 'frequency',
        label: 'How often does this happen?',
        type: 'select',
        options: [
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'as-needed', label: 'As Needed' }
        ],
        required: true
      },
      {
        id: 'currentProcess',
        label: 'Current process',
        type: 'textarea',
        placeholder: 'Describe how you currently do this...',
        required: false
      },
      {
        id: 'tools',
        label: 'Tools/platforms available',
        type: 'textarea',
        placeholder: 'e.g., Email, Slack, Notion, Zapier, etc.',
        required: false
      }
    ],
    generatePrompt: function(inputs) {
      let prompt = `Help me design an automated workflow for: ${inputs.task || '[task]'}\n\n`;
      prompt += `Frequency: ${inputs.frequency || 'as needed'}\n\n`;
      if (inputs.currentProcess) {
        prompt += `Current process: ${inputs.currentProcess}\n\n`;
      }
      if (inputs.tools) {
        prompt += `Available tools: ${inputs.tools}\n\n`;
      }
      prompt += `Please provide:\n1. Step-by-step workflow design\n2. Tools/services to use\n3. Setup instructions\n4. Testing approach`;
      return prompt;
    }
  }
};

// Get mission template by category ID
window.getMissionTemplate = function(categoryId) {
  // Map category IDs to mission templates
  const categoryMap = {
    'prompt-engineering': 'prompt-engineering',
    'writing-communication': 'writing-communication',
    'learning-study': 'learning-study',
    'productivity': 'productivity',
    'health-wellbeing': 'health-wellbeing',
    'parenting-teaching': 'send-carers',
    'ai-automation': 'automation'
  };

  const templateId = categoryMap[categoryId];
  return templateId ? window.MISSION_TEMPLATES[templateId] : null;
};

