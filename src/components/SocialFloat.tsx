import { Coffee, Github, Twitter, Linkedin, Mail, Globe } from 'lucide-react';

interface SocialFloatProps {
  isDarkMode: boolean;
}

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/mac-ad',
    color: '#333',
    darkColor: '#fff',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/_macad',
    color: '#1DA1F2',
    darkColor: '#1DA1F2',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/in/macad',
    color: '#0A66C2',
    darkColor: '#0A66C2',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:macad626@gmail.com',
    color: '#EA4335',
    darkColor: '#EA4335',
  },
  {
    name: "website",
    icon: Globe,
    url: "https://macad.dev",
    color: "#007AFF",
    darkColor: "#007AFF",
  }
];

export function SocialFloat({ isDarkMode }: SocialFloatProps) {
  return (
    <div className="social-float">
      {/* Expanded Panel */}
      <div className="social-panel">
        <div className="social-panel-header">
          <span>Let's Connect!</span>
        </div>

        <p className="social-panel-desc">
          Built for radio enthusiasts worldwide. Help keep this project alive!
        </p>

        <div className="social-links">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title={link.name}
              style={{ '--link-color': isDarkMode ? link.darkColor : link.color } as React.CSSProperties}
            >
              <link.icon size={20} />
            </a>
          ))}
        </div>

        <a
          href="https://ko-fi.com/macad626"
          target="_blank"
          rel="noopener noreferrer"
          className="support-btn-large"
        >
          <Coffee size={18} />
          <span>Buy me a Kofi!</span>
        </a>
      </div>

    </div>
  );
}

