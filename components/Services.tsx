
import React, { useState } from 'react';
import { PortfolioData, Service } from '../types';
import * as LucideIcons from 'lucide-react';
import { X, ChevronRight } from 'lucide-react';

interface ServicesProps {
  data: PortfolioData;
  onInquire?: (title: string) => void;
}

const Services: React.FC<ServicesProps> = ({ data, onInquire }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleInquiryClick = () => {
    if (selectedService && onInquire) {
      onInquire(selectedService.title);
      setSelectedService(null);
    }
  };

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6 text-center space-y-16">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h4 className="text-purple-400 font-bold uppercase tracking-widest text-sm">{data.servicesSubtitle}</h4>
          <h2 className="text-4xl md:text-5xl font-grotesk font-bold">{data.servicesTitle}</h2>
          <p className="text-gray-400">Crafting visually engaging interfaces that are both intuitive and user-centered, ensuring a seamless experience.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.services.map((service) => {
            const Icon = (LucideIcons as any)[service.iconName] || LucideIcons.Zap;
            return (
              <div 
                key={service.id} 
                className="group relative p-8 glass rounded-3xl border border-white/5 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                
                <div className="relative space-y-6">
                  <div className="w-14 h-14 bg-gradient-to-tr from-purple-600/20 to-blue-500/20 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Icon size={32} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold font-grotesk group-hover:text-purple-300 transition-colors">{service.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed text-center">
                      {service.description}
                    </p>
                  </div>
                  <button className="text-sm font-bold text-blue-400 flex items-center space-x-2 group/btn mx-auto">
                    <span>Read more</span>
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 space-y-6 animate-scale-in">
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 p-2 glass rounded-full hover:bg-white/10 transition-all"
            >
              <X size={24} />
            </button>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                {(() => {
                  const Icon = (LucideIcons as any)[selectedService.iconName] || LucideIcons.Zap;
                  return <Icon size={40} />;
                })()}
              </div>
              <div>
                <h4 className="text-purple-400 font-bold uppercase tracking-widest text-xs">Service Detail</h4>
                <h3 className="text-3xl font-bold font-grotesk">{selectedService.title}</h3>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-white font-medium">{selectedService.description}</p>
              <p className="text-gray-400 leading-relaxed">
                {selectedService.longDescription || "Full details for this service are currently being updated by our team. Check back soon for deep case studies and methodologies."}
              </p>
            </div>
            <div className="pt-4">
              <button 
                onClick={handleInquiryClick}
                className="px-8 py-3 bg-purple-600 rounded-xl font-bold text-sm hover:bg-purple-500 transition-all"
              >
                Inquire About This Service
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
