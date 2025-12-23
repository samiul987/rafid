
import React from 'react';
import { PortfolioData } from '../types';

interface AboutProps {
  data: PortfolioData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-700"></div>
            <div className="relative aspect-square rounded-[2rem] overflow-hidden glass border border-white/10 p-2">
              <img src={data.aboutImage} alt="About Me" className="w-full h-full object-cover rounded-[1.8rem] opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <h4 className="text-purple-400 font-bold uppercase tracking-widest text-sm">{data.aboutSubtitle}</h4>
              <h2 className="text-4xl md:text-5xl font-grotesk font-bold text-white">{data.aboutTitle}</h2>
              <p className="text-gray-400 text-lg leading-relaxed">{data.aboutDescription}</p>
            </div>
            <div className="space-y-8">
              {data.skills.map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex justify-between items-end"><span className="font-bold text-gray-200">{skill.name}</span><span className="text-sm font-mono text-purple-400">{skill.level}%</span></div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${skill.level}%` }}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
