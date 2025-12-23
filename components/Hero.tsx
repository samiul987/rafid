
import React from 'react';
import { PortfolioData } from '../types';
import { ArrowRight, Star, Download, Zap } from 'lucide-react';

interface HeroProps {
  data: PortfolioData;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const handleDownloadCV = () => {
    const content = `CV: ${data.name}\n${data.role}\n${data.bio}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Profile.txt');
    link.click();
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative z-10 space-y-10 animate-fade-in">
          <div className="inline-flex items-center space-x-3 px-5 py-2 glass rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-purple-500/20 text-purple-400">
            <Zap size={14} className="animate-pulse" /><span>Active Intelligence System</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-blue-400 font-grotesk tracking-tighter">Accessing: {data.name}</h2>
            <h1 className="text-6xl lg:text-9xl font-grotesk font-extrabold leading-[1.1] tracking-tighter">
              <span className="block text-white opacity-20">{data.heroSubText}</span>
              <span className="block bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent pb-2">{data.heroMainText}</span>
            </h1>
          </div>
          <p className="text-gray-400 text-xl leading-relaxed max-w-xl font-medium tracking-tight">{data.bio}</p>
          <div className="flex flex-wrap gap-5 pt-4">
            <button onClick={() => document.getElementById('portfolio')?.scrollIntoView({behavior:'smooth'})} className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center space-x-3"><span>Explore Lab</span><ArrowRight size={20} /></button>
            <button onClick={handleDownloadCV} className="px-10 py-5 glass rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all hover:bg-white/5 border border-white/10 flex items-center space-x-3"><span>Profile.exe</span></button>
          </div>
        </div>
        <div className="relative animate-scale-in">
          <div className="absolute inset-0 bg-purple-500/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10 w-full max-w-[500px] aspect-[4/5] mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-400 to-blue-500 rounded-[3rem] rotate-3 transition-transform group-hover:rotate-0 duration-700 opacity-20"></div>
            <div className="absolute inset-0 overflow-hidden rounded-[3rem] border border-white/5 bg-[#030014]">
              <img src={data.heroImage} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="absolute -bottom-6 -right-6 glass p-6 rounded-3xl border border-white/10 backdrop-blur-2xl animate-bounce-slow">
               <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Status</p>
               <p className="text-white font-bold font-grotesk">Fully Operational</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
