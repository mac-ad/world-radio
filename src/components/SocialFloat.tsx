import { Coffee, Github, Twitter, Linkedin, Mail, Globe } from 'lucide-react';

interface SocialFloatProps {
  isDarkMode: boolean;
}

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    icon: Github,
    url: import.meta.env.VITE_GITHUB_URL,
    color: '#333',
    darkColor: '#fff',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: import.meta.env.VITE_TWITTER_URL,
    color: '#1DA1F2',
    darkColor: '#1DA1F2',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: import.meta.env.VITE_LINKEDIN_URL,
    color: '#0A66C2',
    darkColor: '#0A66C2',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:' + import.meta.env.VITE_EMAIL_URL,
    color: '#EA4335',
    darkColor: '#EA4335',
  },
  {
    name: "website",
    icon: Globe,
    url: import.meta.env.VITE_WEBSITE_URL,
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
          href={import.meta.env.VITE_KOFI_URL}
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

