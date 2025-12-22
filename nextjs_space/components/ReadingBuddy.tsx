'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, StopCircle, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'buddy';
  content: string;
  timestamp: number;
}

const quickQuestions = [
  'How do I start my first game?',
  'How do I earn rewards?',
  'What are streaks?',
  'How do I track my progress?',
  'Tell me about the Vowel Universe'
];

const responses: { [key: string]: string } = {
  'How do I start my first game?': 
    "Great question! 🎮 Just scroll down the page and click on any activity card that catches your eye. Each card has a colorful design and tells you what it does. I recommend starting with the Phonics Song Player or Phonics Sounds Lab - they're super fun! Just click the play button and follow along. You've got this!",
  
  'How do I earn rewards?':
    "Earning rewards is so exciting! 🎉 As you complete activities and practice, you'll automatically unlock reward cards. You can see your rewards by scrolling to the NeuroBreath Reward Cards section at the bottom of the page. Keep practicing every day to unlock more awesome rewards!",
  
  'What are streaks?':
    "Streaks are like your winning streak! 🔥 Every day you practice, your streak grows. You can see your current streak in the Streak Toolkit card near the top of the page. It shows how many days in a row you've practiced, total minutes, and badges earned. Try to keep your streak going - it's really motivating!",
  
  'How do I track my progress?':
    "Tracking your progress is easy! 📊 Many activities save your progress automatically on your device. You'll see progress bars, stars, and badges throughout the page. The Streak Toolkit shows your overall progress, and each activity card displays how much you've completed. Everything saves automatically so you can pick up right where you left off!",
  
  'Tell me about the Vowel Universe':
    "The Vowel Universe is an amazing adventure! 🌌 It's a special activity where you explore different vowel patterns like short vowels (a, e, i, o, u) and long vowels. Each pattern has examples and practice words. It's like exploring different planets, but instead of planets, you're discovering how vowels work! Scroll down to find it and start exploring!",
  
  'guided_tour':
    "🎯 Let me give you a quick tour of this page!\n\n📝 At the top, you can create your profile and set practice goals.\n⏱️ The Practice Timer helps you focus for set periods.\n🫁 The Breathing Exercise helps you stay calm and focused.\n📖 Reading Assessment helps understand your current level.\n🎵 Phonics activities teach letter sounds with fun animations.\n🎮 Interactive games like Rapid Naming and Word Construction make learning fun.\n📚 Vocabulary builders help expand your word knowledge.\n🏆 Rewards and streaks keep you motivated!\n\nJust scroll through and try what looks interesting! Each card is designed to help a different reading skill. Have fun exploring!",
  
  'default':
    "That's a wonderful question! 🌟 I'm here to help you explore all the fun activities on this page. Each activity is designed to help you become a better reader in a different way. Feel free to try any activity that looks interesting, and remember - learning to read is an adventure! If you have specific questions about any activity, just ask me!"
};

export default function ReadingBuddy() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'buddy',
        content: "Hi there! I'm Reading Buddy, your friendly guide for NeuroBreath. 👋 I'm so excited you're here!\n\nThis page is like a super fun playground for reading! We have lots of games and activities to help you become a superstar reader. To get started, just pick any activity that looks interesting to you. Each one helps with a different part of reading, and we'll learn together! Which adventure do you want to try first?",
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickQuestion = (question: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question,
      timestamp: Date.now()
    };
    setMessages([...messages, userMessage]);

    // Simulate thinking
    setIsTyping(true);

    // Add buddy response after delay
    setTimeout(() => {
      const response = responses[question] || responses['default'];
      const buddyMessage: Message = {
        id: `buddy-${Date.now()}`,
        type: 'buddy',
        content: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, buddyMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleGuidedTour = () => {
    handleQuickQuestion('guided_tour');
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: Date.now()
    };
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate thinking
    setIsTyping(true);

    // Add buddy response after delay
    setTimeout(() => {
      // Check if question matches any predefined questions
      let response = responses['default'];
      for (const [key, value] of Object.entries(responses)) {
        if (inputValue.toLowerCase().includes(key.toLowerCase().substring(0, 10))) {
          response = value;
          break;
        }
      }

      const buddyMessage: Message = {
        id: `buddy-${Date.now()}`,
        type: 'buddy',
        content: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, buddyMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleStop = () => {
    setIsTyping(false);
    toast.info('Chat paused. Feel free to ask another question!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
              Reading Buddy
            </h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
              Your friendly guide
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 max-h-96 overflow-y-auto space-y-3"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleStop}
            variant="outline"
            size="sm"
            className="border-indigo-300 hover:bg-indigo-50 text-indigo-700"
          >
            <StopCircle className="w-4 h-4 mr-2" />
            Stop
          </Button>
          <Button
            onClick={handleGuidedTour}
            size="sm"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Take a Guided Tour of the Page
          </Button>
        </div>

        {/* Quick Questions */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
            Quick questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-xs px-3 py-1.5 bg-white/60 dark:bg-gray-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800 transition-all hover:scale-105"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about this page..."
            className="flex-1 border-indigo-300 focus:border-indigo-500 bg-white dark:bg-gray-800"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Helper Text */}
        <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <p>
            I'm here to help you navigate and learn! Ask me about any activity on this page.
          </p>
        </div>
      </div>
    </Card>
  );
}
