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
      text: 'Halo! Saya Asisten Masak AI Anda. Mau cari resep apa hari ini? Atau mungkin Anda punya bahan-bahan di kulkas dan butuh inspirasi?',
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

  const mockResponses = {
    'resep': [
      'Baik! Resep mana yang ingin Anda coba? Saya punya banyak pilihan mulai dari makanan tradisional Indonesia hingga masakan internasional.',
      'Saya akan berikan resep yang mudah diikuti. Apakah Anda ingin resep untuk sarapan, makan siang, atau makan malam?'
    ],
    'ayam': [
      'Resep Ayam Goreng Kremes:\n\nBahan:\n- 1 ekor ayam, potong 8\n- 2 sdm tepung terigu\n- 1 sdm tepung beras\n- Bumbu halus: bawang putih, kunyit, ketumbar\n\nCara:\n1. Marinasi ayam dengan bumbu halus 30 menit\n2. Balur dengan campuran tepung\n3. Goreng hingga golden brown\n\nTips: Goreng dengan api sedang agar matang merata!'
    ],
    'nasi dan telur': [
      'Perfect! Dengan nasi dan telur, Anda bisa membuat Nasi Goreng Sederhana:\n\n🍳 Nasi Goreng Telur:\n- Tumis bawang putih\n- Masukkan telur, orak-arik\n- Tambahkan nasi, aduk rata\n- Bumbui dengan kecap manis, garam, merica\n- Taburi bawang goreng\n\nMau saya berikan variasi lain?'
    ],
    'konversi': [
      '1 gelas = 240 ml\n\nKonversi lainnya:\n- 1 sendok makan (sdm) = 15 ml\n- 1 sendok teh (sdt) = 5 ml\n- 1 cup = 240 ml\n- 1 ounce = 30 ml\n\nAda konversi lain yang ingin Anda tahu?'
    ],
    'pasta': [
      'Pasta Aglio Olio Sederhana:\n\nBahan:\n- 200g spaghetti\n- 4 siung bawang putih, iris tipis\n- 3 sdm olive oil\n- Cabai merah, potong\n- Peterseli, cincang\n- Parmesan cheese\n\nCara:\n1. Rebus pasta al dente\n2. Tumis bawang putih di olive oil\n3. Masukkan pasta, aduk\n4. Tambahkan cabai, peterseli\n5. Taburi parmesan\n\nSiap dalam 15 menit!'
    ],
    'default': [
      'Itu pertanyaan menarik! Sebagai asisten masak AI, saya bisa membantu Anda dengan resep, konversi takaran, tips memasak, dan saran berdasarkan bahan yang tersedia.',
      'Saya siap membantu! Coba tanyakan tentang resep masakan, konversi satuan (seperti cup ke ml), atau sebutkan bahan yang Anda punya untuk saran resep.',
      'Hmm, sepertinya pertanyaan Anda agak di luar keahlian memasak saya. Bagaimana kalau kita bicara tentang resep atau tips memasak? 👩‍🍳'
    ]
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('ayam') && message.includes('goreng')) {
      return mockResponses.ayam[0];
    } else if (message.includes('nasi') && message.includes('telur')) {
      return mockResponses['nasi dan telur'][0];
    } else if (message.includes('gelas') || message.includes('ml') || message.includes('konversi')) {
      return mockResponses.konversi[0];
    } else if (message.includes('pasta') || message.includes('spaghetti')) {
      return mockResponses.pasta[0];
    } else if (message.includes('resep')) {
      return mockResponses.resep[Math.floor(Math.random() * mockResponses.resep.length)];
    } else {
      return mockResponses.default[Math.floor(Math.random() * mockResponses.default.length)];
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
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(userMessage.text),
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
    // Focus input on desktop, but not on mobile to avoid keyboard issues
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
      {/* Header */}
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

      {/* Chat Messages */}
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

      {/* Input Area */}
      <div className="bg-card border-t border-border px-3 md:px-4 py-3 md:py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          {/* Suggestion Chips */}
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

          {/* Input Field */}
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