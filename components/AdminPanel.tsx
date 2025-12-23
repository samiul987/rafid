
import React, { useState, useEffect, useRef } from 'react';
import { PortfolioData, Project, Skill, Service, SocialLink, Review } from '../types';
import { 
  X, Save, Plus, Trash2, RefreshCw, LogOut, Star, Briefcase, 
  LayoutGrid, Lock, User, ImageIcon, Play, FileVideo, Sparkles, 
  Upload, Activity, ShieldCheck, AlertTriangle, MessageSquare, 
  Share2, Type, Video, CheckCircle, ChevronRight, Zap, Target, Globe, 
  Settings as SettingsIcon, Link as LinkIcon, MapPin, FileText
} from 'lucide-react';

interface AdminPanelProps {
  data: PortfolioData;
  onUpdate: (data: PortfolioData) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ data, onUpdate, onClose }) => {
  const [localData, setLocalData] = useState<PortfolioData>(data);
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'services' | 'projects' | 'socials' | 'sections' | 'messages' | 'reviews' | 'settings'>('projects');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  
  const [previewUrls, setPreviewUrls] = useState<{[key: string]: string}>({});
  const [syncQueue, setSyncQueue] = useState<Set<string>>(new Set());

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const ADMIN_PASSWORD = 'hamim@987'; 
  const SESSION_KEY = 'nova_admin_secure_vault_token';
  const MAX_ATTEMPTS = 5;

  useEffect(() => {
    const token = sessionStorage.getItem(SESSION_KEY);
    if (token && token.startsWith('AUTH_OK_')) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    let timer: number;
    if (isLockedOut && lockoutTimer > 0) {
      timer = window.setInterval(() => {
        setLockoutTimer(prev => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLockedOut, lockoutTimer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    if (password === ADMIN_PASSWORD) {
      setIsVerifying(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setVerificationProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          sessionStorage.setItem(SESSION_KEY, `AUTH_OK_${Date.now()}`);
          setIsAuthenticated(true);
          setIsVerifying(false);
        }
      }, 40);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLockedOut(true);
        setLockoutTimer(30);
      }
    }
  };

  const handleImportAsset = (e: React.ChangeEvent<HTMLInputElement>, id: string, target: 'thumb' | 'video' | 'hero' | 'about') => {
    const file = e.target.files?.[0];
    if (file) {
      const assetKey = `${target}-${id}`;
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [assetKey]: blobUrl }));
      setSyncQueue(prev => new Set(prev).add(assetKey));

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'hero') handleChange('heroImage', base64String);
        else if (target === 'about') handleChange('aboutImage', base64String);
        else {
          setLocalData(prev => ({
            ...prev,
            projects: prev.projects.map(p => {
              if (p.id === id) {
                return target === 'thumb' ? { ...p, imageUrl: base64String } : { ...p, videoUrl: base64String };
              }
              return p;
            })
          }));
        }
        setSyncQueue(prev => {
          const next = new Set(prev);
          next.delete(assetKey);
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: keyof PortfolioData, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (type: 'projects' | 'skills' | 'services' | 'socials') => {
    const id = Date.now().toString();
    if (type === 'projects') {
      const newProject: Project = { id, title: 'New Entry', category: localData.projectCategories[0] || 'Design', imageUrl: 'https://picsum.photos/seed/'+id+'/800/600', link: '#' };
      setLocalData(prev => ({ ...prev, projects: [newProject, ...prev.projects] }));
    } else if (type === 'skills') {
      setLocalData(prev => ({ ...prev, skills: [...prev.skills, { id, name: 'New Tech', level: 80 }] }));
    } else if (type === 'services') {
      setLocalData(prev => ({ ...prev, services: [...prev.services, { id, title: 'New Service', description: 'Description', iconName: 'Zap' }] }));
    } else if (type === 'socials') {
      setLocalData(prev => ({ ...prev, socials: [...prev.socials, { id, platform: 'Github', url: '#' }] }));
    }
  };

  const removeItem = (type: keyof PortfolioData, id: string) => {
    setLocalData(prev => ({
      ...prev,
      [type]: (prev[type] as any[]).filter((item: any) => item.id !== id)
    }));
  };

  const updateItem = (type: keyof PortfolioData, id: string, field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      [type]: (prev[type] as any[]).map((item: any) => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addCategory = () => {
    const newCat = prompt("Enter new project category:");
    if (newCat && !localData.projectCategories.includes(newCat)) {
      handleChange('projectCategories', [...localData.projectCategories, newCat]);
    }
  };

  const removeCategory = (cat: string) => {
    if (confirm(`Remove "${cat}" category?`)) {
      handleChange('projectCategories', localData.projectCategories.filter(c => c !== cat));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030014]/98 backdrop-blur-3xl">
        <div className="w-full max-w-md glass p-10 rounded-[3rem] border border-white/10 space-y-8 animate-scale-in">
          <div className="text-center space-y-4">
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto transition-all ${isLockedOut ? 'bg-red-500/10 text-red-500' : 'bg-purple-500/10 text-purple-400'}`}>
              {isLockedOut ? <AlertTriangle size={48} className="animate-bounce" /> : <Lock size={48} />}
            </div>
            <h2 className="text-3xl font-bold font-grotesk text-white">System Access</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black">Authorized Personnel Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              autoFocus 
              disabled={isLockedOut || isVerifying}
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="TERMINAL KEY" 
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-center text-white outline-none focus:border-purple-500 transition-all font-mono tracking-[0.5em] text-lg" 
            />
            <button type="submit" className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black uppercase text-xs tracking-widest">Login</button>
          </form>
          {isLockedOut && <p className="text-center text-red-500 font-bold animate-pulse text-[10px] tracking-widest uppercase">System Lock: {lockoutTimer}s</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-3xl">
      <div className="w-full max-w-7xl h-full max-h-[96vh] glass rounded-[4rem] border border-white/10 flex overflow-hidden animate-scale-in shadow-2xl">
        
        {/* Navigation Sidebar */}
        <div className="w-72 bg-[#05030f]/80 border-r border-white/5 flex flex-col hidden xl:flex">
          <div className="p-10 border-b border-white/5">
             <h2 className="text-2xl font-black text-white tracking-tighter">Rafid Studio</h2>
             <p className="text-[9px] text-purple-500 uppercase tracking-widest font-black mt-1">Admin Portal</p>
          </div>
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
            {[
              { id: 'projects', icon: LayoutGrid, label: 'Portfolio' },
              { id: 'profile', icon: User, label: 'Identity' },
              { id: 'sections', icon: Type, label: 'Sections' },
              { id: 'skills', icon: Target, label: 'Skills' },
              { id: 'services', icon: Briefcase, label: 'Services' },
              { id: 'socials', icon: Globe, label: 'Socials' },
              { id: 'messages', icon: MessageSquare, label: 'Messages' },
              { id: 'reviews', icon: Star, label: 'Reviews' },
              { id: 'settings', icon: SettingsIcon, label: 'Settings' },
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <tab.icon size={18} /><span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-8 border-t border-white/5">
            <button onClick={() => { sessionStorage.removeItem(SESSION_KEY); onClose(); }} className="w-full flex items-center space-x-3 px-6 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/10 rounded-xl transition-all"><LogOut size={16}/><span>Logout</span></button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-transparent overflow-hidden">
          <header className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h3 className="text-3xl font-extrabold text-white capitalize tracking-tight">{activeTab} Workspace</h3>
            <button onClick={() => { onUpdate(localData); onClose(); }} className="px-10 py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all flex items-center space-x-3 shadow-xl">
              <Save size={16}/><span>Sync All Changes</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
            
            {activeTab === 'projects' && (
              <div className="space-y-12 animate-fade-in">
                <div className="p-10 rounded-[3rem] bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="space-y-2">
                     <h4 className="text-3xl font-black text-white tracking-tighter">Project Vault</h4>
                     <p className="text-gray-400 text-sm">Manage your showreels and case studies.</p>
                   </div>
                   <button onClick={() => addItem('projects')} className="px-10 py-5 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-500 transition-all flex items-center space-x-3">
                     <Plus size={20}/><span>New Project</span>
                   </button>
                </div>

                <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-white">Category Protocol</h4>
                    <button onClick={addCategory} className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">+ Add Category</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {localData.projectCategories.map(cat => (
                      <div key={cat} className="flex items-center space-x-3 px-6 py-3 bg-purple-600/20 border border-purple-500/30 rounded-2xl group">
                        <span className="text-xs font-bold text-purple-300">{cat}</span>
                        <button onClick={() => removeCategory(cat)} className="text-purple-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-12">
                  {localData.projects.map(project => (
                    <div key={project.id} className="glass p-10 rounded-[3.5rem] border border-white/5 space-y-10 group/project relative overflow-hidden">
                      <div className="grid xl:grid-cols-2 gap-12">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-500 uppercase px-2">Cover Asset</label>
                          <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-black border border-white/10 relative group/media">
                            <img src={previewUrls[`thumb-${project.id}`] || project.imageUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => fileInputRefs.current[`thumb-${project.id}`]?.click()} className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase">Upload Image</button>
                            </div>
                            <input type="file" className="hidden" ref={el => { fileInputRefs.current[`thumb-${project.id}`] = el; }} onChange={e => handleImportAsset(e, project.id, 'thumb')} accept="image/*" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-500 uppercase px-2">Video Reel (MP4)</label>
                          <div className={`aspect-video rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center ${project.videoUrl ? 'border-purple-500/30 bg-purple-500/5' : 'border-white/5 bg-white/2'}`}>
                            {project.videoUrl ? (
                              <div className="text-center space-y-4">
                                <Play size={40} className="mx-auto text-purple-400" />
                                <button onClick={() => updateItem('projects', project.id, 'videoUrl', undefined)} className="text-red-500 font-bold uppercase text-[10px]">Remove Stream</button>
                              </div>
                            ) : (
                              <button onClick={() => fileInputRefs.current[`vid-${project.id}`]?.click()} className="px-8 py-4 bg-white/5 text-white rounded-xl font-black text-[10px] uppercase">Import Reel</button>
                            )}
                            <input type="file" className="hidden" ref={el => { fileInputRefs.current[`vid-${project.id}`] = el; }} onChange={e => handleImportAsset(e, project.id, 'video')} accept="video/*" />
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Project Name</label><input type="text" value={project.title} onChange={e => updateItem('projects', project.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-purple-500" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Sector</label><select value={project.category} onChange={e => updateItem('projects', project.id, 'category', e.target.value)} className="w-full bg-[#05030f] border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-purple-500">{localData.projectCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                        <div className="flex items-end"><button onClick={() => removeItem('projects', project.id)} className="w-full py-5 bg-red-600/10 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Delete Entry</button></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-12 animate-fade-in max-w-4xl">
                 <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Display Name</label><input type="text" value={localData.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-purple-500 text-lg" /></div>
                      <div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Primary Designation</label><input type="text" value={localData.role} onChange={e => handleChange('role', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-purple-500 text-lg" /></div>
                      <div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Manifesto / Bio</label><textarea value={localData.bio} onChange={e => handleChange('bio', e.target.value)} rows={6} className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white outline-none focus:border-purple-500 resize-none leading-relaxed" /></div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase px-2">Hero Image Asset</label>
                        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-black relative group/hero">
                           <img src={previewUrls['hero-main'] || localData.heroImage} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                             <button onClick={() => fileInputRefs.current['hero-img']?.click()} className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase">Replace Hero Image</button>
                           </div>
                           <input type="file" className="hidden" ref={el => { fileInputRefs.current['hero-img'] = el; }} onChange={e => handleImportAsset(e, 'main', 'hero')} accept="image/*" />
                        </div>
                      </div>
                   </div>
                 </div>

                 <div className="pt-10 border-t border-white/5 grid md:grid-cols-2 gap-10">
                    <div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Hero Main Text</label><input type="text" value={localData.heroMainText} onChange={e => handleChange('heroMainText', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white outline-none" /></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Hero Sub Text</label><input type="text" value={localData.heroSubText} onChange={e => handleChange('heroSubText', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white outline-none" /></div>
                 </div>

                 <div className="pt-10 border-t border-white/5 grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase px-2">About Image Asset</label>
                       <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-black relative group/about">
                          <img src={previewUrls['about-main'] || localData.aboutImage} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/about:opacity-100 transition-opacity flex items-center justify-center">
                             <button onClick={() => fileInputRefs.current['about-img']?.click()} className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase">Replace About Image</button>
                          </div>
                          <input type="file" className="hidden" ref={el => { fileInputRefs.current['about-img'] = el; }} onChange={e => handleImportAsset(e, 'main', 'about')} accept="image/*" />
                       </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase px-2">About Description</label><textarea value={localData.aboutDescription} onChange={e => handleChange('aboutDescription', e.target.value)} rows={8} className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white outline-none resize-none" /></div>
                       <div className="space-y-3"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Official Contact Node</label><input type="text" value={localData.email} onChange={e => handleChange('email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white outline-none" /></div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'sections' && (
              <div className="grid md:grid-cols-2 gap-12 animate-fade-in">
                 {[
                   { id: 'about', title: 'aboutTitle', sub: 'aboutSubtitle' },
                   { id: 'services', title: 'servicesTitle', sub: 'servicesSubtitle' },
                   { id: 'portfolio', title: 'portfolioTitle', sub: 'portfolioSubtitle' },
                   { id: 'reviews', title: 'reviewsTitle', sub: 'reviewsSubtitle' },
                   { id: 'contact', title: 'contactTitle', sub: 'contactSubtitle' }
                 ].map(section => (
                   <div key={section.id} className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
                      <h4 className="text-xl font-bold capitalize text-white">{section.id} Configuration</h4>
                      <div className="space-y-4">
                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Section Heading</label><input type="text" value={(localData as any)[section.title]} onChange={e => handleChange(section.title as any, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Section Sub-Heading</label><input type="text" value={(localData as any)[section.sub]} onChange={e => handleChange(section.sub as any, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" /></div>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-12 animate-fade-in max-w-4xl">
                 <button onClick={() => addItem('skills')} className="px-10 py-5 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3"><Plus size={18}/><span>Append Skill Node</span></button>
                 <div className="grid gap-6">
                    {localData.skills.map(skill => (
                      <div key={skill.id} className="glass p-8 rounded-[2rem] border border-white/5 flex items-center gap-10">
                        <div className="flex-1 space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase">Skill Designation</label><input type="text" value={skill.name} onChange={e => updateItem('skills', skill.id, 'name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold" /></div>
                        <div className="w-48 space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase">Proficiency ({skill.level}%)</label><input type="range" min="0" max="100" value={skill.level} onChange={e => updateItem('skills', skill.id, 'level', parseInt(e.target.value))} className="w-full" /></div>
                        <button onClick={() => removeItem('skills', skill.id)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={20}/></button>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-12 animate-fade-in">
                 <button onClick={() => addItem('services')} className="px-10 py-5 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3"><Plus size={18}/><span>Append Service Module</span></button>
                 <div className="grid lg:grid-cols-2 gap-10">
                    {localData.services.map(service => (
                      <div key={service.id} className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="w-14 h-14 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center"><Zap size={28}/></div>
                           <button onClick={() => removeItem('services', service.id)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={20}/></button>
                        </div>
                        <div className="space-y-4">
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Service Title</label><input type="text" value={service.title} onChange={e => updateItem('services', service.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white font-bold" /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase px-2">Short Brief</label><textarea value={service.description} onChange={e => updateItem('services', service.id, 'description', e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white resize-none" /></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'socials' && (
               <div className="space-y-12 animate-fade-in max-w-4xl">
                 <button onClick={() => addItem('socials')} className="px-10 py-5 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3"><Plus size={18}/><span>Register Social Node</span></button>
                 <div className="grid gap-6">
                    {localData.socials.map(social => (
                      <div key={social.id} className="glass p-8 rounded-[2rem] border border-white/5 flex items-center gap-8">
                        <div className="w-48 space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase">Platform</label><select value={social.platform} onChange={e => updateItem('socials', social.id, 'platform', e.target.value)} className="w-full bg-[#05030f] border border-white/10 rounded-xl p-4 text-white">
                          {['Twitter', 'Instagram', 'Linkedin', 'Github', 'Facebook'].map(p => <option key={p} value={p}>{p}</option>)}
                        </select></div>
                        <div className="flex-1 space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase">Direct Link URL</label><input type="text" value={social.url} onChange={e => updateItem('socials', social.id, 'url', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" /></div>
                        <button onClick={() => removeItem('socials', social.id)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={20}/></button>
                      </div>
                    ))}
                 </div>
               </div>
            )}

            {activeTab === 'settings' && (
               <div className="space-y-12 animate-fade-in max-w-4xl">
                  <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-8">
                    <h4 className="text-2xl font-bold text-white flex items-center space-x-3"><SettingsIcon size={24}/><span>Global Preferences</span></h4>
                    <div className="grid gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase px-2 flex items-center space-x-2"><MapPin size={12}/><span>Studio Location</span></label>
                        <input type="text" value={localData.location} onChange={e => handleChange('location', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white outline-none focus:border-purple-500" placeholder="e.g. San Francisco, CA" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase px-2 flex items-center space-x-2"><FileText size={12}/><span>Active CV Protocol URL</span></label>
                        <input type="text" value={localData.cvUrl} onChange={e => handleChange('cvUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white outline-none focus:border-purple-500" placeholder="https://..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase px-2 flex items-center space-x-2"><Globe size={12}/><span>System Email</span></label>
                        <input type="text" value={localData.email} onChange={e => handleChange('email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white outline-none focus:border-purple-500" />
                      </div>
                    </div>
                  </div>
               </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-12 animate-fade-in">
                 <div className="grid gap-8">
                    {localData.messages?.length > 0 ? localData.messages.map(msg => (
                      <div key={msg.id} className={`glass p-10 rounded-[3rem] border ${msg.isRead ? 'border-white/5' : 'border-purple-500/30 bg-purple-500/5'} space-y-6 relative`}>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center"><User size={24}/></div>
                               <div>
                                  <h4 className="font-bold text-white">{msg.name}</h4>
                                  <p className="text-xs text-gray-500">{msg.email}</p>
                               </div>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{msg.timestamp}</p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-sm font-black text-purple-400 uppercase tracking-widest">{msg.subject}</p>
                            <p className="text-gray-300 leading-relaxed">{msg.message}</p>
                         </div>
                         <div className="flex justify-end pt-4 border-t border-white/5">
                            <button onClick={() => removeItem('messages', msg.id)} className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2"><Trash2 size={14}/><span>Destroy Message</span></button>
                         </div>
                      </div>
                    )) : (
                      <div className="py-24 text-center glass rounded-[4rem] border border-dashed border-white/5">
                         <MessageSquare size={48} className="mx-auto text-gray-800 mb-6" />
                         <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Inbox Zero Maintained</p>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-12 animate-fade-in">
                 <div className="grid lg:grid-cols-2 gap-10">
                    {localData.reviews?.length > 0 ? localData.reviews.map(review => (
                      <div key={review.id} className="glass p-10 rounded-[3rem] border border-white/5 space-y-8">
                         <div className="flex items-center justify-between">
                            <div className="flex space-x-1">
                               {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />)}
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${review.isApproved ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                               {review.isApproved ? 'Publicly Visible' : 'Awaiting Approval'}
                            </div>
                         </div>
                         <p className="text-gray-300 leading-relaxed italic">"{review.content}"</p>
                         <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center space-x-4">
                               <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center"><User size={20}/></div>
                               <div><h5 className="font-bold text-white">{review.clientName}</h5><p className="text-[10px] text-gray-500 uppercase">{review.clientRole}</p></div>
                            </div>
                            <div className="flex items-center space-x-4">
                               {!review.isApproved && <button onClick={() => updateItem('reviews', review.id, 'isApproved', true)} className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"><CheckCircle size={18}/></button>}
                               <button onClick={() => removeItem('reviews', review.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                            </div>
                         </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-24 text-center glass rounded-[4rem] border border-dashed border-white/5">
                         <Star size={48} className="mx-auto text-gray-800 mb-6" />
                         <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">No Feedback Records Found</p>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
