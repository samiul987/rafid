
import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { PortfolioData, ContactMessage } from '../types';

interface ContactProps {
  data: PortfolioData;
  onUpdate?: (newData: PortfolioData) => void;
  initialSubject?: string;
}

const Contact: React.FC<ContactProps> = ({ data, onUpdate, initialSubject }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [subject, setSubject] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      subject: subject || 'General Inquiry',
      message: formData.message,
      timestamp: new Date().toLocaleString(),
      isRead: false
    };

    // Simulate network delay
    setTimeout(() => {
      if (onUpdate) {
        const updatedMessages = [newMessage, ...(data.messages || [])];
        onUpdate({
          ...data,
          messages: updatedMessages
        });
      }

      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
      setSubject('');
      
      setTimeout(() => setIsSent(false), 5000);
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-purple-400 font-bold uppercase tracking-widest text-sm">{data.contactSubtitle}</h4>
              <h2 className="text-4xl md:text-5xl font-grotesk font-bold text-white">{data.contactTitle}</h2>
              <p className="text-gray-400 text-lg">
                Have a project in mind? Reach out and let's discuss how we can bring your vision to life with cutting-edge design and technology.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 glass p-6 rounded-2xl border border-white/5">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Me</p>
                  <p className="text-lg font-bold">{data.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 glass p-6 rounded-2xl border border-white/5">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-lg font-bold">{data.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-3xl opacity-30 rounded-full"></div>
            <form onSubmit={handleSubmit} className="relative glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 outline-none transition-all text-white" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 outline-none transition-all text-white" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Subject</label>
                <input 
                  required 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 outline-none transition-all text-white" 
                  placeholder="Project Inquiry" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 outline-none transition-all resize-none text-white" 
                  placeholder="Tell me about your project..."
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting || isSent}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/20 flex items-center justify-center space-x-3 disabled:opacity-70"
              >
                {isSent ? (
                  <>
                    <CheckCircle size={24} />
                    <span>Message Sent!</span>
                  </>
                ) : isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
