
export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  longDescription?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  videoUrl?: string; // Optional field for video portfolio
  link: string;
}

export interface SocialLink {
  id: string;
  platform: 'Twitter' | 'Instagram' | 'Linkedin' | 'Github' | 'Facebook';
  url: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Review {
  id: string;
  clientName: string;
  clientRole: string;
  content: string;
  rating: number;
  date: string;
  isApproved: boolean;
}

export interface PortfolioData {
  name: string;
  role: string;
  bio: string;
  heroImage: string;
  heroMainText: string;
  heroSubText: string;
  aboutImage: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  servicesTitle: string;
  servicesSubtitle: string;
  portfolioTitle: string;
  portfolioSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  email: string;
  location: string;
  cvUrl: string;
  skills: Skill[];
  services: Service[];
  projects: Project[];
  socials: SocialLink[];
  messages: ContactMessage[];
  reviews: Review[];
  projectCategories: string[];
}
