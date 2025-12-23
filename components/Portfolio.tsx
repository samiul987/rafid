
import React, { useState, useMemo } from 'react';
import { PortfolioData, Project } from '../types';
import { ExternalLink, X, Play, Video, Activity } from 'lucide-react';

interface PortfolioProps {
  data: PortfolioData;
}

const Portfolio: React.FC<PortfolioProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(data.projects.map(p => p.category)));
    return ['All', ...uniqueCategories];
  }, [data.projects]);

  const filteredProjects = useMemo(() => {
    return activeTab === 'All' 
      ? data.projects 
      : data.projects.filter(p => p.category === activeTab);
  }, [activeTab, data.projects]);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 space-y-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <h4 className="text-purple-400 font-bold uppercase tracking-[0.4em] text-[10px] animate-fade-in">{data.portfolioSubtitle}</h4>
            <h2 className="text-6xl md:text-8xl font-grotesk font-extrabold tracking-tighter leading-none animate-scale-in">
              Cinematic <span className="text-white/20">Vault</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 glass p-2 rounded-[2.5rem] overflow-x-auto whitespace-nowrap scrollbar-hide border border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-700 ${
                  activeTab === cat 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_20px_40px_rgba(147,51,234,0.3)] scale-105' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="group relative rounded-[4rem] overflow-hidden glass border border-white/5 animate-scale-in hover:border-purple-500/50 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] transition-all duration-1000 bg-black/40"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[16/11] overflow-hidden relative">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1.5s] ease-out grayscale-[10%] group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Digital Stream Active Badge */}
                  {project.videoUrl && (
                    <div className="absolute top-8 right-8 px-6 py-3 glass rounded-full flex items-center space-x-3 border border-white/10 z-10 animate-pulse backdrop-blur-3xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,1)]"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">4K Theatre</span>
                    </div>
                  )}

                  {/* Aesthetic Play Trigger */}
                  {project.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 cursor-pointer z-10" onClick={() => setLightboxProject(project)}>
                      <div className="w-28 h-28 bg-white/5 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/20 scale-50 group-hover:scale-100 transition-all duration-1000 group-hover:rotate-12 group-hover:bg-purple-600 group-hover:border-transparent group-hover:shadow-[0_0_60px_rgba(147,51,234,0.6)]">
                        <Play size={40} className="text-white fill-white ml-2" />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/40 to-transparent opacity-90 group-hover:opacity-40 transition-opacity duration-700"></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-12 md:p-16">
                  <div className="space-y-6 translate-y-16 group-hover:translate-y-0 transition-all duration-1000 ease-out">
                    <div className="space-y-2">
                      <span className="text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] mb-1 block">{project.category}</span>
                      <h3 className="text-4xl md:text-5xl font-extrabold font-grotesk text-white leading-none tracking-tighter">{project.title}</h3>
                    </div>
                    <div className="flex items-center space-x-6 pt-4">
                      <button 
                        onClick={() => setLightboxProject(project)}
                        className="flex-1 py-6 bg-white text-[#030014] rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95"
                      >
                        {project.videoUrl ? 'Execute Reel' : 'Case Review'}
                      </button>
                      <a 
                        href={project.link} 
                        target="_blank" 
                        className="p-6 glass rounded-3xl hover:bg-purple-500/20 text-white transition-all border border-white/10 hover:rotate-12 transform"
                      >
                        <ExternalLink size={28} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 text-center glass rounded-[5rem] border-2 border-dashed border-white/5 bg-white/1 animate-pulse">
              <p className="text-gray-600 font-black uppercase tracking-[0.6em] text-xs">Segment Offline: Connection Lost</p>
            </div>
          )}
        </div>
      </div>

      {/* Cinematic Theater Mode (Lightbox) */}
      {lightboxProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-16 bg-black/98 animate-fade-in backdrop-blur-[60px]">
          <button 
            onClick={() => setLightboxProject(null)}
            className="absolute top-12 right-12 p-8 text-white hover:bg-white/10 rounded-full transition-all z-[130] glass border border-white/10 group active:scale-90"
          >
            <X size={40} className="group-hover:rotate-90 transition-transform" />
          </button>
          
          <div className="relative w-full h-full flex flex-col items-center justify-center max-w-8xl mx-auto space-y-12">
            {lightboxProject.videoUrl ? (
              /* MODIFIED: Removed aspect-video and bg-black to ensure "Auto Frame" behavior with no extra black space */
              <div className="max-w-full max-h-[75vh] glass rounded-[3rem] md:rounded-[5rem] overflow-hidden border border-white/10 shadow-[0_0_150px_rgba(147,51,234,0.25)] relative animate-scale-in flex items-center justify-center">
                {lightboxProject.videoUrl.includes('youtube.com') || lightboxProject.videoUrl.includes('vimeo.com') ? (
                  <iframe 
                    src={lightboxProject.videoUrl} 
                    className="w-full aspect-video border-0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                ) : (
                  <video 
                    src={lightboxProject.videoUrl} 
                    className="max-w-full max-h-full block object-contain" 
                    controls 
                    autoPlay 
                    muted 
                    loop
                    preload="auto"
                    playsInline
                    poster={lightboxProject.imageUrl}
                  />
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img 
                  src={lightboxProject.imageUrl} 
                  alt={lightboxProject.title}
                  className="max-w-full max-h-full object-contain rounded-[5rem] shadow-[0_0_100px_rgba(147,51,234,0.1)] animate-scale-in border border-white/10 p-2"
                />
              </div>
            )}
            
            <div className="text-center space-y-5 bg-[#030014]/60 backdrop-blur-3xl p-16 rounded-[4.5rem] border border-white/5 w-full max-w-4xl animate-fade-in shadow-2xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-3 bg-purple-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.5em] shadow-xl">
                 Theater Active
              </div>
              <span className="text-purple-400 font-black uppercase text-[11px] tracking-[0.6em] block">{lightboxProject.category}</span>
              <h3 className="text-6xl md:text-7xl font-extrabold font-grotesk text-white tracking-tighter leading-none">{lightboxProject.title}</h3>
              {lightboxProject.videoUrl && (
                <div className="flex items-center justify-center space-x-6 text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] mt-6 bg-white/5 py-4 px-10 rounded-3xl border border-white/5">
                  <Activity size={18} className="animate-pulse"/>
                  <span>Cinematic Feed: High Fidelity 60FPS</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
