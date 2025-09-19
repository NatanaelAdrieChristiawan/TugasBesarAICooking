import { useState } from 'react';
import { IntroSlides } from './components/IntroSlides';
import { ChatInterface } from './components/ChatInterface';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <ThemeProvider>
      <div className="size-full bg-background text-foreground">
        {!showChat ? (
          <IntroSlides onComplete={() => setShowChat(true)} />
        ) : (
          <ChatInterface />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}