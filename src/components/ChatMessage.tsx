import { motion } from 'motion/react';
import { ChefHat, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatText = (text: string) => {
    // Simple formatting for better readability
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex gap-2 md:gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!message.isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-7 h-7 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
        >
          <ChefHat className="text-white" size={14} />
        </motion.div>
      )}

      <div className={`max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg ${message.isUser ? 'order-1' : ''}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-sm ${
            message.isUser
              ? 'bg-green-500 text-white rounded-br-md'
              : 'bg-card text-card-foreground border border-border rounded-bl-md'
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
            {formatText(message.text)}
          </p>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className={`text-xs text-muted-foreground mt-1 px-1 ${
            message.isUser ? 'text-right' : 'text-left'
          }`}
        >
          {formatTime(message.timestamp)}
        </motion.p>
      </div>

      {message.isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-7 h-7 md:w-8 md:h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-1"
        >
          <User className="text-muted-foreground" size={14} />
        </motion.div>
      )}
    </motion.div>
  );
}