import React from 'react';
import { Send, Facebook, Video } from 'lucide-react';

export function SocialLinks({ className = '', iconSize = 18 }) {
  const socials = [
    {
      name: 'Telegram',
      url: 'https://t.me/Anchor_Solutions',
      label: 'Follow Anchor Solution on Telegram',
      icon: <Send size={iconSize} />,
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61594683434691',
      label: 'Follow Anchor Solution on Facebook',
      icon: <Facebook size={iconSize} />,
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@anchor_solutions1',
      label: 'Follow Anchor Solution on TikTok',
      icon: <Video size={iconSize} />,
    },
  ];

  return (
    <div className={`social-bar ${className}`}>
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon-btn"
          aria-label={s.label}
          title={s.label}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
