import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ChefHat } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ThemeToggle } from './ThemeToggle';
import { useViewportHeight } from './MobileOptimizations';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Saya Asisten Masak AI Anda. Mau cari resep apa hari ini?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const viewportHeight = useViewportHeight();

  const suggestionChips = [
    'Resep Ayam Goreng',
    'Saya punya nasi dan telur',
    '1 gelas berapa ml?',
    'Resep pasta sederhana'
  ];

  const fetchAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Maaf, terjadi kesalahan saat menghubungi Chef AI. Silakan coba lagi nanti.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    const aiText = await fetchAIResponse(currentInput);

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: aiText,
      isUser: false,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col bg-background"
      style={{ height: viewportHeight }}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card border-b border-border px-4 py-3 md:py-4 sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <ChefHat className="text-white" size={20} />
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-foreground">AI Cooking Assistant</h1>
          </div>
          <ThemeToggle />
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-card border-t border-border px-3 md:px-4 py-3 md:py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {suggestionChips.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 bg-muted text-muted-foreground rounded-full hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>

          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ketik nama resep, bahan, atau konversi..."
              className="flex-1 border-border focus:border-green-500 focus:ring-green-500 rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`rounded-full w-10 h-10 md:w-12 md:h-12 p-0 transition-all duration-300 ${
                inputValue.trim() && !isTyping
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-105'
                  : 'bg-muted cursor-not-allowed'
              }`}
            >
              <Send className="text-white" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}