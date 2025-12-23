
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { PortfolioData } from '../types';

interface NavbarProps {
  onAdminToggle: () => void;
  data: PortfolioData;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminToggle, data }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    if (newCount >= 5) {
      onAdminToggle();
      setLogoClicks(0);
    } else {
      setLogoClicks(newCount);
      setTimeout(() => setLogoClicks(0), 2000);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-[#030014]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-purple-500/5' : 'py-8'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div 
          onClick={handleLogoClick}
          className="flex items-center space-x-4 cursor-pointer group select-none"
        >
          <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
            {/* New Uniform High-End Logo Design */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9333ea" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              {/* Outer hexagonal frame */}
              <path 
                d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
                fill="none" 
                stroke="url(#logoGradient)" 
                strokeWidth="4" 
                strokeLinejoin="round"
                className="opacity-40 group-hover:opacity-100 transition-opacity duration-500"
              />
              {/* Inner stylized R shape */}
              <path 
                d="M35 30 L55 30 C65 30 65 45 55 45 L35 45 L35 70 M45 45 L60 70" 
                fill="none" 
                stroke="white" 
                strokeWidth="7" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {/* Decorative dots */}
              <circle cx="50" cy="5" r="3" fill="#3b82f6" />
              <circle cx="50" cy="95" r="3" fill="#9333ea" />
            </svg>
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-grotesk text-2xl font-bold tracking-tighter text-white group-hover:text-purple-400 transition-colors">Rafid</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover:text-blue-400 transition-colors">Studio</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-gray-400 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.25em]"
            >
              {link.name}
            </a>
          ))}
          
          <button 
            onClick={() => handleNavClick('#contact')}
            className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl shadow-purple-500/10 active:scale-95"
          >
            Let's Talk
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 glass rounded-xl">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass backdrop-blur-2xl border-b border-white/10 py-12 px-6 space-y-8 flex flex-col items-center shadow-2xl animate-scale-in">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-gray-300 hover:text-purple-400 text-3xl font-grotesk font-black tracking-tighter"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => handleNavClick('#contact')}
            className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-lg"
          >
            Let's Talk
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
