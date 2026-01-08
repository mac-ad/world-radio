import { useState } from 'react';
import { Coffee, Github, Twitter, Linkedin, Mail, Globe, Info, X } from 'lucide-react';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Info Button - Top Left */}
      <button
        className="social-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Show info and social links"
      >
        <Info size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="social-mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="social-mobile-panel" onClick={(e) => e.stopPropagation()}>
            <button
              className="social-mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

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
                  <link.icon size={22} />
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
      )}

      {/* Desktop Version - Bottom Left */}
      <div className="social-float">
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
    </>
  );
}

