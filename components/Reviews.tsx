
import React, { useState } from 'react';
import { Star, MessageSquare, Quote, Send, CheckCircle, User } from 'lucide-react';
import { PortfolioData, Review } from '../types';

interface ReviewsProps {
  data: PortfolioData;
  onUpdate: (data: PortfolioData) => void;
}

const Reviews: React.FC<ReviewsProps> = ({ data, onUpdate }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        clientName: formData.name,
        clientRole: formData.role,
        content: formData.content,
        rating: formData.rating,
        date: new Date().toISOString().split('T')[0],
        isApproved: false // Requires admin approval
      };

      const updatedData = {
        ...data,
        reviews: [...(data.reviews || []), newReview]
      };

      onUpdate(updatedData);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsFormOpen(false);
        setFormData({ name: '', role: '', content: '', rating: 5 });
      }, 3000);
    }, 1500);
  };

  const approvedReviews = data.reviews?.filter(r => r.isApproved) || [];

  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <h4 className="text-purple-400 font-bold uppercase tracking-widest text-sm">{data.reviewsSubtitle}</h4>
            <h2 className="text-4xl md:text-5xl font-grotesk font-bold text-white">{data.reviewsTitle}</h2>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl active:scale-95"
          >
            Leave a Review
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedReviews.map((review) => (
            <div key={review.id} className="glass p-8 rounded-[2.5rem] border border-white/5 relative group hover:border-purple-500/30 transition-all">
              <Quote className="absolute top-8 right-8 text-white/5 group-hover:text-purple-500/10 transition-colors" size={60} />
              
              <div className="space-y-6 relative z-10">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} 
                    />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">"{review.content}"</p>
                
                <div className="flex items-center space-x-4 pt-4 border-t border-white/5">
                  <div className="w-12 h-12 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-purple-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{review.clientName}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{review.clientRole}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {approvedReviews.length === 0 && (
            <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-white/10">
              <MessageSquare className="mx-auto text-gray-700 mb-4" size={48} />
              <p className="text-gray-500 font-medium">Be the first to share your experience.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 space-y-6 animate-scale-in">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white"
            >
              <CheckCircle size={24} className="rotate-45" />
            </button>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold font-grotesk text-white">Share Your Feedback</h3>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-black">Help us grow and improve</p>
            </div>

            {isSuccess ? (
              <div className="py-12 text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto text-purple-400">
                  <CheckCircle size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-white">Review Received!</p>
                  <p className="text-gray-400">Thank you! Your review will be visible after verification.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase">Your Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase">Your Role/Title</label>
                    <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500" placeholder="e.g. Director" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Rating</label>
                  <div className="flex space-x-2">
                    {[1,2,3,4,5].map(val => (
                      <button key={val} type="button" onClick={() => setFormData({...formData, rating: val})} className="p-1">
                        <Star size={24} className={val <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Your Experience</label>
                  <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-purple-500 resize-none" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-purple-600 rounded-xl font-black text-white text-xs uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-purple-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Send size={16} /><span>Submit Review</span></>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
