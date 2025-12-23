
import { PortfolioData } from './types';

export const INITIAL_DATA: PortfolioData = {
  name: "Rafid Studio",
  role: "Lead UI & UX Designer",
  bio: "With a passion for clean, intuitive, and effective design, I create digital products that enhance user engagement.",
  heroImage: "https://picsum.photos/seed/designer/800/1000",
  heroMainText: "Designer",
  heroSubText: "UI & UX",
  aboutImage: "https://picsum.photos/seed/creative/800/800",
  aboutTitle: "Passionate Designer with a Creative Edge",
  aboutSubtitle: "About Me",
  aboutDescription: "I help brands turn their visions into stunning digital experiences. My approach combines psychological insights with pixel-perfect aesthetics.",
  servicesTitle: "What I Can Do For You",
  servicesSubtitle: "My Services",
  portfolioTitle: "Latest Creative Projects",
  portfolioSubtitle: "Portfolio",
  contactTitle: "Let's Create Something Great Together",
  contactSubtitle: "Contact Me",
  reviewsTitle: "What Clients Say",
  reviewsSubtitle: "Testimonials",
  email: "hello@rafid.studio",
  location: "San Francisco, CA",
  cvUrl: "#",
  projectCategories: ['UI/UX Design', 'Website Design', 'App Design', 'Graphic Design'],
  skills: [
    { id: '1', name: 'UI/UX Design', level: 95 },
    { id: '2', name: 'Website Design', level: 88 }
  ],
  services: [
    { 
      id: '1', 
      title: 'UI/UX Design', 
      description: 'User-centered designs that are visually engaging.', 
      iconName: 'Layout'
    }
  ],
  projects: [
    { id: '1', title: 'Fintech Mobile App', category: 'App Design', imageUrl: 'https://picsum.photos/seed/fintech/600/400', link: '#' }
  ],
  socials: [
    { id: '1', platform: 'Twitter', url: 'https://twitter.com' },
    { id: '2', platform: 'Github', url: 'https://github.com' }
  ],
  messages: [],
  reviews: [
    {
      id: 'r1',
      clientName: 'Sarah Jenkins',
      clientRole: 'CEO at TechFlow',
      content: 'Rafid Studio transformed our brand identity into something truly futuristic. The attention to detail is unmatched.',
      rating: 5,
      date: '2024-03-15',
      isApproved: true
    },
    {
      id: 'r2',
      clientName: 'Michael Chen',
      clientRole: 'Product Manager',
      content: 'The UI/UX work exceeded our expectations. Clean, modern, and highly functional. Highly recommended!',
      rating: 5,
      date: '2024-04-02',
      isApproved: true
    }
  ]
};
