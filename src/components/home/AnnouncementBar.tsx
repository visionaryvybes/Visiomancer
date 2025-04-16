import { Tag } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnnouncementProps {
  messages: string[];
  interval?: number; // Time in ms between message changes
}

export default function AnnouncementBar({ 
  messages, 
  interval = 5000 
}: AnnouncementProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (messages.length <= 1) return;

    const cycleMessages = () => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 500); // Half a second for animation
    };

    const timer = setInterval(cycleMessages, interval);
    return () => clearInterval(timer);
  }, [messages, interval]);

  if (!messages.length) return null;

  return (
    <div className="w-full max-w-6xl bg-gradient-to-r from-amber-500 to-pink-500 py-2 px-4 rounded-full mb-8 text-center text-white font-medium flex items-center justify-center gap-2">
      <Tag size={16} />
      <span className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
} 