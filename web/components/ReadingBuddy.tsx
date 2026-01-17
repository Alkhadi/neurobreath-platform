'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Bot
} from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { cn } from '@/lib/utils';
import { getPageAssistantConfig } from '@/lib/page-assistant-registry';

interface Message {
  id: string;
  type: 'user' | 'buddy';
  content: string;
  timestamp: number;
}

interface ReadingBuddyProps {
  onStartTutorial?: () => void;
}

export default function ReadingBuddy({ onStartTutorial }: ReadingBuddyProps) {
  const pathname = usePathname();
  const pageConfig = getPageAssistantConfig(pathname);
  const { readingBuddy } = pageConfig;
  
  // Extract dynamic content from config
  const quickQuestions = readingBuddy.quickQuestions;
  const responses = useMemo(() => readingBuddy.responses || {}, [readingBuddy.responses]);
  const welcomeMessage = readingBuddy.intro;
  const inputPlaceholder = readingBuddy.inputPlaceholder;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { speak, cancel, speaking, supported: ttsSupported } = useSpeechSynthesis();
  const { 
    startListening, 
    stopListening, 
    transcript, 
    isListening, 
    supported: sttSupported,
    resetTranscript 
  } = useSpeechRecognition();

  // Initial greeting when modal opens
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const greeting: Message = {
        id: 'welcome',
        type: 'buddy',
        content: welcomeMessage,
        timestamp: Date.now()
      };
      setMessages([greeting]);
      setHasGreeted(true);
      
      if (autoSpeak && ttsSupported) {
        setTimeout(() => {
          speak(welcomeMessage);
        }, 300);
      }
    }
  }, [isOpen, hasGreeted, autoSpeak, speak, ttsSupported, welcomeMessage]);

  // Reset greeting when pathname changes
  useEffect(() => {
    setHasGreeted(false);
  }, [pathname]);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickQuestion = useCallback((question: string) => {
    cancel(); // Stop any ongoing speech
    stopListening(); // Stop any ongoing listening

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

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

      if (autoSpeak && ttsSupported) {
        speak(response);
      }
    }, 1000);
  }, [cancel, stopListening, autoSpeak, ttsSupported, speak, responses]);

  const handleGuidedTour = () => {
    cancel();
    stopListening();
    setIsOpen(false);
    onStartTutorial?.();
  };

  const handleSendMessage = useCallback((customInput?: string) => {
    cancel(); // Stop any ongoing speech
    stopListening(); // Stop any ongoing listening
    const messageText = customInput || inputValue.trim();
    if (!messageText) return;

    cancel(); // Stop any ongoing speech
    stopListening(); // Stop any ongoing listening

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: messageText,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    resetTranscript();

    // Simulate thinking
    setIsTyping(true);

    // Add buddy response after delay
    setTimeout(() => {
      // Check if question matches any predefined questions
      let response = responses['default'];
      for (const [key, value] of Object.entries(responses)) {
        if (messageText.toLowerCase().includes(key.toLowerCase().substring(0, 10))) {
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

      if (autoSpeak && ttsSupported) {
        speak(response);
      }
    }, 1000);
  }, [inputValue, cancel, stopListening, resetTranscript, autoSpeak, ttsSupported, speak, responses]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      cancel(); // Stop any ongoing speech before listening
      startListening();
    }
  };

  const toggleAutoSpeak = () => {
    if (speaking) {
      cancel();
    }
    setAutoSpeak(!autoSpeak);
  };

  const speakMessage = (text: string) => {
    if (speaking) {
      cancel();
    } else {
      speak(text);
    }
  };

  const handleClose = () => {
    cancel();
    stopListening();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white group"
        aria-label="Open Reading Buddy chat"
      >
        <Bot className="w-8 h-8 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] p-0 flex flex-col max-h-[85vh]">
          <DialogHeader className="p-4 pb-2 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold">{readingBuddy.heading}</DialogTitle>
                  <p className="text-xs text-muted-foreground">{readingBuddy.subheading}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ttsSupported && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleAutoSpeak}
                    className={cn(
                      "h-8 w-8",
                      autoSpeak ? "text-primary" : "text-muted-foreground"
                    )}
                    title={autoSpeak ? "Auto-speak on" : "Auto-speak off"}
                  >
                    {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === 'buddy' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      message.type === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.type === 'buddy' && ttsSupported && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakMessage(message.content)}
                        className="mt-1 h-6 px-2 text-xs opacity-70 hover:opacity-100"
                      >
                        {speaking ? <VolumeX className="h-3 w-3 mr-1" /> : <Volume2 className="h-3 w-3 mr-1" />}
                        {speaking ? 'Stop' : 'Listen'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Tour Button - only show if tour steps exist */}
          {onStartTutorial && pageConfig.tour.steps.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-gradient-to-r from-primary/5 to-accent/5">
              <Button
                onClick={handleGuidedTour}
                className="w-full gap-2"
                variant="default"
              >
                <MapPin className="h-4 w-4" />
                Take a Guided Tour of the Page
              </Button>
            </div>
          )}

          {/* Quick Questions */}
          <div className="px-4 py-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isTyping}
                  className="h-7 text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 pt-2 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                id="reading-buddy-input"
                name="message"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : inputPlaceholder}
                disabled={isTyping || isListening}
                className="flex-1"
                aria-label="Ask your buddy a question"
              />
              {sttSupported && (
                <Button 
                  type="button" 
                  size="icon" 
                  variant={isListening ? "default" : "outline"}
                  onClick={toggleVoiceInput}
                  disabled={isTyping}
                  className={cn(
                    isListening && "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  )}
                  title={isListening ? "Stop listening" : "Speak your question"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <Button type="submit" size="icon" disabled={isTyping || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* DEV-ONLY: Config indicator */}
          {process.env.NODE_ENV === 'development' && (
            <div className="px-4 py-2 border-t border-border bg-yellow-50 dark:bg-yellow-950/30">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center font-mono">
                🔧 Active assistant config: <strong>{pageConfig.pageKey}</strong> | Route: {pathname}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
