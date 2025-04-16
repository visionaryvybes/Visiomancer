import React from 'react';
import AnimatedIcon from './AnimatedIcon';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  StarIcon,
  BellIcon,
  SparklesIcon,
  ArrowRightIcon,
  FireIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface AnimationShowcaseItemProps {
  type: string;
  icon: React.ReactNode;
  description: string;
}

const AnimationShowcaseItem: React.FC<AnimationShowcaseItemProps> = ({ type, icon, description }) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded-md bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
      <AnimatedIcon 
        icon={icon} 
        type={type as any} 
        size="lg" 
      />
      <h3 className="mt-2 font-medium text-sm">{type}</h3>
      <p className="text-xs text-gray-400 text-center mt-1">{description}</p>
    </div>
  );
};

const IconShowcase: React.FC = () => {
  const animations = [
    { type: 'pulse', icon: <HeartIcon />, description: 'Gentle pulsing effect, great for notifications and alerts' },
    { type: 'bounce', icon: <BellIcon />, description: 'Bouncing animation, perfect for drawing attention' },
    { type: 'rotate', icon: <SparklesIcon />, description: 'Rotating animation for loading states or processes' },
    { type: 'scale', icon: <StarIcon />, description: 'Scaling effect for interactive elements' },
    { type: 'shake', icon: <ShoppingCartIcon />, description: 'Shake animation for notifications or errors' },
    { type: 'glow', icon: <LightBulbIcon />, description: 'Glowing effect for highlighting important features' },
    { type: 'wave', icon: <ArrowRightIcon />, description: 'Waving animation, good for directional cues' },
    { type: 'none', icon: <FireIcon />, description: 'Base state without animations, but still has hover effects' },
    { 
      type: ['pulse', 'rotate'], 
      icon: <SparklesIcon />, 
      description: 'Combined animations showcase multiple effects at once' 
    },
  ];

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800">
      <h2 className="text-xl font-bold mb-6 text-white">Animated Icons Showcase</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {animations.map((anim, index) => (
          <AnimationShowcaseItem 
            key={index} 
            type={Array.isArray(anim.type) ? anim.type.join(' + ') : anim.type} 
            icon={anim.icon} 
            description={anim.description}
          />
        ))}
      </div>
    </div>
  );
};

export default IconShowcase; 