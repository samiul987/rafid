
import React from 'react';
import { PortfolioData } from '../types';
import { Twitter, Instagram, Linkedin, Github, Facebook } from 'lucide-react';

interface FooterProps {
  data: PortfolioData;
}

const Footer: React.FC<FooterProps> = ({ data }) => {
  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Twitter': return Twitter;
      case 'Instagram': return Instagram;
      case 'Linkedin': return Linkedin;
      case 'Github': return Github;
      case 'Facebook': return Facebook;
      default: return Twitter;
    }
  };

  return (
    <footer className="py-24 border-t border-white/5 bg-[#030014]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
                    fill="none" 
                    stroke="url(#footerLogoGradient)" 
                    strokeWidth="6" 
                  />
                  <path 
                    d="M35 30 L55 30 C65 30 65 45 55 45 L35 45 L35 70 M45 45 L60 70" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                  />
                </svg>
              </div>
              <span className="font-grotesk text-2xl font-bold tracking-tighter text-white">Rafid Studio</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">Pioneering digital frontiers with aesthetics that blend raw creativity with technical perfection.</p>
            <div className="flex space-x-4">
              {data.socials.map((social) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all border border-white/5"><Icon size={20} /></a>
                );
              })}
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold font-grotesk text-lg tracking-tight">Navigation</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {['home', 'about', 'services', 'portfolio', 'contact'].map(link => (
                <li key={link}><button onClick={() => handleNavClick(link)} className="hover:text-purple-400 transition-colors capitalize font-bold tracking-widest">{link}</button></li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold font-grotesk text-lg tracking-tight">Sync</h4>
            <p className="text-gray-400 text-sm">Subscribe to the studio feed for intelligence on new projects.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Sync Successful."); (e.target as HTMLFormElement).reset(); }} className="flex glass p-1 rounded-2xl border border-white/5">
              <input required type="email" placeholder="Email Address" className="bg-transparent border-none outline-none px-4 py-3 flex-1 text-sm text-white" />
              <button type="submit" className="bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-500 transition-colors">Join</button>
            </form>
          </div>
        </div>
        <div className="mt-24 pt-8 border-t border-white/5 text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} {data.name} Operations. All protocols active.</p>
          <div className="flex items-center space-x-6">
             <span>SECURE TERMINAL</span>
             <span className="text-purple-500">v6.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
