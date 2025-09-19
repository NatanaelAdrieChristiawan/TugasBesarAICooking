import { motion } from 'motion/react';
import { ChefHat } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-2 md:gap-3 justify-start">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-7 h-7 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
      >
        <ChefHat className="text-white" size={14} />
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card border border-border rounded-2xl rounded-bl-md px-3 md:px-4 py-2 md:py-3 shadow-sm"
      >
        <div className="flex items-center gap-1">
          <motion.div
            className="w-2 h-2 bg-muted-foreground rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-muted-foreground rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-muted-foreground rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </motion.div>
    </div>
  );
}