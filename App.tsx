
import React, { useState, useEffect } from 'react';
import { PortfolioData } from './types';
import { INITIAL_DATA } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  const handleUpdateData = (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem('portfolio_data', JSON.stringify(newData));
  };

  const handleInquire = (serviceTitle: string) => {
    setContactSubject(`Inquiry: ${serviceTitle}`);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030014] overflow-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[100px] rounded-full"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-indigo-900/10 blur-[80px] rounded-full"></div>
      </div>

      <div className="relative z-10">
        <Navbar data={data} onAdminToggle={() => setIsAdminOpen(!isAdminOpen)} />
        
        <main>
          <Hero data={data} />
          <About data={data} />
          <Services data={data} onInquire={handleInquire} />
          <Portfolio data={data} />
          <Reviews data={data} onUpdate={handleUpdateData} />
          <Contact data={data} onUpdate={handleUpdateData} initialSubject={contactSubject} />
        </main>

        <Footer data={data} />
      </div>

      {isAdminOpen && (
        <AdminPanel 
          data={data} 
          onUpdate={handleUpdateData} 
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
